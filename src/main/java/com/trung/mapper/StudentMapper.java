package com.trung.mapper;

import com.trung.domain.entity.Student;
import com.trung.dto.request.StudentCreateRequest;
import com.trung.dto.request.StudentUpdateRequest;
import com.trung.dto.response.StudentResponse;
import com.trung.exception.InvalidDateFormatException;
import com.trung.exception.ResourceBadRequestException;
import com.trung.util.ValidationErrorUtil;

import java.time.LocalDate;
import java.util.Map;

public class StudentMapper {
    public static StudentResponse toDto(Student student) {
        return StudentResponse.builder()
                .studentCode(student.getStudentCode())
                .major(student.getMajor())
                .classRoom(student.getClassRoom())
                .dateOfBirth(student.getDateOfBirth())
                .address(student.getAddress())
                .fullName(student.getUser().getFullName())
                .email(student.getUser().getEmail())
                .phoneNumber(student.getUser().getPhoneNumber())
                .build();
    }

    public static void toEntity(Student entity, StudentCreateRequest student) throws InvalidDateFormatException, ResourceBadRequestException {
        Map<String, String> errorList = ValidationErrorUtil.createErrorMap();
        String dateFormat = "dd/MM/yyyy";
        LocalDate dob = ValidationErrorUtil.isValidDate(student.getDateOfBirth(), dateFormat);
        if (dob.isAfter(LocalDate.now())) {
            errorList.put("dateOfBirth", "Date of birth cannot be in the future");
            throw new ResourceBadRequestException("Validation failed", errorList);
        }
        entity.setStudentCode(student.getStudentCode());
        entity.setMajor(student.getMajor());
        entity.setClassRoom(student.getClassRoom());
        entity.setDateOfBirth(dob);
        entity.setAddress(student.getAddress());
    }


    public static void updateFromDto(Student student, StudentUpdateRequest request) throws InvalidDateFormatException, ResourceBadRequestException {
        Map<String, String> errorList = ValidationErrorUtil.createErrorMap();
        String dateFormat = "dd/MM/yyyy";
        if (request.getStudentCode() != null) {
            student.setStudentCode(request.getStudentCode());
        }
        if (request.getMajor() != null) {
            student.setMajor(request.getMajor());
        }
        if (request.getClassRoom() != null) {
            student.setClassRoom(request.getClassRoom());
        }
        if (request.getAddress() != null) {
            student.setAddress(request.getAddress());
        }
        if (request.getDateOfBirth() != null) {
            LocalDate dob = ValidationErrorUtil.isValidDate(request.getDateOfBirth(), dateFormat);
            if (dob.isAfter(LocalDate.now())) {
                errorList.put("dateOfBirth", "Date of birth cannot be in the future");
                throw new ResourceBadRequestException("Validation failed", errorList);
            }
            student.setDateOfBirth(dob);
        }
        if (request.getFullName() != null) {
            student.getUser().setFullName(request.getFullName());
        }
        if (request.getEmail() != null) {
            student.getUser().setEmail(request.getEmail());
        }
        if (request.getPhoneNumber() != null) {
            student.getUser().setPhoneNumber(request.getPhoneNumber());
        }
    }
}
