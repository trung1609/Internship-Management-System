package com.trung.dto.request;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MentorUpdateRequest {

    @Pattern(regexp = "^(|[\\p{L}0-9]+( [\\p{L}0-9]+)*)$", message = "Department must contain only letters separated by single spaces")
    private String department;

    @Pattern(regexp = "^(|[\\p{L}0-9]+( [\\p{L}0-9]+)*)$", message = "Academic rank must contain only letters separated by single spaces")
    private String academicRank;

    @Pattern(regexp = "^(|[\\p{L}0-9]+( [\\p{L}0-9]+)*)$", message = "Invalid full name. Full name must contain only letters, numbers, and spaces, and cannot start or end with a space.")
    private String fullName;

    @Pattern(regexp = "^(|0[356789]\\d{8})$", message = "Invalid phone number. Phone number must be 10 digits and start with '0'.")
    private String phoneNumber;

    @Email(message = "Email is not valid")
    private String email;
}
