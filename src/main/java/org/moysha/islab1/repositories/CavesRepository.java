package org.moysha.islab1.repositories;

import org.moysha.islab1.models.DragonCave;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CavesRepository extends JpaRepository<DragonCave, Long> {
    List<DragonCave> findAll();
    DragonCave findById(long id);
    boolean existsById(long id);


}
