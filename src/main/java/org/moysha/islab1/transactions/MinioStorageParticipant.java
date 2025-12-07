package org.moysha.islab1.transactions;

import org.moysha.islab1.storage.MinioStorageService;
import org.moysha.islab1.storage.PendingObjectDescriptor;

public class MinioStorageParticipant implements TwoPhaseCommitParticipant {

    private final MinioStorageService storageService;
    private final PendingObjectDescriptor descriptor;
    private final byte[] payload;
    private final String contentType;

    public MinioStorageParticipant(MinioStorageService storageService,
                                   PendingObjectDescriptor descriptor,
                                   byte[] payload,
                                   String contentType) {
        this.storageService = storageService;
        this.descriptor = descriptor;
        this.payload = payload;
        this.contentType = contentType;
    }

    @Override
    public void prepare() throws Exception {
        storageService.uploadPending(descriptor, payload, contentType);
    }

    @Override
    public void commit() throws Exception {
        storageService.promotePending(descriptor);
    }

    @Override
    public void rollback() {
        storageService.cleanupPending(descriptor);
        storageService.removeFinalObject(descriptor);
    }
}
