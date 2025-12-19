package org.moysha.islab1.services;

import lombok.RequiredArgsConstructor;
import org.moysha.islab1.dto.ImportAuditMetadata;
import org.moysha.islab1.dto.ImportExecutionResult;
import org.moysha.islab1.storage.MinioStorageService;
import org.moysha.islab1.storage.PendingObjectDescriptor;
import org.moysha.islab1.transactions.DatabaseTransactionParticipant;
import org.moysha.islab1.transactions.MinioStorageParticipant;
import org.moysha.islab1.transactions.TwoPhaseCommitManager;
import org.moysha.islab1.transactions.TwoPhaseCommitParticipant;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.UnexpectedRollbackException;
import org.springframework.dao.TransientDataAccessException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

@Service
@RequiredArgsConstructor
public class DragonImportCoordinator {

    private static final Logger log = LoggerFactory.getLogger(DragonImportCoordinator.class);
    private static final int MAX_RETRIES = 3;

    private final PlatformTransactionManager transactionManager;
    private final MinioStorageService storageService;
    private final DragonService dragonService;
    private final SimpMessagingTemplate messagingTemplate;

    public ImportExecutionResult importPayload(byte[] payload, String originalFileName, String contentType) throws Exception {
        PendingObjectDescriptor descriptor = storageService.createDescriptor(originalFileName, payload.length);

        MinioStorageParticipant storageParticipant =
                new MinioStorageParticipant(storageService, descriptor, payload, contentType);

        AtomicReference<DragonService.UploadResult> uploadResult = new AtomicReference<>();

        DatabaseTransactionParticipant.TransactionCallback callback =
                () -> uploadResult.set(dragonService.uploadDragon(new String(payload, StandardCharsets.UTF_8),
                        new ImportAuditMetadata(
                                descriptor.bucket(),
                                descriptor.finalKey(),
                                descriptor.originalFileName(),
                                descriptor.sizeBytes(),
                                "COMPLETED"
                        )));

        DatabaseTransactionParticipant dbParticipant =
                new DatabaseTransactionParticipant(transactionManager, callback,
                        TransactionDefinition.ISOLATION_READ_COMMITTED);

        List<TwoPhaseCommitParticipant> participants = List.of(storageParticipant, dbParticipant);
        TwoPhaseCommitManager manager = new TwoPhaseCommitManager(participants);

        int attempt = 0;
        while (true) {
            try {
                manager.execute();
                break;
            } catch (TransientDataAccessException | UnexpectedRollbackException ex) {
                attempt++;
                if (attempt >= MAX_RETRIES) {
                    log.warn("Import 2PC failed after {} attempts due to transient error", attempt, ex);
                    throw ex;
                }
                long backoffMs = 100L * attempt;
                log.warn("Import 2PC transient failure (attempt {} of {}), retrying after {} ms",
                        attempt, MAX_RETRIES, backoffMs, ex);
                Thread.sleep(backoffMs);
            }
        }

        DragonService.UploadResult result = uploadResult.get();
        if (result != null && !result.createdDragons().isEmpty()) {
            messagingTemplate.convertAndSend("/topic/echo", Map.of(
                    "event", "dragonsImported",
                    "dragons", result.createdDragons()
            ));
        }

        return new ImportExecutionResult(
                result != null ? result.importedCount() : 0,
                descriptor.originalFileName(),
                descriptor.finalKey(),
                descriptor.bucket());
    }
}
