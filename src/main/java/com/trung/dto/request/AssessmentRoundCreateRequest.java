package com.trung.dto.request;

import com.trung.validation.Name;
import com.trung.validation.ValidDateRange;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ValidDateRange(startDateField = "startDate", endDateField = "endDate")
public class AssessmentRoundCreateRequest {
    private Long phaseId;

    @Name(message = "Round name must contain only letters and numbers, and cannot have leading or trailing spaces")
    private String roundName;

    @NotBlank(message = "Start date is required.")
    private String startDate;

    @NotBlank(message = "End date is required.")
    private String endDate;
    private String description;

    @NotNull(message = "Evaluation criteria are required.")
    @Valid
    List<RoundCriterionCreateRequest> roundCriteria = new ArrayList<>();
}
