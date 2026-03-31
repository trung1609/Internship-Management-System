package com.trung.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class UsernameValidator implements ConstraintValidator<Username, String> {

    private static final String USERNAME_REGEX = "^[a-zA-Z0-9_]+$";

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return value.matches(USERNAME_REGEX);
    }
}
