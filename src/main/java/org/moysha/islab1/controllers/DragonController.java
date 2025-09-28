package org.moysha.islab1.controllers;

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
public class DragonController {

    private final SimpMessagingTemplate template;
    private final DragonService dragonService;
    private final CaveService caveService;
    private final CoordinatesService coordinatesService;
    private final PersonService personService;
    private final LocationService locationService;
    private final HeadService headService;

    @PostMapping("/createDragon")
    public ResponseEntity push(@RequestBody @Valid NewDragonResp request) {
        System.err.println(request.toString());
        try {
            dragonService.createDragon(request);
            List<Dragon> dragonList = dragonService.getAllDragons();

            template.convertAndSend("/topic/echo", dragonList);
            return new ResponseEntity<>(HttpStatus.CREATED);
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("server-push failed");
        }



    }



    @GetMapping("/getDragons")
    public ResponseEntity<List<Dragon>> getDragons() {
        System.err.println("GET DRAGONS");
        return ResponseEntity.ok(dragonService.getAllDragons());
    }

    @GetMapping("/getDragonById/{id}")
    public ResponseEntity<Dragon> getDragonById(@PathVariable long id) {
        System.err.println("GET DRAGON BY ID");
        if (dragonService.getDragonById(id) != null) {
            return ResponseEntity.ok(dragonService.getDragonById(id));
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/updateDragonById/{id}")
    public ResponseEntity<?> updateDragon(@PathVariable Long id, @RequestBody Dragon updatedDragon) {
//        try {
            Dragon result = dragonService.updateDragon(id, updatedDragon);
            System.err.println(updatedDragon.toString());
            return ResponseEntity.ok(result);
//            return ResponseEntity.ok(dragonService.getDragonById(id));
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body("Error updating dragon: " + e.getMessage());
//        }
    }

    @DeleteMapping("/deleteDragonById/{id}")
    public ResponseEntity<?> deleteDragon(@PathVariable long id) {
        System.err.println("DELETE DRAGON BY ID"+id);
        dragonService.deleteDragon(id);
        List<Dragon> dragonList = dragonService.getAllDragons();
        template.convertAndSend("/topic/echo", dragonList);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }


}
