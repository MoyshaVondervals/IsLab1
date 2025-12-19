package org.moysha.islab1.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImportAuditMetadata {
    private String storageBucket;
    private String storageObjectKey;
    private String importFileName;
    private long fileSizeBytes;
    private String storageStatus;
}
