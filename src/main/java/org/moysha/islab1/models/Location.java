package org.moysha.islab1.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;


@Entity
@Table(name = "locations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @NotNull(message = "X coordinate cannot be null")
    private Float x;

    private float y;

    @Column(nullable = false)
    @NotNull(message = "Z coordinate cannot be null")
    private Integer z;

    private String name;
}