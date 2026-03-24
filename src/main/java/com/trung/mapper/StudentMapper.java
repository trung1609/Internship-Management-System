package com.trung.mapper;

import com.trung.domain.entity.Student;
import com.trung.dto.request.StudentUpdateRequest;
import com.trung.dto.response.StudentResponse;

public class StudentMapper {
    public static StudentResponse toDto(Student student){
        return StudentResponse.builder()
                .studentId(student.getStudentId())
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


    public static void updateFromDto(Student student, StudentUpdateRequest request){
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
            student.setDateOfBirth(request.getDateOfBirth());
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
