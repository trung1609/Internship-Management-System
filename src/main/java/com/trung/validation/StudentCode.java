package com.trung.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = StudentCodeValidator.class)
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface StudentCode {
    String message() default "Student code must start with 'S' followed by 7 digits.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
