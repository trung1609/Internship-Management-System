package com.trung.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InternshipAssignmentCreateRequest {
    @NotNull(message = "Phase ID is required.")
    private Long phaseId;

    @NotNull(message = "Student ID is required.")
    private List<Long> studentIds;

    @NotNull(message = "Mentor ID is required.")
    private Long mentorId;
}
