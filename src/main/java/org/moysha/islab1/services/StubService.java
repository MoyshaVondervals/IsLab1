package org.moysha.islab1.services;

import lombok.RequiredArgsConstructor;
import org.moysha.islab1.models.Coordinates;
import org.moysha.islab1.models.DragonCave;
import org.moysha.islab1.models.DragonHead;
import org.moysha.islab1.repositories.CavesRepository;
import org.moysha.islab1.repositories.CoordinatesRepository;
import org.moysha.islab1.repositories.HeadRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StubService {
    private CoordinatesRepository coordinatesRepository;

    private CavesRepository caveRepository;

    private HeadRepository headRepository;

    // Создаем или получаем "заглушечные" координаты
    public Coordinates getStubCoordinates() {
        return
                Coordinates.builder()
                                .x(0.0F)
                                .y(0.0)
                                .build()
                ;
    }

    // Создаем или получаем "заглушечную" пещеру
    public DragonCave getStubCave() {
        return
                        DragonCave.builder()
                                .numberOfTreasures(0.0f)
                                .build()
                ;
    }

    public DragonHead getStubHead() {
        return
                        DragonHead.builder()
                                .size(1)
                                .eyesCount(1)
                                .toothCount(1)
                                .build()
                ;
    }
}
