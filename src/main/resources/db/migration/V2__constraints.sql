ALTER TABLE persons
    ADD CONSTRAINT fk_persons_on_location
        FOREIGN KEY (location_id) REFERENCES locations (id);


ALTER TABLE dragons
    ADD CONSTRAINT fk_dragon_cave         FOREIGN KEY (cave_id)        REFERENCES dragon_caves (id);
ALTER TABLE dragons
    ADD CONSTRAINT fk_dragon_coordinates  FOREIGN KEY (coordinates_id) REFERENCES coordinates (id);
ALTER TABLE dragons
    ADD CONSTRAINT fk_dragon_head         FOREIGN KEY (head_id)        REFERENCES dragon_heads (id);
ALTER TABLE dragons
    ADD CONSTRAINT fk_dragon_killer       FOREIGN KEY (killer_id)      REFERENCES persons (id);


ALTER TABLE dragons
    ADD CONSTRAINT chk_dragon_age_positive      CHECK (age > 0),
    ADD CONSTRAINT chk_dragon_wingspan_positive CHECK (wingspan IS NULL OR wingspan > 0);

ALTER TABLE dragon_caves
    ADD CONSTRAINT chk_cave_treasures_positive CHECK (number_of_treasures IS NULL OR number_of_treasures > 0);

ALTER TABLE dragon_heads
    ADD CONSTRAINT chk_head_size_positive  CHECK (size > 0),
    ADD CONSTRAINT chk_head_eyes_positive  CHECK (eyes_count > 0),
    ADD CONSTRAINT chk_head_tooth_positive CHECK (tooth_count > 0);



