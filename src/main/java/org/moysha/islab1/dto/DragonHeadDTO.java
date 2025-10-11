package org.moysha.islab1.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.moysha.islab1.models.DragonHead;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DragonHeadDTO {

    private Long id;

    @NotNull(message = "Size cannot be null")
    @Min(value = 1, message = "Size must be greater than 0")
    private Long size;

    @NotNull(message = "Eyes count cannot be null")
    @Min(value = 1, message = "Eyes count must be greater than 0")
    private Integer eyesCount;

    @NotNull(message = "Tooth count cannot be null")
    @Min(value = 1, message = "Tooth count must be greater than 0")
    private Integer toothCount;

    public DragonHead toEntity() {
        return DragonHead.builder()
                .size(size)
                .eyesCount(eyesCount)
                .toothCount(toothCount)
                .build();
    }
}