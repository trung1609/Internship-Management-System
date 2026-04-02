package com.trung.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.trung.validation.Name;
import com.trung.validation.StudentCode;
import com.trung.validation.UniqueStudentCode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.time.LocalDate;
import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StudentCreateRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "Student code is required")
    @UniqueStudentCode
    @StudentCode
    public String studentCode;

    @NotBlank(message = "Major is required")
    @Name(message = "Major must contain only letters and numbers separated by single spaces")
    public String major;

    @NotBlank(message = "Class room is required")
    @Name(message = "Class room must contain only letters and numbers separated by single spaces")
    public String classRoom;

    @NotBlank(message = "Date of birth is required")
    public String dateOfBirth;

    @NotBlank(message = "Address is required")
    @Name(message = "Address must contain only letters and numbers separated by single spaces")
    public String address;
}
