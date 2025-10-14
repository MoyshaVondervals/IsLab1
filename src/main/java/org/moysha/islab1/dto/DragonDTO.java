package org.moysha.islab1.dto;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.moysha.islab1.models.Coordinates;
import org.moysha.islab1.models.DragonCave;
import org.moysha.islab1.models.DragonHead;
import org.moysha.islab1.models.Person;
import org.moysha.islab1.unums.DragonType;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DragonDTO {

    private Long id;

    @NotBlank(message = "Name cannot be blank")
    @NotNull(message = "Name cannot be null")
    private String name;

    @NotNull(message = "Coordinates cannot be null")
    private CoordinatesDTO coordinates;

    @NotNull(message = "Coordinates cannot be null")
    private LocalDateTime creationDate;

    @NotNull(message = "Cave cannot be null")
    private DragonCaveDTO cave;

    private PersonDTO killer;

    @Positive(message = "Age must be positive")
    private long age;

    @NotNull(message = "Description cannot be null")
    private String description;

    @Positive(message = "Wingspan must be positive")
    private Float wingspan;

    @Enumerated(EnumType.STRING)
    private DragonType type;

    private DragonHeadDTO head;
}
