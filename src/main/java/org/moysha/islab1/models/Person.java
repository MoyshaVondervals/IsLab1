package org.moysha.islab1.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.moysha.islab1.unums.Color;
import org.moysha.islab1.unums.Country;


@Entity
@Table(name = "persons")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @NotBlank(message = "Name cannot be blank")
    @NotNull(message = "Name cannot be null")
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @NotNull(message = "Eye color cannot be null")
    private Color eyeColor;

    @Enumerated(EnumType.STRING)
    private Color hairColor;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "location_id")
    private Location location;

    @Column(nullable = false, unique = true)
    @NotBlank(message = "Passport ID cannot be blank")
    @NotNull(message = "Passport ID cannot be null")
    private String passportID;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @NotNull(message = "Nationality cannot be null")
    private Country nationality;
}