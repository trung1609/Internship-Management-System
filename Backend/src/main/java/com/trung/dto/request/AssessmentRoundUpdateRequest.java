package com.trung.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.trung.validation.ValidDateRange;
import jakarta.validation.Valid;
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
public class AssessmentRoundUpdateRequest {

    @Pattern(regexp = "^(|[\\p{L}0-9]+( [\\p{L}0-9]+)*)$", message = "Round name must contain only letters and numbers, and cannot have leading or trailing spaces")
    private String roundName;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate startDate;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate endDate;

    private String description;
    private Boolean isActive;

    @Valid
    private List<RoundCriterionUpdateRequest> criteria;
}
