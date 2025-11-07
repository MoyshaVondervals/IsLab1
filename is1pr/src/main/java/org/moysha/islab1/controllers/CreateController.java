package org.moysha.islab1.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.*;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.moysha.islab1.dto.*;
import org.moysha.islab1.models.*;
import org.moysha.islab1.services.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/")
@Tag(name = "Create", description = "Создание базовых сущностей")
@SecurityRequirement(name = "bearerAuth")
public class CreateController {

    private final CaveService caveService;
    private final CoordinatesService coordinatesService;
    private final PersonService personService;
    private final LocationService locationService;
    private final HeadService headService;

    @Operation(
            summary = "Создать координаты",
            description = "Создаёт координаты и возвращает исходный DTO.",
            operationId = "createCoordinates"
    )
    @ApiResponse(responseCode = "201", description = "Создано",
            content = @Content(schema = @Schema(implementation = CoordinatesDTO.class)))
    @ApiResponse(responseCode = "400", description = "Ошибка создания",
            content = @Content(schema = @Schema(implementation = String.class)))
    @PostMapping("/createCoordinates")
    public ResponseEntity<?> createCoordinates(
            @RequestBody(description = "Координаты", required = true,
                    content = @Content(schema = @Schema(implementation = CoordinatesDTO.class)))
            @org.springframework.web.bind.annotation.RequestBody @Valid CoordinatesDTO coordinatesDTO) {
        try {
            Coordinates coordinates = coordinatesDTO.toEntity();
            Coordinates savedCoordinates = coordinatesService.save(coordinates);
            return ResponseEntity.status(HttpStatus.CREATED).body(coordinatesDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Ошибка создания координат: " + e.getMessage());
        }
    }

    @Operation(
            summary = "Создать пещеру",
            description = "Создаёт пещеру и возвращает исходный DTO.",
            operationId = "createCave"
    )
    @ApiResponse(responseCode = "201", description = "Создано",
            content = @Content(schema = @Schema(implementation = DragonCaveDTO.class)))
    @ApiResponse(responseCode = "400", description = "Ошибка создания",
            content = @Content(schema = @Schema(implementation = String.class)))
    @PostMapping("/createCave")
    public ResponseEntity<?> createCave(
            @RequestBody(description = "Пещера дракона", required = true,
                    content = @Content(schema = @Schema(implementation = DragonCaveDTO.class)))
            @org.springframework.web.bind.annotation.RequestBody @Valid DragonCaveDTO caveDTO) {
        try {
            DragonCave cave = caveDTO.toEntity();
            DragonCave savedCave = caveService.save(cave);
            return ResponseEntity.status(HttpStatus.CREATED).body(caveDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Ошибка создания пещеры: " + e.getMessage());
        }
    }

    @Operation(
            summary = "Создать локацию",
            description = "Создаёт локацию и возвращает исходный DTO.",
            operationId = "createLocation"
    )
    @ApiResponse(responseCode = "201", description = "Создано",
            content = @Content(schema = @Schema(implementation = LocationDTO.class)))
    @ApiResponse(responseCode = "400", description = "Ошибка создания",
            content = @Content(schema = @Schema(implementation = String.class)))
    @PostMapping("/createLocation")
    public ResponseEntity<?> createLocation(
            @RequestBody(description = "Локация", required = true,
                    content = @Content(schema = @Schema(implementation = LocationDTO.class)))
            @org.springframework.web.bind.annotation.RequestBody @Valid LocationDTO locationDTO) {
        try {
            Location location = locationDTO.toEntity();
            Location savedLocation = locationService.save(location);
            return ResponseEntity.status(HttpStatus.CREATED).body(locationDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Ошибка создания локации: " + e.getMessage());
        }
    }

    @Operation(
            summary = "Создать голову дракона",
            description = "Создаёт голову дракона и возвращает исходный DTO.",
            operationId = "createHead"
    )
    @ApiResponse(responseCode = "201", description = "Создано",
            content = @Content(schema = @Schema(implementation = DragonHeadDTO.class)))
    @ApiResponse(responseCode = "400", description = "Ошибка создания",
            content = @Content(schema = @Schema(implementation = String.class)))
    @PostMapping("/createHead")
    public ResponseEntity<?> createHead(
            @RequestBody(description = "Голова дракона", required = true,
                    content = @Content(schema = @Schema(implementation = DragonHeadDTO.class)))
            @org.springframework.web.bind.annotation.RequestBody @Valid DragonHeadDTO headDTO) {
        try {
            DragonHead head = headDTO.toEntity();
            DragonHead savedHead = headService.save(head);
            return ResponseEntity.status(HttpStatus.CREATED).body(headDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Ошибка создания головы дракона: " + e.getMessage());
        }
    }

    @Operation(
            summary = "Создать персонажа",
            description = "Создаёт персонажа. Если указана локация по id — будет привязана к персонажу.",
            operationId = "createPerson"
    )
    @ApiResponse(responseCode = "201", description = "Создано",
            content = @Content(schema = @Schema(implementation = PersonDTO.class)))
    @ApiResponse(responseCode = "400", description = "Ошибка создания",
            content = @Content(schema = @Schema(implementation = String.class)))
    @PostMapping("/createPerson")
    public ResponseEntity<?> createPerson(
            @RequestBody(description = "Персонаж", required = true,
                    content = @Content(schema = @Schema(implementation = PersonDTO.class)))
            @org.springframework.web.bind.annotation.RequestBody PersonDTO personDTO) {
        System.err.println("Получен DTO: " + personDTO);
        try {
            Location location = null;

            if (personDTO.getLocation() != null && personDTO.getLocation().getId() != null) {
                long locId = personDTO.getLocation().getId();
                location = locationService.getById(locId);

                if (location == null) {
                    return ResponseEntity.badRequest().body("Локация с id = " + locId + " не найдена.");
                }
            }

            Person person = personDTO.toEntity(location);
            Person savedPerson = personService.save(person);
            return ResponseEntity.status(HttpStatus.CREATED).body(personDTO);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Ошибка создания персонажа: " + e.getMessage());
        }
    }
}
