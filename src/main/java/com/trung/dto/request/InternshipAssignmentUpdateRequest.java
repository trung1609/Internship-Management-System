package com.trung.dto.request;

import com.trung.domain.enums.AssignmentStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InternshipAssignmentUpdateRequest {

    @NotBlank(message = "Status is required.")
    private String status;
}
