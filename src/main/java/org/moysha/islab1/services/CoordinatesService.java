package org.moysha.islab1.services;


import lombok.RequiredArgsConstructor;
import org.moysha.islab1.models.Coordinates;
import org.moysha.islab1.repositories.CoordinatesRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CoordinatesService {
    private final CoordinatesRepository coordinatesRepository;


    public List<Coordinates> getAllCoordinates() {
        return coordinatesRepository.findAll();
    }

    public Coordinates getCoordinatesById(long id) {
        return coordinatesRepository.findById(id);
    }
    public Coordinates save(Coordinates coordinates) {
        return coordinatesRepository.save(coordinates);
    }





}
