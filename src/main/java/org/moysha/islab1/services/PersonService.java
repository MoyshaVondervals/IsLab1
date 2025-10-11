package org.moysha.islab1.services;

import lombok.RequiredArgsConstructor;
import org.moysha.islab1.dto.LocationDTO;
import org.moysha.islab1.dto.LocationRefDTO;
import org.moysha.islab1.dto.PersonDTO;
import org.moysha.islab1.models.Person;
import org.moysha.islab1.repositories.LocationRepository;
import org.moysha.islab1.repositories.PersonRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PersonService {
    private final PersonRepository personRepository;
    private final LocationRepository locationRepository;

    public List<PersonDTO> getAllPersons() {
        List<Person> persons = personRepository.findAll();
        List<PersonDTO> dto = new ArrayList<>();
        for (Person person : persons) {
            dto.add(PersonDTO.builder()
                            .id(person.getId())
                            .name(person.getName())
                            .eyeColor(person.getEyeColor())
                            .hairColor(person.getHairColor())
                            .location(LocationDTO.builder()
                                    .x(person.getLocation().getX())
                                    .y(person.getLocation().getY())
                                    .z(person.getLocation().getZ()).build())
                            .passportID(person.getPassportID())
                            .nationality(person.getNationality())
                    .build());
        }
        return dto;
    }

    public Person getPersonById(long id) {
        return personRepository.findById(id);
    }

    public Person save(Person person) {
        return personRepository.save(person);
    }

    public void deletePersonById(long id) {
        if (personRepository.findById(id).getLocation() != null) {
            boolean locationUsedByOthers = personRepository.existByLocationIdAndIdNot(personRepository.findById(id).getLocation().getId(), id);
            if (!locationUsedByOthers) {
                locationRepository.delete(personRepository.findById(id).getLocation());
            }
        }
        personRepository.findById(id).setLocation(null);
        personRepository.deleteById(id);
    }


    public boolean isLocationUsed(Long locationId) {
        return personRepository.existsByLocationId(locationId);
    }
}
