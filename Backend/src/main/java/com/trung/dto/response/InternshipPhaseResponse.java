package com.trung.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InternshipPhaseResponse {
    private String phaseName;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate startDate;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate endDate;
    private String description;
    private boolean isDeleted;
}
