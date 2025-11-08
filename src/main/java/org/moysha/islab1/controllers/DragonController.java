package org.moysha.islab1.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.*;

import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.moysha.islab1.dto.CoordinatesDTO;
import org.moysha.islab1.dto.DragonDTO;
import org.moysha.islab1.dto.NewDragonResp;
import org.moysha.islab1.dto.UploadDragonsDTO;
import org.moysha.islab1.models.Dragon;
import org.moysha.islab1.services.*;
import org.moysha.islab1.utils.JsonParser;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/")
@Tag(name = "Dragon", description = "Операции над драконами")
@SecurityRequirement(name = "bearerAuth")
public class DragonController {

    private final SimpMessagingTemplate template;
    private final DragonService dragonService;



    @Operation(
            summary = "Создать дракона",
            description = "Создаёт дракона на основании составного запроса. Отправляет обновлённый список по WebSocket.",
            operationId = "createDragon"
    )
    @ApiResponse(responseCode = "201", description = "Создано")
    @ApiResponse(responseCode = "500", description = "Внутренняя ошибка",
            content = @Content(schema = @Schema(implementation = String.class)))
    @PostMapping("/createDragon")
    public ResponseEntity<String> createDragon(@RequestBody @Valid NewDragonResp request) {
        System.out.println(request);
        ResponseEntity<String> result = dragonService.createDragon(request);
        List<Dragon> dragonList = dragonService.getAllDragons();
        template.convertAndSend("/topic/echo", dragonList);

        return result;
    }

    @Operation(
            summary = "Получить всех драконов",
            description = "Возвращает полный список драконов.",
            operationId = "getDragons"
    )
    @ApiResponse(responseCode = "200", description = "OK",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = Dragon.class))))
    @GetMapping("/getDragons")
    public ResponseEntity<List<Dragon>> getDragons() {
        System.err.println("GET DRAGONS");
        return ResponseEntity.ok(dragonService.getAllDragons());
    }

    @Operation(
            summary = "Получить дракона по ID",
            description = "Возвращает дракона по идентификатору.",
            operationId = "getDragonById"
    )
    @ApiResponse(responseCode = "200", description = "Найден",
            content = @Content(schema = @Schema(implementation = Dragon.class)))
    @ApiResponse(responseCode = "404", description = "Не найден")
    @GetMapping("/getDragonById/{id}")
    public ResponseEntity<Dragon> getDragonById(
            @Parameter(description = "ID дракона", example = "1")
            @PathVariable long id) {
        System.err.println("GET DRAGON BY ID");
        if (dragonService.getDragonById(id) != null) {
            return ResponseEntity.ok(dragonService.getDragonById(id));
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @Operation(
            summary = "Обновить дракона по ID",
            description = "Обновляет данные дракона и возвращает DTO.",
            operationId = "updateDragonById"
    )
    @ApiResponse(responseCode = "200", description = "Обновлено",
            content = @Content(schema = @Schema(implementation = DragonDTO.class)))
    @PutMapping("/updateDragonById/{id}")
    public ResponseEntity<DragonDTO> updateDragon(
            @Parameter(description = "ID дракона", example = "1")
            @PathVariable Long id,

            @RequestBody Dragon updatedDragon) {
        Dragon result = dragonService.updateDragon(id, updatedDragon);
        DragonDTO dto = dragonService.convertToDTO(result);
        System.err.println(updatedDragon.toString());
        return ResponseEntity.ok(dto);
    }

    @Operation(
            summary = "Удалить дракона по ID",
            description = "Удаляет дракона, отправляет обновлённый список по WebSocket.",
            operationId = "deleteDragonById"
    )
    @ApiResponse(responseCode = "201", description = "Удалено (сайд-эффект отправки списка)",
            content = @Content(schema = @Schema(implementation = String.class)))
    @DeleteMapping("/deleteDragonById/{id}")
    public ResponseEntity<String> deleteDragon(
            @Parameter(description = "ID дракона", example = "1")
            @PathVariable long id) {
        System.err.println("DELETE DRAGON BY ID" + id);
        dragonService.deleteDragon(id);
        List<Dragon> dragonList = dragonService.getAllDragons();
        template.convertAndSend("/topic/echo", dragonList);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }


    @Operation(
            summary = "uploadDragons",
            description = "Парсит и валидирует json, псле создает объекты",
            operationId = "uploadDragons"
    )
    @ApiResponse(responseCode = "201", description = "Объекты добавлены",
    content = @Content(schema = @Schema(implementation = UploadDragonsDTO.class)))
    @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")
    @PostMapping(value = "/import/dragons", consumes = "application/json", produces = "text/plain")
    public ResponseEntity<String> uploadDragons(@RequestBody UploadDragonsDTO dto) throws Exception {
        System.err.println(dto.getDragonsJson());
        return dragonService.uploadDragon(dto.getDragonsJson());
    }

    @Operation(
            summary = "Удалить всех драконов",
            description = "Удалить всех драконов",
            operationId = "deleteAllDragons"
    )
    @ApiResponse(responseCode = "201", description = "Удалено",
            content = @Content(schema = @Schema(implementation = String.class)))
    @DeleteMapping("/dragonsTotal4k")
    public ResponseEntity<String> deleteAllDragons() {
        List<Dragon> dragonList = dragonService.getAllDragons();
        for (Dragon dragon : dragonList) {
            dragonService.deleteDragon(dragon.getId());
        }
        template.convertAndSend("/topic/echo", dragonList);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }



}
