package com.trung.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.google.errorprone.annotations.FormatMethod;
import com.trung.validation.Name;
import com.trung.validation.UniquePhaseName;
import com.trung.validation.ValidDateRange;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ValidDateRange(startDateField = "startDate", endDateField = "endDate")
public class InternshipPhaseCreateRequest {
    @NotBlank(message = "Phase name is required")
    @UniquePhaseName
    @Name(message = "Phase name must contain only letters and numbers, and cannot have leading or trailing spaces")
    private String phaseName;

    @NotBlank(message = "Start date is required")
    private String startDate;

    @NotBlank(message = "End date is required")
    private String endDate;


    private String description;
}
