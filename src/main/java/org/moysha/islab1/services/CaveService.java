package org.moysha.islab1.services;


import lombok.RequiredArgsConstructor;
import org.moysha.islab1.models.DragonCave;
import org.moysha.islab1.repositories.CavesRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CaveService {
    private final CavesRepository cavesRepository;

    public List<DragonCave> getAllCaves() {
        return cavesRepository.findAll();
    }

    public DragonCave getCaveById(long id) {
        return cavesRepository.findById(id);
    }

    public DragonCave save(DragonCave cave) {
        return cavesRepository.save(cave);
    }
}
