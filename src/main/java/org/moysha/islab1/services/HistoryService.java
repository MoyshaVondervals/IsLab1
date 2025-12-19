package org.moysha.islab1.services;

import lombok.RequiredArgsConstructor;
import org.moysha.islab1.cache.LogCacheStats;
import org.moysha.islab1.dto.HistoryDTO;
import org.moysha.islab1.dto.ImportAuditMetadata;
import org.moysha.islab1.models.OperationHistory;
import org.moysha.islab1.repositories.HistoryRepository;
import org.moysha.islab1.unums.Role;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class HistoryService {
    private final HistoryRepository historyRepository;
    private final UserService userService;

    public ResponseEntity<String> addImport(int added, ImportAuditMetadata metadata) {
        OperationHistory operation = OperationHistory.builder()
                .operationOwner(userService.getCurrentUser())
                .affectedObjects(added)
                .importFileName(metadata != null ? metadata.getImportFileName() : null)
                .storageBucket(metadata != null ? metadata.getStorageBucket() : null)
                .storageObjectKey(metadata != null ? metadata.getStorageObjectKey() : null)
                .fileSizeBytes(metadata != null ? metadata.getFileSizeBytes() : null)
                .storageStatus(metadata != null ? metadata.getStorageStatus() : "UNKNOWN")
                .build();
        historyRepository.save(operation);
        return ResponseEntity.ok("Успех");
    }

    @LogCacheStats
    public ResponseEntity<List<HistoryDTO>> getHistory() {
        List<OperationHistory> operations;
        List<HistoryDTO> historyDTOS = new ArrayList<>();
        if (userService.getCurrentUser().getRole() == Role.USER) {
            operations = historyRepository.findAllByOperationOwner_Id(userService.getCurrentUser().getId());
        } else {
            operations = historyRepository.findAll();
        }
        for (OperationHistory operationHistory : operations) {
            HistoryDTO dto = HistoryDTO.builder()
                    .id(operationHistory.getId())
                    .operationOwner(operationHistory.getOperationOwner())
                    .affectedObjects(operationHistory.getAffectedObjects())
                    .creationDate(operationHistory.getCreationDate())
                    .importFileName(operationHistory.getImportFileName())
                    .storageBucket(operationHistory.getStorageBucket())
                    .storageObjectKey(operationHistory.getStorageObjectKey())
                    .fileSizeBytes(operationHistory.getFileSizeBytes())
                    .storageStatus(operationHistory.getStorageStatus())
                    .downloadPath(operationHistory.getStorageObjectKey() != null
                            ? "/import/history/" + operationHistory.getId() + "/file"
                            : null)
                    .build();
            historyDTOS.add(dto);
        }
        return new ResponseEntity<>(historyDTOS, HttpStatus.OK);

    }

    public Optional<OperationHistory> getById(Long id) {
        return historyRepository.findById(id);
    }
}
