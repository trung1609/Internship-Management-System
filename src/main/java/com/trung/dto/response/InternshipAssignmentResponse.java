package com.trung.dto.response;

import com.trung.domain.enums.AssignmentStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InternshipAssignmentResponse {
    private Long studentId;
    private String studentName;
    private Long mentorId;
    private String mentorName;
    private Long phaseId;
    private String phaseName;
    private LocalDateTime assignedDate;
    private AssignmentStatus status;
}
