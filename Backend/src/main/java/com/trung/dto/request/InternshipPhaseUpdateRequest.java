package com.trung.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.trung.validation.ValidDateRange;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ValidDateRange(startDateField = "startDate", endDateField = "endDate")
public class InternshipPhaseUpdateRequest {

    @Pattern(regexp = "^(|[\\p{L}0-9]+( [\\p{L}0-9]+)*)$", message = "Phase name must contain only letters and numbers, and cannot have leading or trailing spaces")
    private String phaseName;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate startDate;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate endDate;


    private String description;
}
