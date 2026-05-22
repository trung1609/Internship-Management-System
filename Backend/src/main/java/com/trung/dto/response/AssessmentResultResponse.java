package com.trung.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AssessmentResultResponse {
    private Long id;
    private Long assignmentId;
    private String assignmentName;

    private Long roundId;
    private String roundName;

    private Long criterionId;
    private String criterionName;

    private BigDecimal score;
    private String comments;
    private Long evaluatorId;
    private String evaluatorName;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate evaluationDate;
}
