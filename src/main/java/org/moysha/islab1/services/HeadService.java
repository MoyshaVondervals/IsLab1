package org.moysha.islab1.services;

import lombok.RequiredArgsConstructor;
import org.moysha.islab1.models.DragonHead;
import org.moysha.islab1.repositories.HeadRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HeadService {
    private final HeadRepository headRepository;

    public List<DragonHead> getAllHeads() {
        return headRepository.findAll();
    }

    public DragonHead getHeadById(long id) {
        return headRepository.findById(id);
    }


    public DragonHead save(DragonHead dragonHead) {
        return headRepository.save(dragonHead);
    }


}
