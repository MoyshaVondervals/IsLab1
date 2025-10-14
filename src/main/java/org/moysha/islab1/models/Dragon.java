package org.moysha.islab1.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;
import org.moysha.islab1.unums.DragonType;


@Entity
@Table(name = "dragons")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Dragon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    @NotBlank(message = "Name cannot be blank")
    @NotNull(message = "Name cannot be null")
    private String name;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, optional = false)
    @JoinColumn(name = "coordinates_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_dragon_coordinates"))
    @NotNull(message = "Coordinates cannot be null")
    private Coordinates coordinates;

    @Column(updatable = false, nullable = false)
    @CreationTimestamp
    private LocalDateTime creationDate;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, optional = false)
    @JoinColumn(name = "cave_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_dragon_cave"))
    @NotNull(message = "Cave cannot be null")
    private DragonCave cave;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "killer_id",
            foreignKey = @ForeignKey(name = "fk_dragon_killer"), nullable = true)
    private Person killer;

    @Column(nullable = false)
    @Positive(message = "Age must be positive")
    private long age;

    @Column(nullable = false)
    @NotNull(message = "Description cannot be null")
    private String description;

    @Column
    @Positive(message = "Wingspan must be positive")
    private Float wingspan;

    @Enumerated(EnumType.STRING)
    private DragonType type;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "head_id",
            foreignKey = @ForeignKey(name = "fk_dragon_head"))
    private DragonHead head;
}