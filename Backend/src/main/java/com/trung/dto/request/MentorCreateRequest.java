package com.trung.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MentorCreateRequest {
    @NotNull(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "Department is required")
    @Pattern(regexp = "^(|[\\p{L}0-9]+( [\\p{L}0-9]+)*)$", message = "Department must contain only letters and numbers separated by single spaces")
    private String department;

    @NotBlank(message = "Academic rank is required")
    @Pattern(regexp = "^(|[\\p{L}0-9]+( [\\p{L}0-9]+)*)$", message = "Academic rank must contain only letters and numbers separated by single spaces")
    private String academicRank;
}
