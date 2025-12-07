package org.moysha.islab1.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CacheLoggingRequest {
    @NotNull
    private Boolean enabled;
}
