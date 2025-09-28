package org.moysha.islab1.controllers;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.moysha.islab1.dto.NewDragonResp;
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
public class SpecialController {

    private final SimpMessagingTemplate template;
    private final DragonService dragonService;
    private final CaveService caveService;
    private final CoordinatesService coordinatesService;
    private final PersonService personService;
    private final LocationService locationService;
    private final HeadService headService;


    @GetMapping("/dragons/avgAge")
    public ResponseEntity<Double> avgAge() {
        return ResponseEntity.ok(dragonService.avgAge());
    }

    @GetMapping("/dragons/maxCave")
    public ResponseEntity<Dragon> maxCave() {
        return ResponseEntity.ok(dragonService.findDragonWithMaxCave());
    }

    @GetMapping("/dragons/headGreater/{param}")
    public ResponseEntity<Dragon> getDragonById(@PathVariable long param) {
        return ResponseEntity.ok(dragonService.findDragonWithHead(param));
    }


    @GetMapping("/dragons/oldest")
    public ResponseEntity<Dragon> getOldestDragon() {
        return ResponseEntity.ok(dragonService.getOldestDragon());
    }



    @PostMapping("/kill/{id}")
    public ResponseEntity<?> killDragon(
            @PathVariable Long id,
            @RequestParam Long killerId
    ) {
        try {
            Dragon killed = dragonService.killDragon(id, killerId);
            return ResponseEntity.ok(killed);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
