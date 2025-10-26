package org.moysha.islab1.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.*;
import lombok.RequiredArgsConstructor;
import org.moysha.islab1.dto.*;
import org.moysha.islab1.services.*;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/")
@Tag(name = "Get", description = "Получение списков сущностей")
@SecurityRequirement(name = "bearerAuth")
public class GetElementsController {

    private final CaveService caveService;
    private final CoordinatesService coordinatesService;
    private final PersonService personService;
    private final LocationService locationService;
    private final HeadService headService;

    @Operation(summary = "Получить пещеры", operationId = "getCaves")
    @ApiResponse(responseCode = "200", description = "OK",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = DragonCaveDTO.class))))
    @GetMapping("/getCaves")
    public ResponseEntity<List<DragonCaveDTO>> getCaves() {
        System.err.println("GET CAVES");
        return ResponseEntity.ok(caveService.getAllCaves());
    }

    @Operation(summary = "Получить координаты", operationId = "getCoordinates")
    @ApiResponse(responseCode = "200", description = "OK",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = CoordinatesDTO.class))))
    @GetMapping("/getCoordinates")
    public ResponseEntity<List<CoordinatesDTO>> getCoordinates() {
        System.err.println("GET COORDINATES");
        return ResponseEntity.ok(coordinatesService.getAllCoordinates());
    }

    @Operation(summary = "Получить персонажей", operationId = "getPersons")
    @ApiResponse(responseCode = "200", description = "OK",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = PersonDTO.class))))
    @GetMapping("/getPerson")
    public ResponseEntity<List<PersonDTO>> getPersons() {
        System.err.println("GET PERSONS");
        return ResponseEntity.ok(personService.getAllPersons());
    }

    @Operation(summary = "Получить локации", operationId = "getLocations")
    @ApiResponse(responseCode = "200", description = "OK",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = LocationDTO.class))))
    @GetMapping("/getLocation")
    public ResponseEntity<List<LocationDTO>> getLocations() {
        System.err.println("GET LOCATIONS");
        return ResponseEntity.ok(locationService.getAllLocations());
    }

    @Operation(summary = "Получить головы драконов", operationId = "getHeads")
    @ApiResponse(responseCode = "200", description = "OK",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = DragonHeadDTO.class))))
    @GetMapping("/getHead")
    public ResponseEntity<List<DragonHeadDTO>> getHeads() {
        System.err.println("GET HEADS");
        return ResponseEntity.ok(headService.getAllHeads());
    }
}
