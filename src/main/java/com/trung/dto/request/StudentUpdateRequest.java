package com.trung.dto.request;

import com.trung.validation.Name;
import com.trung.validation.PhoneNumber;
import com.trung.validation.StudentCode;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StudentUpdateRequest {

    @StudentCode
    private String studentCode;

    @Name
    private String fullName;

    @Email(message = "Email is not valid")
    private String email;

    @PhoneNumber
    private String phoneNumber;


    @Name(message = "Major must contain only letters and numbers separated by single spaces")
    public String major;

    @Name(message = "Class room must contain only letters and numbers separated by single spaces")
    private String classRoom;

    @Name(message = "Address must contain only letters and numbers separated by single spaces")
    private String address;

    private String dateOfBirth;
}
