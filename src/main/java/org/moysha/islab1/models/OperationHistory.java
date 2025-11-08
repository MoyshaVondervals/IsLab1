package org.moysha.islab1.models;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;


import java.time.LocalDateTime;

@Entity
@Table(name = "operation_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
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

    @Column(updatable = false, nullable = false)
    @CreationTimestamp
    private LocalDateTime creationDate;




}
