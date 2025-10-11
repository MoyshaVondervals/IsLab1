package org.moysha.islab1.controllers;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.moysha.islab1.dto.DragonDTO;
import org.moysha.islab1.dto.KillDragonDTO;
import org.moysha.islab1.dto.NewDragonResp;
import org.moysha.islab1.models.*;
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
    public ResponseEntity<DragonDTO> maxCave() {
        return ResponseEntity.ok(dragonService.findDragonWithMaxCave());
    }

    @GetMapping("/dragons/headGreater/{param}")
    public ResponseEntity<DragonDTO> getDragonById(@PathVariable long param) {
        return ResponseEntity.ok(dragonService.findDragonWithHead(param));
    }


    @GetMapping("/dragons/oldest")
    public ResponseEntity<DragonDTO> getOldestDragon() {
        return ResponseEntity.ok(dragonService.getOldestDragon());
    }



    @PostMapping("/dragons/kill")
    public ResponseEntity<Dragon> killDragon(@Valid @RequestBody KillDragonDTO dto) {
        try {
            System.err.println(2);
            Dragon killed = dragonService.killDragon(dto.getDragonId(), dto.getKillerId());
            return ResponseEntity.ok(killed);
        } catch (EntityNotFoundException e) {
            // не нашли дракона/убийцу — 404
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Dragon not found", e);
        } catch (IllegalStateException e) {
            // уже убит или бизнес-правило — 409
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Dragon is already killed", e);
        }
    }

}
