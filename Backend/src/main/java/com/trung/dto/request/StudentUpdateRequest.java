package com.trung.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StudentUpdateRequest {

    @Pattern(regexp = "^(|S[a-zA-Z0-9]{7})$", message = "Student code must start with 'S' followed by 7 digits.")
    private String studentCode;

    @Pattern(regexp = "^(|[\\p{L}0-9]+( [\\p{L}0-9]+)*)$", message = "Invalid full name. Full name must contain only letters, numbers, and spaces, and cannot start or end with a space.")
    private String fullName;

    @Email(message = "Email is not valid")
    private String email;

    @Pattern(regexp = "^(|0[356789]\\d{8})$", message = "Invalid phone number. Phone number must be 10 digits and start with '0'.")
    private String phoneNumber;


    @Pattern(regexp = "^(|[\\p{L}0-9]+( [\\p{L}0-9]+)*)$", message = "Major must contain only letters and numbers separated by single spaces")
    public String major;

    @Pattern(regexp = "^(|[\\p{L}0-9]+( [\\p{L}0-9]+)*)$", message = "Class room must contain only letters and numbers separated by single spaces")
    private String classRoom;

    @Pattern(regexp = "^(|[\\p{L}0-9]+( [\\p{L}0-9]+)*)$", message = "Address must contain only letters and numbers separated by single spaces")
    private String address;

    @JsonFormat(pattern = "dd/MM/yyyy")
    @Past(message = "Date of birth must be in the past")
    public LocalDate dateOfBirth;
}
