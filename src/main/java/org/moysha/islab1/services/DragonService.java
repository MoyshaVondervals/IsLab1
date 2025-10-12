package org.moysha.islab1.services;


import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.moysha.islab1.dto.*;
import org.moysha.islab1.exceptions.MessageException;
import org.moysha.islab1.models.*;
import org.moysha.islab1.repositories.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.awt.print.Pageable;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DragonService {
    private final DragonRepository dragonRepository;
    private final CoordinatesService coordinatesService;
    private final CaveService caveService;
    private final PersonService personService;
    private final HeadService headService;
    private final LocationService locationService;
    private final StubService stubService;
    private final CoordinatesRepository coordinatesRepository;
    private final CavesRepository cavesRepository;
    private final HeadRepository headRepository;
    private final PersonRepository personRepository;

    @Transactional
    public void createDragon(NewDragonResp request) {
        Coordinates coordinates = request.getCoordinates();
        DragonCave cave = request.getCave();
        Person killer = request.getKiller();
        DragonHead head = request.getHead();

        if (coordinates.getId()!=null){coordinates = coordinatesService.getCoordinatesById(coordinates.getId());}
        if (cave.getId()!=null){cave = caveService.getCaveById(cave.getId());}
        if (killer != null){
            if (killer.getId()!=null){killer = personService.getPersonById(killer.getId());}
            }
        if (head.getId()!=null){head = headService.getHeadById(head.getId());}



        Dragon dragon = Dragon.builder()
                .name(request.getName())
                .coordinates(coordinates)
                .creationDate(LocalDateTime.now())
                .cave(cave)
                .killer(killer)
                .age(request.getAge())
                .description(request.getDescription())
                .wingspan(request.getWingspan())
                .type(request.getType())
                .head(head)
                .build();
        dragonRepository.save(dragon);

    }


    public List<Dragon> getAllDragons() {
        return dragonRepository.findAll();
    }

    public Dragon getDragonById(Long id) {
        return dragonRepository.findById(id).orElse(null);
    }


    public Dragon updateDragon(Long id, Dragon updatedDragon) {

        System.err.println(updatedDragon);
        Dragon existingDragon = dragonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dragon not found"));
        existingDragon.setName(updatedDragon.getName());
        existingDragon.setAge(updatedDragon.getAge());
        existingDragon.setDescription(updatedDragon.getDescription());
        existingDragon.setWingspan(updatedDragon.getWingspan());
        existingDragon.setType(updatedDragon.getType());


        if (updatedDragon.getCoordinates() != null) {
            if (updatedDragon.getCoordinates().getId() != null) {
                Coordinates existingCoords = coordinatesService.getCoordinatesById(updatedDragon.getCoordinates().getId());
                existingDragon.setCoordinates(existingCoords);
            } else {
                Coordinates newCoords = coordinatesService.save(updatedDragon.getCoordinates());
                existingDragon.setCoordinates(newCoords);
            }
        }
        System.err.println(7);

        if (updatedDragon.getCave() != null) {
            if (updatedDragon.getCave().getId() != null) {
                DragonCave existingCave = caveService.getCaveById(updatedDragon.getCave().getId());
                existingDragon.setCave(existingCave);
            } else {
                DragonCave newCave = caveService.save(updatedDragon.getCave());
                existingDragon.setCave(newCave);
            }
        }
        System.err.println(8);

        if (updatedDragon.getKiller() != null) {
            if (updatedDragon.getKiller().getId() != null) {
                Person existingPerson = personService.getPersonById(updatedDragon.getKiller().getId());
                existingDragon.setKiller(existingPerson);

            } else {
                Person newPerson = new Person();
                newPerson.setName(updatedDragon.getKiller().getName());
                newPerson.setEyeColor(updatedDragon.getKiller().getEyeColor());
                newPerson.setHairColor(updatedDragon.getKiller().getHairColor());
                newPerson.setPassportID(updatedDragon.getKiller().getPassportID());
                newPerson.setNationality(updatedDragon.getKiller().getNationality());

                // Обработка Location для нового убийцы
                if (updatedDragon.getKiller().getLocation() != null) {
                    if (updatedDragon.getKiller().getLocation().getId() != null) {
                        Location existingLocation = locationService.getLocationById(
                                updatedDragon.getKiller().getLocation().getId()
                        );
                        newPerson.setLocation(existingLocation);
                    } else {
                        Location newLocation = locationService.save(updatedDragon.getKiller().getLocation());
                        newPerson.setLocation(newLocation);
                    }
                }

                Person savedPerson = personService.save(newPerson);
                existingDragon.setKiller(savedPerson);
            }
        } else {
            existingDragon.setKiller(null);
        }

        if (updatedDragon.getHead() != null) {
            if (updatedDragon.getHead().getId() != null) {
                DragonHead existingHead = headService.getHeadById(updatedDragon.getHead().getId());
                existingDragon.setHead(existingHead);
            } else {
                DragonHead newHead = headService.save(updatedDragon.getHead());
                existingDragon.setHead(newHead);
            }
        }

        return dragonRepository.save(existingDragon);

    }


    @Transactional
    public void deleteDragon(Long id) {
        Dragon dragon = dragonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dragon not found"));

        Coordinates originalCoordinates = dragon.getCoordinates();
        Long coordinatesId = (originalCoordinates != null) ? originalCoordinates.getId() : null;

        DragonCave originalCave = dragon.getCave();
        Long caveId = (originalCave != null) ? originalCave.getId() : null;

        DragonHead originalHead = dragon.getHead();
        Long headId = (originalHead != null) ? originalHead.getId() : null;

        Person originalKiller = dragon.getKiller();
        Long personId = (originalKiller != null) ? originalKiller.getId() : null;

        dragonRepository.delete(dragon);

        if (coordinatesId != null) {
            boolean coordinatesUsedByOthers = dragonRepository.isCoordinatesUsedByOtherDragons(coordinatesId, id);
            if (!coordinatesUsedByOthers) {
                coordinatesRepository.deleteById(coordinatesId);
            }
        }

        if (caveId != null) {
            boolean caveUsedByOthers = dragonRepository.existByDragonCaveIdAndIdNot(caveId, id);
            if (!caveUsedByOthers) {
                cavesRepository.deleteById(caveId);
            }
        }

        if (headId != null) {
            boolean headUsedByOthers = dragonRepository.existByDragonHeadIdAndIdNot(headId, id);
            if (!headUsedByOthers) {
                headRepository.deleteById(headId);
            }
        }

        if (personId != null) {
            boolean personUsedByOthers = dragonRepository.existByPersonIdAndIdNot(personId, id);
            if (!personUsedByOthers) {
                personService.deletePersonById(personId);
            }
        }
    }

    public boolean isCoordinatesUsed(Long coordinatesId) {
        return dragonRepository.existsByCoordinatesId(coordinatesId);
    }

    public boolean isCaveUsed(Long caveId) {
        return dragonRepository.existsByCaveId(caveId);
    }

    public boolean isKillerUsed(Long killerId) {
        return dragonRepository.existsByKillerId(killerId);
    }

    public boolean isHeadUsed(Long headId) {
        return dragonRepository.existsByHeadId(headId);
    }


    public Double avgAge(){
        Double avgAge = 0.0;
        List<Dragon> dragons = dragonRepository.findAll();
        for (Dragon dragon : dragons) {
            avgAge += dragon.getAge();
        }
        return avgAge/dragons.size();
    }

    public DragonDTO findDragonWithMaxCave() {
        List<Dragon> dragon = dragonRepository.findDragonWithDeepestCave();
        Dragon dragon1 = dragon.get(0);
        DragonDTO dto = convertToDTO(dragon1);
        return dto;
    }


    public List<DragonDTO> findDragonsWithHeadGreater(long size) {
        List<Dragon> dragons = dragonRepository
                .findAllByHead_SizeGreaterThanOrderByHead_SizeAsc(size);
        return dragons.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    public DragonDTO getOldestDragon() {
        Dragon dragon = dragonRepository.findFirstByOrderByAgeDescIdAsc();
        return convertToDTO(dragon);

    }


    public Dragon killDragon(Long dragonId, Long killerId) {
        Dragon dragon = dragonRepository.findById(dragonId)
                .orElseThrow(() -> new MessageException("Дракон не найден: " + dragonId));

        if (dragon.getKiller() != null) {
            throw new MessageException("Дракон #" + dragonId + " уже убит убийцей " + dragon.getKiller().getName());
        }

        Person killer = personRepository.findById(killerId)
                .orElseThrow(() -> new MessageException("Убийца не найден: " + killerId));

        dragon.setKiller(killer);
        return dragonRepository.save(dragon);
    }

    public DragonDTO convertToDTO(Dragon dragon) {
        if (dragon.getKiller()!=null) {
            return DragonDTO.builder()
                    .name(dragon.getName())
                    .coordinates(CoordinatesDTO.builder()
                            .x(dragon.getCoordinates().getX())
                            .y(dragon.getCoordinates().getY())
                            .build())
                    .creationDate(dragon.getCreationDate())
                    .cave(DragonCaveDTO.builder()
                            .numberOfTreasures(dragon.getCave().getNumberOfTreasures())
                            .build())
                    .killer(PersonDTO.builder()
                            .name(dragon.getKiller().getName())
                            .eyeColor(dragon.getKiller().getEyeColor())
                            .hairColor(dragon.getKiller().getHairColor())
                            .location(LocationDTO.builder()
                                    .x(dragon.getKiller().getLocation().getX())
                                    .y(dragon.getKiller().getLocation().getY())
                                    .z(dragon.getKiller().getLocation().getZ()).build())
                            .passportID(dragon.getKiller().getPassportID())
                            .nationality(dragon.getKiller().getNationality())
                            .build())
                    .age(dragon.getAge())
                    .description(dragon.getDescription())
                    .wingspan(dragon.getWingspan())
                    .type(dragon.getType())
                    .head(DragonHeadDTO.builder()
                            .toothCount(dragon.getHead().getToothCount())
                            .eyesCount(dragon.getHead().getEyesCount())
                            .size(dragon.getHead().getSize())
                            .build())
                    .build();
        }
        else {
            return DragonDTO.builder()
                    .name(dragon.getName())
                    .coordinates(CoordinatesDTO.builder()
                            .x(dragon.getCoordinates().getX())
                            .y(dragon.getCoordinates().getY())
                            .build())
                    .creationDate(dragon.getCreationDate())
                    .cave(DragonCaveDTO.builder()
                            .numberOfTreasures(dragon.getCave().getNumberOfTreasures())
                            .build())
                    .age(dragon.getAge())
                    .description(dragon.getDescription())
                    .wingspan(dragon.getWingspan())
                    .type(dragon.getType())
                    .head(DragonHeadDTO.builder()
                            .toothCount(dragon.getHead().getToothCount())
                            .eyesCount(dragon.getHead().getEyesCount())
                            .size(dragon.getHead().getSize())
                            .build())
                    .build();
        }


    }
}
