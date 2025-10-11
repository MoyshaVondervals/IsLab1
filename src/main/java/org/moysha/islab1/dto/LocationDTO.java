package org.moysha.islab1.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.moysha.islab1.models.Location;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LocationDTO {

    private Long id;

    @NotNull(message = "X coordinate cannot be null")
    private Float x;

    @NotNull(message = "Y coordinate cannot be null")
    private Float y;

    @NotNull(message = "Z coordinate cannot be null")
    private Integer z;

    private String name;

    public Location toEntity() {
        return Location.builder()
                .x(x)
                .y(y)
                .z(z)
                .name(name)
                .build();
    }
}