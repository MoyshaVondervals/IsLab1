package org.moysha.islab1.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.moysha.islab1.dto.NewDragonResp;
import org.moysha.islab1.exceptions.MessageException;
import org.moysha.islab1.models.*;
import org.moysha.islab1.repositories.*;
import org.moysha.islab1.services.CoordinatesService;
import org.moysha.islab1.services.HeadService;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Validated
public class JsonParser {


    private final ObjectMapper objectMapper;
    private final CavesRepository cavesRepository;
    private final CoordinatesRepository coordinatesRepository;
    private final HeadRepository headRepository;
    private final CoordinatesService coordinatesService;
    private final HeadService headService;
    private final PersonRepository personRepository;
    private final LocationRepository locationRepository;

    public List<@Valid NewDragonResp> parseJson(String json) throws Exception {

            List<NewDragonResp> dragonList = objectMapper.readValue(json, objectMapper.getTypeFactory().constructCollectionType(List.class, NewDragonResp.class));
            for (NewDragonResp dragon: dragonList){
                System.out.println(dragon.toString());
            }
            return dragonList;
    }



    public Coordinates resolveCoordinates(Coordinates req) {
        if (req == null) throw new MessageException("Coordinates: объект отсутствует");
        if (req.getId() != null) {
            Optional<Coordinates> found = coordinatesRepository.findById(req.getId());
            if (found.isPresent()) return found.get();

        }
        List<String> errors = new ArrayList<>();
        if (req.getX() == null) errors.add("Coordinates.x не может быть null");
        if (req.getY() == null) errors.add("Coordinates.y не может быть null");
        if (!errors.isEmpty()) throw new MessageException(String.join("; ", errors));

        return new Coordinates(null, req.getX(), req.getY());
    }

    public DragonCave resolveDragonCave(DragonCave req) {
        if (req == null) throw new MessageException("DragonCave: объект отсутствует");
        if (req.getId() != null) {
            Optional<DragonCave> found = cavesRepository.findById(req.getId());
            if (found.isPresent()) return found.get();
        }
        if (req.getNumberOfTreasures() != null && !(req.getNumberOfTreasures() > 0f)) {
            throw new MessageException("DragonCave.numberOfTreasures должно быть > 0, если задано");
        }
        return new DragonCave(null, req.getNumberOfTreasures());
    }

    public Location resolveLocation(Location req) {
        if (req == null) return null;
        if (req.getId() != null) {
            Optional<Location> found = locationRepository.findById(req.getId());
            if (found.isPresent()) return found.get();

        }
        List<String> errors = new ArrayList<>();
        if (req.getX() == null) errors.add("Location.x не может быть null");
        if (req.getZ() == null) errors.add("Location.z не может быть null");
        if (!errors.isEmpty()) throw new MessageException(String.join("; ", errors));

        return new Location(null, req.getX(), req.getY(), req.getZ(), req.getName());
    }

    public DragonHead resolveDragonHead(DragonHead req) {
        if (req.getId() != null) {
            req.setId(null);

        }
        List<String> errors = new ArrayList<>();
        if (req.getSize() == null || req.getSize() <= 0) errors.add("DragonHead.size должен быть > 0");
        if (req.getEyesCount() == null || req.getEyesCount() <= 0) errors.add("DragonHead.eyesCount должен быть > 0");
        if (req.getToothCount() == null || req.getToothCount() <= 0) errors.add("DragonHead.toothCount должен быть > 0");
        if (!errors.isEmpty()) throw new MessageException(String.join("; ", errors));

        return new DragonHead(null, req.getSize(), req.getEyesCount(), req.getToothCount());
    }
    public Person resolvePerson(Person req) {
        if (req == null) return null; // killer может быть null
        if (req.getId() != null) {
            Optional<Person> found = personRepository.findById(req.getId());
            if (found.isPresent()) return found.get();

        }
        List<String> errors = new ArrayList<>();
        if (req.getName() == null || req.getName().isBlank()) errors.add("Person.name не может быть пустым");
        if (req.getEyeColor() == null) errors.add("Person.eyeColor не может быть null");
        if (req.getPassportID() == null || req.getPassportID().isBlank()) errors.add("Person.passportID не может быть пустым");
        if (req.getNationality() == null) errors.add("Person.nationality не может быть null");
        if (!errors.isEmpty()) throw new MessageException(String.join("; ", errors));


        Location loc = resolveLocation(req.getLocation());

        Person p = new Person();
        p.setId(null);
        p.setName(req.getName());
        p.setEyeColor(req.getEyeColor());
        p.setHairColor(req.getHairColor());
        p.setLocation(loc);
        p.setPassportID(req.getPassportID());
        p.setNationality(req.getNationality());
        return p;
    }








}
