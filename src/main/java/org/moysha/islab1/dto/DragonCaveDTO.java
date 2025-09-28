package org.moysha.islab1.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.moysha.islab1.models.DragonCave;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DragonCaveDTO {

    @DecimalMin(value = "0.0", inclusive = false, message = "Number of treasures must be greater than 0")
    private Float numberOfTreasures;

    public DragonCave toEntity() {
        return DragonCave.builder()
                .numberOfTreasures(numberOfTreasures)
                .build();
    }
}