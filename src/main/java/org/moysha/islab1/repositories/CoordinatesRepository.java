package org.moysha.islab1.repositories;

import org.moysha.islab1.models.Coordinates;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CoordinatesRepository extends JpaRepository<Coordinates, Long> {
    List<Coordinates> findAll();
    Coordinates findById(long id);


}
