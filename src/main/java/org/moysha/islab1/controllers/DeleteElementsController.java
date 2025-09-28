package org.moysha.islab1.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.moysha.islab1.dto.NewDragonResp;
import org.moysha.islab1.models.*;
import org.moysha.islab1.repositories.CavesRepository;
import org.moysha.islab1.repositories.CoordinatesRepository;
import org.moysha.islab1.repositories.HeadRepository;
import org.moysha.islab1.repositories.LocationRepository;
import org.moysha.islab1.services.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/")
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

    @DeleteMapping("/deleteCoordinatesById/{id}")
    public ResponseEntity<?> deleteCoordinates(@PathVariable long id) {
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

    @DeleteMapping("/deleteCaveById/{id}")
    public ResponseEntity<?> deleteCave(@PathVariable long id) {
        try {
            // Проверяем, используется ли пещера каким-либо драконом
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

    @DeleteMapping("/deletePersonById/{id}")
    public ResponseEntity<?> deletePerson(@PathVariable long id) {
            if (dragonService.isKillerUsed(id)) {

                return ResponseEntity.badRequest()
                        .body("Нельзя удалить персонажа: он является убийцей драконов. " +
                                "Сначала удалите или измените связанных драконов.");
            }

            personService.deletePersonById(id);
            return ResponseEntity.ok("Персонаж успешно удален");


    }

    @DeleteMapping("/deleteHeadById/{id}")
    public ResponseEntity<?> deleteHead(@PathVariable long id) {
        try {
            // Проверяем, используется ли голова каким-либо драконом
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

    @DeleteMapping("/deleteLocationById/{id}")
    public ResponseEntity<?> deleteLocation(@PathVariable long id) {
        try {
            // Проверяем, используется ли локация каким-либо персонажем
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
