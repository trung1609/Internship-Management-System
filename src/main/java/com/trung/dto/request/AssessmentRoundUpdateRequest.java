package com.trung.dto.request;

import com.trung.validation.Name;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AssessmentRoundUpdateRequest {

    @Name(message = "Round name must contain only letters and numbers, and cannot have leading or trailing spaces")
    private String roundName;
    private String startDate;
    private String endDate;
    private String description;
    private Boolean isActive;

    @Valid
    private List<RoundCriterionUpdateRequest> criteria;
}
