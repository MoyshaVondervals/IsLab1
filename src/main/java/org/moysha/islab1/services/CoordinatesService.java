package org.moysha.islab1.services;


import lombok.RequiredArgsConstructor;
import org.moysha.islab1.dto.CoordinatesDTO;
import org.moysha.islab1.models.Coordinates;
import org.moysha.islab1.repositories.CoordinatesRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CoordinatesService {
    private final CoordinatesRepository coordinatesRepository;


    public List<CoordinatesDTO> getAllCoordinates() {
        List<Coordinates> coordinates = coordinatesRepository.findAll();
        List<CoordinatesDTO> dto = new ArrayList<>();
        for (Coordinates c : coordinates) {
            dto.add(CoordinatesDTO.builder()
                            .id(c.getId())
                    .x(c.getX())
                    .y(c.getY())
                    .build());
        }
        return dto;
    }

    public Coordinates getCoordinatesById(long id) {
        return coordinatesRepository.findById(id);
    }
    public Coordinates save(Coordinates coordinates) {
        return coordinatesRepository.save(coordinates);
    }





}
