package org.moysha.islab1.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.*;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.moysha.islab1.dto.DragonDTO;
import org.moysha.islab1.dto.KillDragonDTO;
import org.moysha.islab1.models.Dragon;
import org.moysha.islab1.services.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/")
@Tag(name = "Special", description = "Специальные бизнес-операции")
@SecurityRequirement(name = "bearerAuth")
public class SpecialController {

    private final DragonService dragonService;


    @Operation(summary = "Средний возраст драконов", operationId = "getAvgAge")
    @ApiResponse(responseCode = "200", description = "OK",
            content = @Content(schema = @Schema(implementation = Double.class)))
    @GetMapping("/dragons/avgAge")
    public ResponseEntity<Double> avgAge() {
        return ResponseEntity.ok(dragonService.avgAge());
    }

    @Operation(summary = "Дракон с максимальной пещерой", operationId = "getDragonWithMaxCave")
    @ApiResponse(responseCode = "200", description = "OK",
            content = @Content(schema = @Schema(implementation = DragonDTO.class)))
    @GetMapping("/dragons/maxCave")
    public ResponseEntity<DragonDTO> maxCave() {
        return ResponseEntity.ok(dragonService.findDragonWithMaxCave());
    }

    @Operation(
            summary = "Дракон с головой больше параметра",
            description = "Ищет дракона, у которого размер головы больше указанного параметра.",
            operationId = "getDragonHeadGreater"
    )
    @ApiResponse(responseCode = "200", description = "OK",
            content = @Content(schema = @Schema(implementation = DragonDTO.class)))
    @GetMapping("/dragons/headGreater/{param}")
    public ResponseEntity<List<DragonDTO>> getDragonById(
            @Parameter(description = "Пороговое значение для размера головы", example = "10")
            @PathVariable long param) {
        return ResponseEntity.ok(dragonService.findDragonsWithHeadGreater(param));
    }

    @Operation(summary = "Самый старый дракон", operationId = "getOldestDragon")
    @ApiResponse(responseCode = "200", description = "OK",
            content = @Content(schema = @Schema(implementation = DragonDTO.class)))
    @GetMapping("/dragons/oldest")
    public ResponseEntity<DragonDTO> getOldestDragon() {
        return ResponseEntity.ok(dragonService.getOldestDragon());
    }

    @Operation(
            summary = "Убить дракона",
            description = "Отмечает дракона как убитого, связывая с указанным убийцей. " +
                    "404 — если дракон/убийца не найдены, 409 — если уже убит.",
            operationId = "killDragon"
    )
    @ApiResponse(responseCode = "200", description = "OK",
            content = @Content(schema = @Schema(implementation = Dragon.class)))
    @ApiResponse(responseCode = "404", description = "Не найдено",
            content = @Content(schema = @Schema(implementation = String.class)))
    @ApiResponse(responseCode = "409", description = "Конфликт состояния",
            content = @Content(schema = @Schema(implementation = String.class)))
    @PostMapping("/dragons/kill")
    public ResponseEntity<Dragon> killDragon(
            @RequestBody(description = "ID дракона и убийцы", required = true,
                    content = @Content(schema = @Schema(implementation = KillDragonDTO.class)))
            @org.springframework.web.bind.annotation.RequestBody @Valid KillDragonDTO dto) {
        try {
            System.err.println(2);
            Dragon killed = dragonService.killDragon(dto.getDragonId(), dto.getKillerId());
            return ResponseEntity.ok(killed);
        } catch (jakarta.persistence.EntityNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Dragon not found", e);
        } catch (IllegalStateException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Dragon is already killed", e);
        }
    }


}
