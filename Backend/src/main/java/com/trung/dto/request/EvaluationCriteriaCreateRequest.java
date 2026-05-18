package com.trung.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EvaluationCriteriaCreateRequest {
    @NotBlank(message = "Criterion name is required")
    @Pattern(regexp = "^(|[\\p{L}0-9]+( [\\p{L}0-9]+)*)$", message = "Criterion name must contain only letters and numbers separated by single spaces")
    private String criterionName;

    private String description;

    @NotNull(message = "Max score is required")
    @Positive(message = "Max score must be positive")
    private BigDecimal maxScore;

}
