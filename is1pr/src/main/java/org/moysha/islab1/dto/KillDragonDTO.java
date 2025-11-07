package org.moysha.islab1.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KillDragonDTO {

    @NotNull(message = "dragonId is required")
    @Positive(message = "dragonId must be > 0")
    private Long dragonId;

    @NotNull(message = "killerId is required")
    @Positive(message = "killerId must be > 0")
    private Long killerId;

}
