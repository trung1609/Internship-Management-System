package com.trung.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Constraint(validatedBy = UsernameValidator.class)
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Username {
    String message() default "Username must contain only letters, numbers, and underscores";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
