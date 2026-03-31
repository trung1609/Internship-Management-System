package com.trung.dto.request;

import com.trung.validation.Name;
import com.trung.validation.PhoneNumber;
import com.trung.validation.StudentCode;
import jakarta.validation.constraints.Email;
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
    private String major;
    private String classRoom;
    private String address;

    private String dateOfBirth;
}
