package com.trung.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EvaluationCriteriaResponse {
    private String criterionName;
    private String description;
    private BigDecimal maxScore;
    private boolean isDeleted;
}
