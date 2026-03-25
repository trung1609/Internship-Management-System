package com.trung.mapper;

import com.trung.domain.entity.InternshipAssignment;
import com.trung.domain.entity.InternshipPhase;
import com.trung.domain.entity.Mentor;
import com.trung.domain.entity.Student;
import com.trung.domain.enums.AssignmentStatus;
import com.trung.dto.response.InternshipAssignmentResponse;

import java.time.LocalDateTime;

public class InternshipAssignmentMapper {
    public static InternshipAssignmentResponse toDto(InternshipAssignment entity){
        return InternshipAssignmentResponse.builder()
                .studentId(entity.getStudent().getStudentId())
                .studentName(entity.getStudent().getUser().getFullName())
                .mentorId(entity.getMentor().getMentorId())
                .mentorName(entity.getMentor().getUser().getFullName())
                .phaseId(entity.getPhase().getPhaseId())
                .phaseName(entity.getPhase().getPhaseName())
                .assignedDate(entity.getAssignedDate())
                .status(entity.getStatus())
                .build();
    }

    public static InternshipAssignment toEntity(Student student, Mentor mentor, InternshipPhase phase){
        return InternshipAssignment.builder()
                .student(student)
                .mentor(mentor)
                .phase(phase)
                .assignedDate(LocalDateTime.now())
                .status(AssignmentStatus.PENDING)
                .build();
    }

}
