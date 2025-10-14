package org.moysha.islab1.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.moysha.islab1.models.DragonCave;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DragonCaveDTO {
    private Long id;

    @DecimalMin(value = "0.0", inclusive = false, message = "Number of treasures must be greater than 0")
    private Float numberOfTreasures;

    public DragonCave toEntity() {
        return DragonCave.builder()
                .numberOfTreasures(numberOfTreasures)
                .build();
    }
}