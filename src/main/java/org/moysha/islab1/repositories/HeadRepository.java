package org.moysha.islab1.repositories;

import org.moysha.islab1.models.DragonHead;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.parameters.P;

import java.util.List;

public interface HeadRepository extends JpaRepository<DragonHead, Long> {
    List<DragonHead> findAll();
    DragonHead findById(long id);
    boolean existsById(long id);

    @Query("select COUNT(h) > 0 FROM DragonHead h where h.size = :hSize AND h.eyesCount = :hEyesCount AND h.toothCount = :hToothCount")
    boolean existingHead(@Param("hSize")long size,
                            @Param("hEyesCount") int eyesCount
                            ,@Param("hToothCount") int toothCount
                            );


}
