package org.moysha.islab1.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.moysha.islab1.models.Location;
import org.moysha.islab1.models.Person;
import org.moysha.islab1.unums.Color;
import org.moysha.islab1.unums.Country;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PersonDTO {
    private Long id;
    private String name;
    private Color eyeColor;
    private Color hairColor;
    private String passportID;
    private Country nationality;
    private LocationDTO location;

    public Person toEntity(Location locationEntity) {
        Person person = new Person();
        person.setId(id);
        person.setName(name);
        person.setEyeColor(eyeColor);
        person.setHairColor(hairColor);
        person.setPassportID(passportID);
        person.setNationality(nationality);
        person.setLocation(locationEntity);
        return person;
    }
}
