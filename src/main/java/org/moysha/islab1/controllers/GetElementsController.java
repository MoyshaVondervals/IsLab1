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
public class GetElementsController {

    private final SimpMessagingTemplate template;
    private final DragonService dragonService;
    private final CaveService caveService;
    private final CoordinatesService coordinatesService;
    private final PersonService personService;
    private final LocationService locationService;
    private final HeadService headService;



    @GetMapping("/getCaves")
    public ResponseEntity<List<DragonCaveDTO>> getCaves() {
        System.err.println("GET CAVES");
        return ResponseEntity.ok(caveService.getAllCaves());
    }

    @GetMapping("/getCoordinates")
    public ResponseEntity<List<CoordinatesDTO>> getCoordinates() {
        System.err.println("GET COORDINATES");
        return ResponseEntity.ok(coordinatesService.getAllCoordinates());

    }

    @GetMapping("/getPerson")
    public ResponseEntity<List<PersonDTO>> getPersons() {
        System.err.println("GET PERSONS");
        return ResponseEntity.ok(personService.getAllPersons());

    }

    @GetMapping("/getLocation")
    public ResponseEntity<List<LocationDTO>> getLocations() {
        System.err.println("GET LOCATIONS");
        return ResponseEntity.ok(locationService.getAllLocations());
    }

    @GetMapping("/getHead")
    public ResponseEntity<List<DragonHeadDTO>> getHeads() {
        System.err.println("GET HEADS");
        return ResponseEntity.ok(headService.getAllHeads());
    }




}
