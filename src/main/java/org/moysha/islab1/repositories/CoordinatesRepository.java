package org.moysha.islab1.repositories;

import org.moysha.islab1.models.Coordinates;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CoordinatesRepository extends JpaRepository<Coordinates, Long> {
    List<Coordinates> findAll();
    Coordinates findById(long id);
    boolean existsById(long id);

    @Query("""
       select (count(c) > 0)
       from Coordinates c
       where c.x between :minX and :maxX
         and c.y between :minY and :maxY
       """)
    boolean existsNearCoordinates(@Param("minX") float minX,
                                  @Param("maxX") float maxX,
                                  @Param("minY") double minY,
                                  @Param("maxY") double maxY);



}
