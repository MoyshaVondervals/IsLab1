package org.moysha.islab1.models;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "operation_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class OperationHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, optional = false)
    @JoinColumn(name = "operation_owner", nullable = false,
            foreignKey = @ForeignKey(name = "fk_owner"))
    @NotNull(message = "Owner cannot be null")
    private User operationOwner;

    @Column(name = "added_objects")
    private long affectedObjects;

    @Column(name = "import_file_name")
    private String importFileName;

    @Column(name = "storage_object_key")
    private String storageObjectKey;

    @Column(name = "storage_bucket")
    private String storageBucket;

    @Column(name = "file_size_bytes")
    private Long fileSizeBytes;

    @Column(name = "storage_status")
    private String storageStatus;

    @Column(updatable = false, nullable = false)
    @CreationTimestamp
    private LocalDateTime creationDate;


}
