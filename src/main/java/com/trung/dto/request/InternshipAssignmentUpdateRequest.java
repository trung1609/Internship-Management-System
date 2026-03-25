package com.trung.dto.request;

import com.trung.domain.enums.AssignmentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InternshipAssignmentUpdateRequest {

    @NotNull(message = "Status is required.")
    private AssignmentStatus status;
}
