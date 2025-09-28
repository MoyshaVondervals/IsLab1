package org.moysha.islab1.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Positive;
import lombok.*;



@Entity
@Table(name = "dragon_caves")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DragonCave {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "number_of_treasures")
    @Positive(message = "Number of treasures must be positive")
    private Float numberOfTreasures;
}