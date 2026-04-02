package com.trung.dto.request;


import com.trung.validation.Name;
import com.trung.validation.PhoneNumber;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MentorUpdateRequest {

    @Pattern(regexp = "^[\\p{L}]+( [\\p{L}]+)*$", message = "Department must contain only letters separated by single spaces")
    private String department;

    @Pattern(regexp = "^[\\p{L}]+( [\\p{L}]+)*$", message = "Academic rank must contain only letters separated by single spaces")
    private String academicRank;

    @Name
    private String fullName;

    @PhoneNumber
    private String phoneNumber;

    @Email(message = "Email is not valid")
    private String email;
}
