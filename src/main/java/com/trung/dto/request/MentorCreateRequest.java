package com.trung.dto.request;

import com.trung.validation.Name;
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
    @Name(message = "Department must contain only letters and numbers separated by single spaces")
    private String department;

    @NotBlank(message = "Academic rank is required")
    @Name(message = "Academic rank must contain only letters and numbers separated by single spaces")
    private String academicRank;
}
