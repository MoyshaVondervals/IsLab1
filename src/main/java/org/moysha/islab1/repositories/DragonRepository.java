package org.moysha.islab1.repositories;

import org.moysha.islab1.models.Dragon;
import org.moysha.islab1.models.DragonHead;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.awt.print.Pageable;
import java.util.List;
import java.util.Optional;

public interface DragonRepository extends JpaRepository<Dragon, Long> {
    boolean existsDragonByName(String name);

    List<Dragon> findAll();

    Dragon findById(long id);

    @Query("SELECT COUNT(d) > 0 FROM Dragon d where d.coordinates.id = :coordinatesId AND d.id != :excludeDragonId")
    boolean isCoordinatesUsedByOtherDragons(@Param("coordinatesId") Long coordinatesId,
                                            @Param("excludeDragonId") Long excludeDragonId);

    @Query("SELECT COUNT(d) > 0 FROM Dragon d where d.cave.id = :caveId And d.id != :excludeDragonId")
    boolean existByDragonCaveIdAndIdNot(@Param("caveId")Long caveId,
                                        @Param("excludeDragonId")Long excludeDragonId);


    @Query("SELECT COUNT(d) > 0 FROM Dragon d where d.killer.id = :personId And d.id != :excludeDragonId")
    boolean existByPersonIdAndIdNot(@Param("personId")Long personId,
                                    @Param("excludeDragonId")Long excludeDragonId);

    @Query("SELECT COUNT(d) > 0 FROM Dragon d where d.head.id = :headId And d.id != :excludeDragonId")
    boolean existByDragonHeadIdAndIdNot(@Param("headId")Long headId,
                                        @Param("excludeDragonId") Long excludeDragonId);


    boolean existsByCoordinatesId(Long coordinatesId);
    boolean existsByCaveId(Long caveId);
    boolean existsByKillerId(Long killerId);
    boolean existsByHeadId(Long headId);

    @Query("SELECT d FROM Dragon d WHERE d.cave.numberOfTreasures = " +
            "(SELECT MAX(d2.cave.numberOfTreasures) FROM Dragon d2)")
    List<Dragon> findDragonWithDeepestCave();

    List<Dragon> findAllByHead_SizeGreaterThanOrderByHead_SizeAsc(long size);

    Dragon findFirstByOrderByAgeDescIdAsc();


}
