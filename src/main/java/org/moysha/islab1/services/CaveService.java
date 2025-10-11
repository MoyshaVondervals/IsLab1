package org.moysha.islab1.services;


import lombok.RequiredArgsConstructor;
import org.moysha.islab1.dto.DragonCaveDTO;
import org.moysha.islab1.dto.DragonDTO;
import org.moysha.islab1.models.DragonCave;
import org.moysha.islab1.repositories.CavesRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CaveService {
    private final CavesRepository cavesRepository;

    public List<DragonCaveDTO> getAllCaves() {
        List<DragonCave> caves = cavesRepository.findAll();
        List<DragonCaveDTO> dto = new ArrayList<>();
        for (DragonCave cave : caves) {
            dto.add(DragonCaveDTO.builder()
                    .id(cave.getId())
                            .numberOfTreasures(cave.getNumberOfTreasures())
                    .build());
        }
        return dto;
    }

    public DragonCave getCaveById(long id) {
        return cavesRepository.findById(id);
    }

    public DragonCave save(DragonCave cave) {
        return cavesRepository.save(cave);
    }
}
