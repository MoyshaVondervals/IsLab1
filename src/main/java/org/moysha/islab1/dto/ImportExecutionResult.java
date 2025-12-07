package org.moysha.islab1.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImportExecutionResult {
    private int importedObjects;
    private String importFileName;
    private String storageObjectKey;
    private String storageBucket;
}
