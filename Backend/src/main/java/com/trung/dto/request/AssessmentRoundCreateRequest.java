package com.trung.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.trung.validation.ValidDateRange;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ValidDateRange(startDateField = "startDate", endDateField = "endDate")
public class AssessmentRoundCreateRequest {

    @NotNull(message = "Phase ID is required.")
    private Long phaseId;

    @NotBlank(message = "Round name is required.")
    @Pattern(regexp = "^(|[\\p{L}0-9]+( [\\p{L}0-9]+)*)$", message = "Round name must contain only letters and numbers, and cannot have leading or trailing spaces")
    private String roundName;

    @NotNull(message = "Start date is required.")
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate startDate;

    @NotNull(message = "End date is required.")
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate endDate;

    private String description;

    @NotNull(message = "Evaluation criteria are required.")
    @Valid
    List<RoundCriterionCreateRequest> roundCriteria;
}
