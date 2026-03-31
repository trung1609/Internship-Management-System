package com.trung.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class NameValidator implements ConstraintValidator<Name, String> {

    private static final String FULL_NAME_REGEX = "^[\\p{L}0-9]+(\\s[\\p{L}0-9]+)*$";

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return value.matches(FULL_NAME_REGEX);
    }
}
