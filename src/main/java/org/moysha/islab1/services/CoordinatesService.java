package org.moysha.islab1.services;


import lombok.RequiredArgsConstructor;
import org.moysha.islab1.dto.CoordinatesDTO;
import org.moysha.islab1.exceptions.MessageException;
import org.moysha.islab1.models.Coordinates;
import org.moysha.islab1.repositories.CoordinatesRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CoordinatesService {
    private final CoordinatesRepository coordinatesRepository;

    public boolean existsById(long id) {
        return coordinatesRepository.existsById(id);
    }




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

    public void checkNearCoordinates(Coordinates coordinates) {
        float x = coordinates.getX();
        double y = coordinates.getY();

        float  minX = x - 10.0f;
        float  maxX = x + 10.0f;
        double minY = y - 10.0;
        double maxY = y + 10.0;

        if (coordinatesRepository.existsNearCoordinates(minX, maxX, minY, maxY)) {
            throw new MessageException("Нельзя создавать координаты так близко к другим, отступ по каждой оси минимум 10");
        }
    }

    public Coordinates getCoordinatesById(long id) {
        return coordinatesRepository.findById(id);
    }
    public Coordinates save(Coordinates coordinates) {
        System.err.println(coordinates);
        checkNearCoordinates(coordinates);
        return coordinatesRepository.save(coordinates);
    }





}
