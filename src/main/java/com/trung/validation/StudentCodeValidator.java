package com.trung.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class StudentCodeValidator implements ConstraintValidator<StudentCode, String> {

    private static  final String STUDENT_CODE_PATTERN = "^S[a-zA-Z0-9]{7}$";

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isBlank()) {
            return true;
        }
        return value.matches(STUDENT_CODE_PATTERN);
    }
}
