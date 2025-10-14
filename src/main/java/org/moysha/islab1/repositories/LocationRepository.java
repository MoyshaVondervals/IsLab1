package org.moysha.islab1.repositories;

import org.moysha.islab1.models.Location;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LocationRepository extends JpaRepository<Location, Long> {
    List<Location> findAll();
    Location findById(long id);

}
