package org.moysha.islab1.repositories;

import org.moysha.islab1.models.OperationHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HistoryRepository extends JpaRepository<OperationHistory, Long> {
    List<OperationHistory> findAll();
    List<OperationHistory> findAllByOperationOwner_Id(long userId);
}
