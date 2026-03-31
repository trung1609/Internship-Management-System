package com.trung.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
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
    public String major;

    @NotBlank(message = "Class room is required")
    public String classRoom;

    @NotBlank(message = "Date of birth is required")
    public String dateOfBirth;

    @NotBlank(message = "Address is required")
    public String address;
}
