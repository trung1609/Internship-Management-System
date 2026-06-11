package com.trung.mapper;

import com.trung.dto.request.InternshipAssignmentCreateRequest;
import com.trung.dto.response.InternshipAssignmentResponse;
import com.trung.entity.InternshipAssignment;
import com.trung.entity.InternshipPhase;
import com.trung.entity.Mentor;
import com.trung.entity.Student;
import com.trung.util.enums.AssignmentStatus;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class InternshipAssignmentMapper {
    public static InternshipAssignmentResponse toDto(InternshipAssignment entity) {
        List<InternshipAssignmentResponse.StudentBasicInfo> studentInfos = new ArrayList<>();
        if (entity.getStudents() != null) {
            studentInfos = entity.getStudents().stream()
                    .map(s -> InternshipAssignmentResponse.StudentBasicInfo.builder()
                            .id(s.getStudentId())
                            .name(s.getUser().getFullName())
                            .code(s.getStudentCode())
                            .major(s.getMajor())
                            .avatarUrl(s.getUser().getAvatarUrl())
                            .build())
                    .toList();
        }
        return InternshipAssignmentResponse.builder()
                .id(entity.getAssignmentId())
                .assignmentTitle(entity.getAssignmentTitle())
                .assignmentDescription(entity.getAssignmentDescription())
                .mentorId(entity.getMentor().getMentorId())
                .mentorName(entity.getMentor().getUser().getFullName())
                .phaseId(entity.getPhase().getPhaseId())
                .phaseName(entity.getPhase().getPhaseName())
                .assignedDate(entity.getAssignedDate())
                .status(entity.getStatus())
                .students(studentInfos)
                .build();
    }

    public static InternshipAssignment toEntity(InternshipAssignmentCreateRequest request, List<Student> students, Mentor mentor, InternshipPhase phase) {
        return InternshipAssignment.builder()
                .assignmentTitle(request.getAssignmentTitle())
                .assignmentDescription(request.getAssignmentDescription())
                .students(students)
                .mentor(mentor)
                .phase(phase)
                .assignedDate(LocalDateTime.now().toLocalDate())
                .status(AssignmentStatus.PENDING)
                .build();
    }

}
