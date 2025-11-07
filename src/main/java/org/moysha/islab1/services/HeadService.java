package org.moysha.islab1.services;

import lombok.RequiredArgsConstructor;
import org.moysha.islab1.dto.DragonHeadDTO;
import org.moysha.islab1.exceptions.MessageException;
import org.moysha.islab1.models.DragonHead;
import org.moysha.islab1.repositories.HeadRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HeadService {
    private final HeadRepository headRepository;

    public void existingHead(DragonHead head) {
        System.err.println("INVOkED");
        if (headRepository.existingHead(head.getSize(), head.getEyesCount(), head.getToothCount())){
            throw new MessageException("Голова не уникальна, этого не может быть!");
        }
    }


    public boolean existsById(long id) {
        return headRepository.existsById(id);
    }

    public List<DragonHeadDTO> getAllHeads() {
        List<DragonHead> heads = headRepository.findAll();
        List<DragonHeadDTO> dto = new ArrayList<>();
        for (DragonHead head : heads) {
            dto.add(DragonHeadDTO.builder()
                    .id(head.getId())
                            .eyesCount(head.getEyesCount())
                            .size(head.getSize())
                            .toothCount(head.getToothCount())
                    .build());
        }
        return dto;
    }

    public DragonHead getHeadById(long id) {
        return headRepository.findById(id);
    }


    public DragonHead save(DragonHead dragonHead) {
        existingHead(dragonHead);
        return headRepository.save(dragonHead);
    }


}
