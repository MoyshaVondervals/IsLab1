package org.moysha.islab1.storage;

public record PendingObjectDescriptor(
        String bucket,
        String pendingKey,
        String finalKey,
        String originalFileName,
        long sizeBytes
) {
}
