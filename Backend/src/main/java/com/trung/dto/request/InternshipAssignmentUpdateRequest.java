package com.trung.dto.request;

import jakarta.validation.constraints.NotBlank;
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
