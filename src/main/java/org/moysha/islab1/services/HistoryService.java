package org.moysha.islab1.services;

import lombok.RequiredArgsConstructor;
import org.moysha.islab1.dto.HistoryDTO;
import org.moysha.islab1.models.OperationHistory;
import org.moysha.islab1.models.User;
import org.moysha.islab1.repositories.HistoryRepository;
import org.moysha.islab1.unums.Role;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HistoryService {
    private final HistoryRepository historyRepository;
    private final UserService userService;

    public ResponseEntity<String> addImport(int added){
        OperationHistory operation = OperationHistory.builder()
                .operationOwner(userService.getCurrentUser())
                .affectedObjects(added)
                .build();
        historyRepository.save(operation);
        return ResponseEntity.ok("Успех");
    }

    public ResponseEntity<List<HistoryDTO>> getHistory(){
        List<OperationHistory> operations;
        List<HistoryDTO> historyDTOS = new ArrayList<>();
        if (userService.getCurrentUser().getRole()== Role.USER){
            operations = historyRepository.findAllByOperationOwner_Id(userService.getCurrentUser().getId());
        }
        else {
            operations = historyRepository.findAll();
        }
        for (OperationHistory operationHistory : operations) {
            HistoryDTO dto = HistoryDTO.builder()
                    .id(operationHistory.getId())
                    .operationOwner(operationHistory.getOperationOwner())
                    .affectedObjects(operationHistory.getAffectedObjects())
                    .creationDate(operationHistory.getCreationDate())
                    .build();
            historyDTOS.add(dto);
        }
        return new ResponseEntity<>(historyDTOS, HttpStatus.OK);

    }
}
