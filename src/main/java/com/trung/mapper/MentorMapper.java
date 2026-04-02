package com.trung.mapper;

import com.trung.domain.entity.Mentor;
import com.trung.dto.request.MentorCreateRequest;
import com.trung.dto.request.MentorUpdateRequest;
import com.trung.dto.response.MentorPublicResponse;
import com.trung.dto.response.MentorResponse;

public class MentorMapper {
    public static MentorResponse toDto(Mentor mentor){
        return MentorResponse.builder()
                .department(mentor.getDepartment())
                .academicRank(mentor.getAcademicRank())
                .fullName(mentor.getUser().getFullName())
                .email(mentor.getUser().getEmail())
                .phoneNumber(mentor.getUser().getPhoneNumber())
                .build();
    }

    public static MentorPublicResponse toPublicDto(Mentor mentor){
        return MentorPublicResponse.builder()
                .department(mentor.getDepartment())
                .academicRank(mentor.getAcademicRank())
                .fullName(mentor.getUser().getFullName())
                .build();
    }

    public static Mentor toEntity(MentorCreateRequest request){
        return Mentor.builder()
                .department(request.getDepartment())
                .academicRank(request.getAcademicRank())
                .build();
    }

    public static void updateFromDto(Mentor mentor, MentorUpdateRequest request){
        if (request.getDepartment() != null) {
            mentor.setDepartment(request.getDepartment());
        }
        if (request.getAcademicRank() != null) {
            mentor.setAcademicRank(request.getAcademicRank());
        }
        if (request.getFullName() != null) {
            mentor.getUser().setFullName(request.getFullName());
        }
        if (request.getEmail() != null) {
            mentor.getUser().setEmail(request.getEmail());
        }
        if (request.getPhoneNumber() != null) {
            mentor.getUser().setPhoneNumber(request.getPhoneNumber());
        }
    }
}
