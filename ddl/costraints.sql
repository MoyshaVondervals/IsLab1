
ALTER TABLE dragons
    ADD CONSTRAINT chk_dragon_age_positive CHECK (age > 0),
    ADD CONSTRAINT chk_dragon_wingspan_positive CHECK (wingspan IS NULL OR wingspan > 0);


ALTER TABLE dragon_caves
    ADD CONSTRAINT chk_cave_treasures_positive CHECK (number_of_treasures IS NULL OR number_of_treasures > 0);


ALTER TABLE dragon_heads
    ADD CONSTRAINT chk_head_size_positive CHECK (size > 0),
    ADD CONSTRAINT chk_head_eyes_positive CHECK (eyes_count > 0),
    ADD CONSTRAINT chk_head_tooth_positive CHECK (tooth_count > 0);


ALTER TABLE persons ADD CONSTRAINT uk_persons_passport UNIQUE (passportID);