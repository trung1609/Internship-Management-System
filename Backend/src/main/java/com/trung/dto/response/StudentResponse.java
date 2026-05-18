package com.trung.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDate;
import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StudentResponse {

    private String fullName;

    private String email;

    private String phoneNumber;

    public String studentCode;

    public String major;

    public String classRoom;

    @JsonFormat(pattern = "dd/MM/yyyy")
    public LocalDate dateOfBirth;

    public String address;
}
