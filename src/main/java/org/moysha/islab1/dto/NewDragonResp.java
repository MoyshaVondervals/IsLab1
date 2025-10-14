package org.moysha.islab1.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import org.moysha.islab1.models.Coordinates;
import org.moysha.islab1.models.DragonCave;
import org.moysha.islab1.models.DragonHead;
import org.moysha.islab1.models.Person;
import org.moysha.islab1.unums.DragonType;

@Data
@Schema(description = "Запрос на аутентификацию")
public class NewDragonResp {


    @NotBlank(message = "Имя дракона не может быть пустым")
    @NotNull(message = "Имя дракона не может быть null")
    String name;

    @NotNull(message = "Координаты не могут быть null")
    Coordinates coordinates;

    @NotNull(message = "Пещера дракона не может быть null")
    DragonCave cave;

    Person killer;

    @Positive(message = "Возраст дракона должен быть больше 0")
    Long age;

    @NotBlank(message = "Описание дракона не может быть пустым")
    String description;

    @Positive(message = "Возраст дракона должен быть больше 0")
    Float wingspan;

    @NotNull(message = "Тип дракона не может быть null")
    DragonType type;

    DragonHead head;



}
