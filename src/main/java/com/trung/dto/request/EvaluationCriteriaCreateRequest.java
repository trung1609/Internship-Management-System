package com.trung.dto.request;

import com.trung.validation.Name;
import com.trung.validation.UniqueCriteria;
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
    @UniqueCriteria
    @Name(message = "Criterion name must contain only letters and numbers, and cannot have leading or trailing spaces")
    private String criterionName;

    private String description;

    @NotNull(message = "Max score is required")
    @Positive(message = "Max score must be positive")
    private BigDecimal maxScore;

}
