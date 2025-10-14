package org.moysha.islab1.repositories;

import org.moysha.islab1.models.DragonHead;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HeadRepository extends JpaRepository<DragonHead, Long> {
    List<DragonHead> findAll();
    DragonHead findById(long id);
}
