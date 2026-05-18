package com.trung.dto.request;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EvaluationCriteriaUpdateRequest {

    @Pattern(regexp = "^(|[\\p{L}0-9]+( [\\p{L}0-9]+)*)$", message = "Criterion name must contain only letters and numbers, and cannot have leading or trailing spaces")
    private String criterionName;

    private String description;

    @Positive(message = "Max score must be positive")
    private BigDecimal maxScore;

}
