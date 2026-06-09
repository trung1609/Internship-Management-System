package com.trung.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InternshipAssignmentUpdateRequest {

    private String status;

    private String assignmentTitle;
    private String assignmentDescription;
    private Long mentorId;
    private Long phaseId;
    private List<Long> studentIds;
}
