package org.moysha.islab1.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.moysha.islab1.models.User;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistoryDTO {
    private Long id;
    private User operationOwner;
    private long affectedObjects;
    private LocalDateTime creationDate;
}
