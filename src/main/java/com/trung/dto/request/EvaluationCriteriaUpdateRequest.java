package com.trung.dto.request;

import com.trung.validation.Name;
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

    @Name(message = "Criterion name must contain only letters and numbers, and cannot have leading or trailing spaces")
    private String criterionName;

    private String description;

    @Positive(message = "Max score must be positive")
    private BigDecimal maxScore;

}
