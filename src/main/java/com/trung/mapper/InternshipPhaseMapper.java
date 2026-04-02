package com.trung.mapper;

import com.trung.domain.entity.InternshipPhase;
import com.trung.dto.request.InternshipPhaseCreateRequest;
import com.trung.dto.request.InternshipPhaseUpdateRequest;
import com.trung.dto.response.InternshipPhaseResponse;
import com.trung.exception.InvalidDateFormatException;
import com.trung.exception.ResourceBadRequestException;
import com.trung.util.ValidationErrorUtil;

import java.time.LocalDate;
import java.util.Map;

public class InternshipPhaseMapper {
    public static InternshipPhaseResponse toDto(InternshipPhase internshipPhase){
        return InternshipPhaseResponse.builder()
                .phaseName(internshipPhase.getPhaseName())
                .startDate(internshipPhase.getStartDate())
                .endDate(internshipPhase.getEndDate())
                .description(internshipPhase.getDescription())
                .build();
    }

    public static InternshipPhase toEntity(InternshipPhaseCreateRequest request) throws InvalidDateFormatException {
        String dateFormat = "dd/MM/yyyy";
        LocalDate startDate = ValidationErrorUtil.isValidDate(request.getStartDate(), dateFormat);
        LocalDate endDate = ValidationErrorUtil.isValidDate(request.getEndDate(), dateFormat);
        return InternshipPhase.builder()
                .phaseName(request.getPhaseName())
                .startDate(startDate)
                .endDate(endDate)
                .description(request.getDescription())
                .build();
    }

    public static void updateFromDto(InternshipPhase internshipPhase, InternshipPhaseUpdateRequest request) throws InvalidDateFormatException, ResourceBadRequestException {
        String dateFormat = "dd/MM/yyyy";
        Map<String, String> errorList = ValidationErrorUtil.createErrorMap();
        if (request.getPhaseName() != null) {
            internshipPhase.setPhaseName(request.getPhaseName());
        }
        if (request.getStartDate() != null) {
            LocalDate startDate = ValidationErrorUtil.isValidDate(request.getStartDate(), dateFormat);
            if (startDate.isAfter(internshipPhase.getEndDate())) {
                errorList.put("startDate", "Start date cannot be after end date");
                throw new ResourceBadRequestException("Validation failed", errorList);
            }
            internshipPhase.setStartDate(startDate);
        }
        if (request.getEndDate() != null) {
            LocalDate endDate = ValidationErrorUtil.isValidDate(request.getEndDate(), dateFormat);
            if (endDate.isBefore(internshipPhase.getStartDate())) {
                errorList.put("endDate", "End date cannot be before start date");
                throw new ResourceBadRequestException("Validation failed", errorList);
            }
            internshipPhase.setEndDate(endDate);
        }
        if (request.getDescription() != null) {
            internshipPhase.setDescription(request.getDescription());
        }
    }
}
