package org.moysha.islab1.storage;

import io.minio.BucketExistsArgs;
import io.minio.CopyObjectArgs;
import io.minio.CopySource;
import io.minio.GetObjectArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MinioStorageService {

    private static final Logger log = LoggerFactory.getLogger(MinioStorageService.class);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy/MM/dd");
    private static final int MAX_SAFE_NAME_LENGTH = 255;

    private final MinioClient minioClient;
    private final StorageProperties storageProperties;

    @PostConstruct
    public void ensureBucket() {
        try {
            boolean exists = minioClient.bucketExists(
                    BucketExistsArgs.builder().bucket(storageProperties.getBucket()).build());
            if (!exists) {
                minioClient.makeBucket(
                        MakeBucketArgs.builder().bucket(storageProperties.getBucket()).build());
            }
        } catch (Exception e) {
            log.warn("MinIO is unavailable during startup; bucket {} not verified/created yet. " +
                            "Operations will fail until storage is reachable.",
                    storageProperties.getBucket(), e);
        }
    }

    public PendingObjectDescriptor createDescriptor(String originalFileName, long sizeBytes) {
        String safeName = sanitizeFileName(originalFileName);
        String uuid = UUID.randomUUID().toString();
        String datedPath = DATE_FORMATTER.format(LocalDate.now());
        String finalKey = "imports/%s/%s-%s".formatted(datedPath, uuid, safeName);
        String pendingKey = "pending/%s-%s".formatted(uuid, safeName);
        return new PendingObjectDescriptor(storageProperties.getBucket(), pendingKey, finalKey, safeName, sizeBytes);
    }

    public void uploadPending(PendingObjectDescriptor descriptor, byte[] data, String contentType) throws Exception {
        ByteArrayInputStream inputStream = new ByteArrayInputStream(data);
        PutObjectArgs.Builder builder = PutObjectArgs.builder()
                .bucket(descriptor.bucket())
                .object(descriptor.pendingKey())
                .stream(inputStream, data.length, -1)
                .contentType(StringUtils.hasText(contentType) ? contentType : "application/json");
        minioClient.putObject(builder.build());
    }

    public void promotePending(PendingObjectDescriptor descriptor) throws Exception {
        CopySource source = CopySource.builder()
                .bucket(descriptor.bucket())
                .object(descriptor.pendingKey())
                .build();
        CopyObjectArgs copy = CopyObjectArgs.builder()
                .bucket(descriptor.bucket())
                .object(descriptor.finalKey())
                .source(source)
                .build();
        minioClient.copyObject(copy);
        cleanupPending(descriptor);
    }

    public void cleanupPending(PendingObjectDescriptor descriptor) {
        try {
            minioClient.removeObject(RemoveObjectArgs.builder()
                    .bucket(descriptor.bucket())
                    .object(descriptor.pendingKey())
                    .build());
        } catch (Exception e) {
            log.warn("Failed to cleanup pending object {}", descriptor.pendingKey(), e);
            throw new IllegalStateException("Pending object cleanup failed for " + descriptor.pendingKey(), e);
        }
    }

    public void removeFinalObject(PendingObjectDescriptor descriptor) {
        try {
            minioClient.removeObject(RemoveObjectArgs.builder()
                    .bucket(descriptor.bucket())
                    .object(descriptor.finalKey())
                    .build());
        } catch (Exception e) {
            log.warn("Failed to remove finalized object {}", descriptor.finalKey(), e);
        }
    }

    public InputStream downloadObject(String bucket, String objectKey) throws Exception {
        return minioClient.getObject(GetObjectArgs.builder()
                .bucket(bucket != null ? bucket : storageProperties.getBucket())
                .object(objectKey)
                .build());
    }

    public String getBucketName() {
        return storageProperties.getBucket();
    }

    private String sanitizeFileName(String originalFileName) {
        if (!StringUtils.hasText(originalFileName)) {
            return "dragons-import.json";
        }
        String normalized = originalFileName
                .replaceAll("[^a-zA-Z0-9.\\-_]", "_")
                .strip();
        if (!StringUtils.hasText(normalized)) {
            return "dragons-import.json";
        }
        return normalized.length() > MAX_SAFE_NAME_LENGTH
                ? normalized.substring(0, MAX_SAFE_NAME_LENGTH)
                : normalized;
    }
}
