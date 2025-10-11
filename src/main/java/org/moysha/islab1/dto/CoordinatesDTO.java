package org.moysha.islab1.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.moysha.islab1.models.Coordinates;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CoordinatesDTO {

    private Long id;

    @NotNull(message = "X coordinate cannot be null")
    private Float x;

    @NotNull(message = "Y coordinate cannot be null")
    private Double y;

    public Coordinates toEntity() {
        return Coordinates.builder()
                .x(x)
                .y(y)
                .build();
    }
}