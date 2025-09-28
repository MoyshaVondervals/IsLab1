package org.moysha.islab1.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.moysha.islab1.models.Location;
import org.moysha.islab1.models.Person;
import org.moysha.islab1.unums.Color;
import org.moysha.islab1.unums.Country;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PersonDTO {
    private Long id;
    private String name;
    private String eyeColor;
    private String hairColor;
    private String passportID;
    private String nationality;
    private LocationRefDTO location;

    public Person toEntity(Location locationEntity) {
        Person person = new Person();
        person.setId(id);
        person.setName(name);
        person.setEyeColor(Color.valueOf(eyeColor));
        person.setHairColor(Color.valueOf(hairColor));
        person.setPassportID(passportID);
        person.setNationality(Country.valueOf(nationality));
        person.setLocation(locationEntity);
        return person;
    }
}
