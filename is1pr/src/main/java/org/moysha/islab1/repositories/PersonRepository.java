package org.moysha.islab1.repositories;

import org.moysha.islab1.models.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PersonRepository extends JpaRepository<Person, Long> {
    List<Person> findAll();
    Person findById(long id);

    @Query("SELECT COUNT(p) > 0 FROM Person p where p.location.id = :locId And p.id != :excludePersonId")
    boolean existByLocationIdAndIdNot(@Param("locId")long locationId,
                                      @Param("excludePersonId") long id);


    boolean existsByLocationId(Long locationId);
}
