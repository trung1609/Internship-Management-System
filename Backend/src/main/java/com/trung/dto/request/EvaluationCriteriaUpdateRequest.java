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

    private String criterionName;

    private String description;

    @Positive(message = "Max score must be positive")
    private BigDecimal maxScore;

    private Boolean isDeleted;
}
