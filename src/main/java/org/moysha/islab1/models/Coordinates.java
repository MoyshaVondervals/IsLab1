package org.moysha.islab1.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;


@Entity
@Table(name = "coordinates")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Coordinates {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @NotNull(message = "X coordinate cannot be null")
    private Float x;

    @Column(nullable = false)
    @NotNull(message = "Y coordinate cannot be null")
    private Double y;
}