package org.moysha.islab1.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.*;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.moysha.islab1.services.*;
import org.moysha.islab1.repositories.CavesRepository;
import org.moysha.islab1.repositories.CoordinatesRepository;
import org.moysha.islab1.repositories.HeadRepository;
import org.moysha.islab1.repositories.LocationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/")
@Tag(name = "Delete", description = "Удаление сущностей")
@SecurityRequirement(name = "bearerAuth")
public class DeleteElementsController {

    private final SimpMessagingTemplate template;
    private final DragonService dragonService;
    private final CaveService caveService;
    private final CoordinatesService coordinatesService;
    private final PersonService personService;
    private final LocationService locationService;
    private final HeadService headService;
    private final CavesRepository cavesRepository;
    private final HeadRepository headRepository;
    private final LocationRepository locationRepository;
    private final CoordinatesRepository coordinatesRepository;

    @Operation(
            summary = "Удалить координаты",
            description = "Удаляет координаты по идентификатору. Если координаты используются — вернёт 400.",
            operationId = "deleteCoordinatesById"
    )
    @ApiResponse(responseCode = "200", description = "Удалено",
            content = @Content(schema = @Schema(implementation = String.class)))
    @ApiResponse(responseCode = "400", description = "Нельзя удалить: есть зависимости",
            content = @Content(schema = @Schema(implementation = String.class)))
    @DeleteMapping("/deleteCoordinatesById/{id}")
    public ResponseEntity<String> deleteCoordinates(
            @Parameter(description = "ID координат", example = "1")
            @PathVariable long id) {
        System.err.println("deleteCoordinates id: " + id);
        try {
            if (dragonService.isCoordinatesUsed(id)) {
                return ResponseEntity.badRequest()
                        .body("Нельзя удалить координаты: они используются драконами. " +
                                "Сначала удалите или измените связанных драконов.");
            }

            coordinatesRepository.deleteById(id);
            return ResponseEntity.ok("Координаты успешно удалены");

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Ошибка удаления координат: " + e.getMessage());
        }
    }

    @Operation(
            summary = "Удалить пещеру",
            description = "Удаляет пещеру по идентификатору. Если пещера используется — вернёт 400.",
            operationId = "deleteCaveById"
    )
    @ApiResponse(responseCode = "200", description = "Удалено",
            content = @Content(schema = @Schema(implementation = String.class)))
    @ApiResponse(responseCode = "400", description = "Нельзя удалить: есть зависимости",
            content = @Content(schema = @Schema(implementation = String.class)))
    @DeleteMapping("/deleteCaveById/{id}")
    public ResponseEntity<String> deleteCave(
            @Parameter(description = "ID пещеры", example = "1")
            @PathVariable long id) {
        try {
            if (dragonService.isCaveUsed(id)) {
                return ResponseEntity.badRequest()
                        .body("Нельзя удалить пещеру: она используется драконами. " +
                                "Сначала удалите или измените связанных драконов.");
            }

            cavesRepository.deleteById(id);
            return ResponseEntity.ok("Пещера успешно удалена");

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Ошибка удаления пещеры: " + e.getMessage());
        }
    }

    @Operation(
            summary = "Удалить персонажа",
            description = "Удаляет персонажа по идентификатору. Если используется как убийца — вернёт 400.",
            operationId = "deletePersonById"
    )
    @ApiResponse(responseCode = "200", description = "Удалено",
            content = @Content(schema = @Schema(implementation = String.class)))
    @ApiResponse(responseCode = "400", description = "Нельзя удалить: есть зависимости",
            content = @Content(schema = @Schema(implementation = String.class)))
    @DeleteMapping("/deletePersonById/{id}")
    public ResponseEntity<String> deletePerson(
            @Parameter(description = "ID персонажа", example = "1")
            @PathVariable long id) {
        if (dragonService.isKillerUsed(id)) {
            return ResponseEntity.badRequest()
                    .body("Нельзя удалить персонажа: он является убийцей драконов. " +
                            "Сначала удалите или измените связанных драконов.");
        }
        personService.deletePersonById(id);
        return ResponseEntity.ok("Персонаж успешно удален");
    }

    @Operation(
            summary = "Удалить голову дракона",
            description = "Удаляет голову по идентификатору. Если используется — вернёт 400.",
            operationId = "deleteHeadById"
    )
    @ApiResponse(responseCode = "200", description = "Удалено",
            content = @Content(schema = @Schema(implementation = String.class)))
    @ApiResponse(responseCode = "400", description = "Нельзя удалить: есть зависимости",
            content = @Content(schema = @Schema(implementation = String.class)))
    @DeleteMapping("/deleteHeadById/{id}")
    public ResponseEntity<String> deleteHead(
            @Parameter(description = "ID головы", example = "1")
            @PathVariable long id) {
        try {
            if (dragonService.isHeadUsed(id)) {
                return ResponseEntity.badRequest()
                        .body("Нельзя удалить голову: она используется драконами. " +
                                "Сначала удалите или измените связанных драконов.");
            }

            headRepository.deleteById(id);
            return ResponseEntity.ok("Голова дракона успешно удалена");

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Ошибка удаления головы: " + e.getMessage());
        }
    }

    @Operation(
            summary = "Удалить локацию",
            description = "Удаляет локацию по идентификатору. Если используется — вернёт 400.",
            operationId = "deleteLocationById"
    )
    @ApiResponse(responseCode = "200", description = "Удалено",
            content = @Content(schema = @Schema(implementation = String.class)))
    @ApiResponse(responseCode = "400", description = "Нельзя удалить: есть зависимости",
            content = @Content(schema = @Schema(implementation = String.class)))
    @DeleteMapping("/deleteLocationById/{id}")
    public ResponseEntity<String> deleteLocation(
            @Parameter(description = "ID локации", example = "1")
            @PathVariable long id) {
        try {
            if (personService.isLocationUsed(id)) {
                return ResponseEntity.badRequest()
                        .body("Нельзя удалить локацию: она используется персонажами. " +
                                "Сначала удалите или измените связанных персонажей.");
            }

            locationRepository.deleteById(id);
            return ResponseEntity.ok("Локация успешно удалена");

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Ошибка удаления локации: " + e.getMessage());
        }
    }
}
