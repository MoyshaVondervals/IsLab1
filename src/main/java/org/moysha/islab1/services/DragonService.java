package org.moysha.islab1.services;


import lombok.RequiredArgsConstructor;
import org.moysha.islab1.cache.LogCacheStats;
import org.moysha.islab1.dto.*;
import org.moysha.islab1.exceptions.MessageException;
import org.moysha.islab1.models.*;
import org.moysha.islab1.repositories.*;
import org.moysha.islab1.unums.Country;
import org.moysha.islab1.unums.DragonType;
import org.moysha.islab1.utils.JsonParser;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

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

    private final CoordinatesRepository coordinatesRepository;
    private final CavesRepository cavesRepository;
    private final HeadRepository headRepository;
    private final PersonRepository personRepository;
    private final JsonParser jsonParser;
    private final HistoryService historyService;


    @Transactional(isolation = Isolation.READ_COMMITTED)
    public ResponseEntity<String> createDragon(NewDragonResp request) {

        System.err.println(request);
        System.err.println(1);
        if (dragonRepository.existsDragonByName(request.getName())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Дракон с таким именем уже существует");
        }
        Coordinates coordinates = request.getCoordinates();
        DragonCave cave = request.getCave();
        Person killer = request.getKiller();
        DragonHead head = request.getHead();

        System.err.println(1);
        if (coordinates.getId() != null) {
            System.err.println(111);
            coordinates = coordinatesService.getCoordinatesById(coordinates.getId());
            System.err.println(112);
        } else {
            System.err.println(121);
            System.err.println(coordinates.getX() + " " + coordinates.getY());
            System.err.println(coordinates.getX().getClass() + " " + coordinates.getY().getClass());
            coordinatesService.checkNearCoordinates(coordinates);
            System.err.println(122);
        }

        if (cave.getId() != null) {
            cave = caveService.getCaveById(cave.getId());
        }
        if (killer != null) {
            if (killer.getId() != null) {
                killer = personService.getPersonById(killer.getId());
            }
        }


        headService.existingHead(head);


        if (request.getType() == DragonType.AIR && coordinates.getX() <= 0 && coordinates.getY() >= 0) {
            throw new MessageException("Воздушные драконы не водятся во франции, они бьются головой об эйфелеву башню " + request.getName());
        }
        if (request.getType() == DragonType.WATER && coordinates.getX() >= 0 && coordinates.getY() <= 0) {
            throw new MessageException("Водные драконы не водятся в италии, они растворяются в каналах венеции " + request.getName());
        }
        if (request.getType() == DragonType.UNDERGROUND && coordinates.getX() > 0 && coordinates.getY() > 0) {
            throw new MessageException("Подземные драконы не водятся в северной корее, они врезаются в ракетные шахты " + request.getName());
        }


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
        System.err.println(dragon);
        dragonRepository.save(dragon);
        return ResponseEntity.status(HttpStatus.CREATED).body("Дракон сохранен");

    }


    @LogCacheStats
    public List<Dragon> getAllDragons() {

        return dragonRepository.findAll();
    }

    @LogCacheStats
    public Dragon getDragonById(Long id) {
        return dragonRepository.findById(id).orElse(null);
    }

    @Transactional(isolation = Isolation.REPEATABLE_READ)
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


    @Transactional(isolation = Isolation.REPEATABLE_READ, propagation = Propagation.REQUIRED)
    public void deleteDragon(Long id) {
        Dragon dragon = dragonRepository.findById(id)
                .orElseThrow(() -> new MessageException("Dragon not found"));

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


    public Double avgAge() {
        Double avgAge = 0.0;
        List<Dragon> dragons = dragonRepository.findAll();
        for (Dragon dragon : dragons) {
            avgAge += dragon.getAge();
        }
        return avgAge / dragons.size();
    }

    @LogCacheStats
    public DragonDTO findDragonWithMaxCave() {
        List<Dragon> dragon = dragonRepository.findDragonWithDeepestCave();
        Dragon dragon1 = dragon.get(0);
        DragonDTO dto = convertToDTO(dragon1);
        return dto;
    }


    @LogCacheStats
    public List<DragonDTO> findDragonsWithHeadGreater(long size) {
        List<Dragon> dragons = dragonRepository
                .findAllByHead_SizeGreaterThanOrderByHead_SizeAsc(size);
        return dragons.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    @LogCacheStats
    public DragonDTO getOldestDragon() {
        Dragon dragon = dragonRepository.findFirstByOrderByAgeDescIdAsc();
        return convertToDTO(dragon);

    }

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public Dragon killDragon(Long dragonId, Long killerId) {
        Dragon dragon = dragonRepository.findById(dragonId)
                .orElseThrow(() -> new MessageException("Дракон не найден: " + dragonId));

        if (dragon.getKiller() != null) {
            throw new MessageException("Дракон #" + dragonId + " уже убит убийцей " + dragon.getKiller().getName());
        }
        if (dragon.getAge() < 20) {
            throw new MessageException("Нелья убивать драконов младше 20 лет");
        }


        Person killer = personRepository.findById(killerId)
                .orElseThrow(() -> new MessageException("Убийца не найден: " + killerId));

        if ((killer.getNationality() == Country.VATICAN || killer.getNationality() == Country.ITALY) && dragon.getType() == DragonType.AIR) {
            throw new MessageException("Людям из ватикана и италии запрещено убивать воздушных драконов по религиозным причинам");
        }
        if (killer.getNationality() == Country.SPAIN && dragon.getType() == DragonType.FIRE) {
            throw new MessageException("Испанцам запрещено убивать огненных драконов, кто же будет есть острую пищу");
        }
        if (killer.getNationality() == Country.NORTH_KOREA && dragon.getType() == DragonType.WATER) {
            throw new MessageException("Людям из северной кореи запрещено убивать водных драконов, они помогают выращивать миска рис");
        }
        if (killer.getNationality() == Country.FRANCE && dragon.getType() == DragonType.UNDERGROUND) {
            throw new MessageException("Людям из франции запрещено убивать подземных драконов, они ищут трюфели");
        }


        dragon.setKiller(killer);
        return dragonRepository.save(dragon);
    }

    public DragonDTO convertToDTO(Dragon dragon) {
        if (dragon.getKiller() != null) {
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
        } else {
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


    @Transactional(isolation = Isolation.REPEATABLE_READ, propagation = Propagation.MANDATORY)
    public int uploadDragon(String json, ImportAuditMetadata metadata) throws Exception {
        List<NewDragonResp> dragonDtoList = jsonParser.parseJson(json);
        for (NewDragonResp dragon : dragonDtoList) {
            dragon.setCave(jsonParser.resolveDragonCave(dragon.getCave()));
            dragon.setCoordinates(jsonParser.resolveCoordinates(dragon.getCoordinates()));
            dragon.setHead(jsonParser.resolveDragonHead(dragon.getHead()));
            dragon.setKiller(jsonParser.resolvePerson(dragon.getKiller()));

            createDragon(dragon);

        }
        historyService.addImport(dragonDtoList.size(), metadata);
        return dragonDtoList.size();
    }

}
