package com.trung.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = NameValidator.class)
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Name {
    String message() default "Invalid full name. Full name must contain only letters, numbers, and spaces, and cannot start or end with a space.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
