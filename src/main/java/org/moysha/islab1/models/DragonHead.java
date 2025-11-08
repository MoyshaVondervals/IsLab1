package org.moysha.islab1.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Positive;
import lombok.*;


@Entity
@Table(name = "dragon_heads")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DragonHead {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Positive(message = "Size must be positive")
    private Long size;

    @Positive(message = "Eyes count must be positive")
    private Integer eyesCount;

    @Positive(message = "Tooth count must be positive")
    private Integer toothCount;
}