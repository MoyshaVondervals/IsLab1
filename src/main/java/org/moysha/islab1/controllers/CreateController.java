package org.moysha.islab1.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.moysha.islab1.dto.*;
import org.moysha.islab1.models.*;
import org.moysha.islab1.services.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/")
public class CreateController {

    private final SimpMessagingTemplate template;
    private final DragonService dragonService;
    private final CaveService caveService;
    private final CoordinatesService coordinatesService;
    private final PersonService personService;
    private final LocationService locationService;
    private final HeadService headService;

    @PostMapping("/createCoordinates")
    public ResponseEntity<?> createCoordinates(@Valid @RequestBody CoordinatesDTO coordinatesDTO) {
        try {
            Coordinates coordinates = coordinatesDTO.toEntity();
            Coordinates savedCoordinates = coordinatesService.save(coordinates);
            return ResponseEntity.status(HttpStatus.CREATED).body(coordinatesDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Ошибка создания координат: " + e.getMessage());
        }
    }
    @PostMapping("/createCave")
    public ResponseEntity<?> createCave(@Valid @RequestBody DragonCaveDTO caveDTO) {
        try {
            DragonCave cave = caveDTO.toEntity();
            DragonCave savedCave = caveService.save(cave);
            return ResponseEntity.status(HttpStatus.CREATED).body(caveDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Ошибка создания пещеры: " + e.getMessage());
        }
    }

    @PostMapping("/createLocation")
    public ResponseEntity<?> createLocation(@Valid @RequestBody LocationDTO locationDTO) {
        try {
            Location location = locationDTO.toEntity();
            Location savedLocation = locationService.save(location);
            return ResponseEntity.status(HttpStatus.CREATED).body(locationDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Ошибка создания локации: " + e.getMessage());
        }
    }

    @PostMapping("/createHead")
    public ResponseEntity<?> createHead(@Valid @RequestBody DragonHeadDTO headDTO) {
        try {
            DragonHead head = headDTO.toEntity();
            DragonHead savedHead = headService.save(head);
            return ResponseEntity.status(HttpStatus.CREATED).body(headDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Ошибка создания головы дракона: " + e.getMessage());
        }
    }
    @PostMapping("/createPerson")
    public ResponseEntity<?> createPerson(@RequestBody PersonDTO personDTO) {
        System.err.println("Получен DTO: " + personDTO);

        try {
            Location location = null;

            if (personDTO.getLocation() != null && personDTO.getLocation().getId() != null) {
                long locId = personDTO.getLocation().getId();
                location = locationService.getById(locId);

                if (location == null) {
                    return ResponseEntity.badRequest()
                            .body("Локация с id = " + locId + " не найдена.");
                }
            }

            Person person = personDTO.toEntity(location);
            Person savedPerson = personService.save(person);

            return ResponseEntity.status(HttpStatus.CREATED).body(personDTO);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body("Ошибка создания персонажа: " + e.getMessage());
        }
    }






}
