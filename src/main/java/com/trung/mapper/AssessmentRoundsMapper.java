package com.trung.mapper;

import com.trung.domain.entity.AssessmentRound;
import com.trung.domain.entity.InternshipPhase;
import com.trung.domain.entity.RoundCriteria;
import com.trung.dto.request.AssessmentRoundCreateRequest;
import com.trung.dto.request.AssessmentRoundUpdateRequest;
import com.trung.dto.request.RoundCriterionUpdateRequest;
import com.trung.dto.response.AssessmentRoundsResponse;
import com.trung.dto.response.RoundCriterionResponse;
import com.trung.exception.InvalidDateFormatException;
import com.trung.exception.ResourceBadRequestException;
import com.trung.exception.ResourceConflictException;
import com.trung.exception.ResourceNotFoundException;
import com.trung.util.ValidationErrorUtil;

import java.time.LocalDate;
import java.util.*;

public class AssessmentRoundsMapper {
    public static AssessmentRoundsResponse toDto(AssessmentRound assessmentRounds) {
        return AssessmentRoundsResponse.builder()
                .roundName(assessmentRounds.getRoundName())
                .startDate(assessmentRounds.getStartDate())
                .endDate(assessmentRounds.getEndDate())
                .phaseName(assessmentRounds.getPhase().getPhaseName())
                .description(assessmentRounds.getDescription())
                .roundCriteria(assessmentRounds.getRoundCriteriaList().stream()
                        .map(RoundCriteriaMapper::toDto)
                        .toList())
                .build();
    }

    public static AssessmentRound toEntity(AssessmentRoundCreateRequest request, InternshipPhase phase) throws InvalidDateFormatException {
        String dateFormat = "dd/MM/yyyy";
        LocalDate startDateFormat = ValidationErrorUtil.isValidDate(request.getStartDate(), dateFormat);
        LocalDate endDateFormat = ValidationErrorUtil.isValidDate(request.getEndDate(), dateFormat);
        return AssessmentRound.builder()
                .phase(phase)
                .roundName(request.getRoundName())
                .startDate(startDateFormat)
                .endDate(endDateFormat)
                .description(request.getDescription())
                .build();
    }

    public static void updateFromDto(AssessmentRound assessmentRound, AssessmentRoundUpdateRequest request) throws InvalidDateFormatException, ResourceConflictException, ResourceBadRequestException, ResourceNotFoundException {
        String dateFormat = "dd/MM/yyyy";
        Map<String, String> errorList = ValidationErrorUtil.createErrorMap();
        if (request.getRoundName() != null) {
            assessmentRound.setRoundName(request.getRoundName());
        }
        if (request.getStartDate() != null) {
            LocalDate startDateFormat = ValidationErrorUtil.isValidDate(request.getStartDate(), dateFormat);
            if (startDateFormat.isAfter(assessmentRound.getEndDate())) {
                errorList.put("startDate", "Start date cannot be after end date");
                throw new ResourceBadRequestException("Validation failed", errorList);
            }
            assessmentRound.setStartDate(startDateFormat);
        }
        if (request.getEndDate() != null) {
            LocalDate endDateFormat = ValidationErrorUtil.isValidDate(request.getEndDate(), dateFormat);
            if (endDateFormat.isBefore(assessmentRound.getStartDate())) {
                errorList.put("endDate", "End date cannot be before start date");
                throw new ResourceBadRequestException("Validation failed", errorList);
            }
            assessmentRound.setEndDate(endDateFormat);
        }
        if (request.getDescription() != null) {
            assessmentRound.setDescription(request.getDescription());
        }
        if (request.getIsActive() != null) {
            assessmentRound.setIsActive(request.getIsActive());
        }
        if (request.getCriteria() != null) {
            Set<Long> uniqueCriterionIds = new HashSet<>();
            for (RoundCriterionUpdateRequest req : request.getCriteria()) {
                if (!uniqueCriterionIds.add(req.getCriterionId())) {
                    ValidationErrorUtil.addError(errorList, "roundCriteria", "Duplicate criterion ID");
                    throw new ResourceConflictException("Validation failed", errorList);
                }
                RoundCriteria roundCriteria = assessmentRound.getRoundCriteriaList()
                        .stream()
                        .filter(rc -> rc
                                .getCriterion()
                                .getCriterionId().equals(req.getCriterionId()))
                        .findFirst()
                        .orElseThrow(() -> new ResourceNotFoundException("Round criteria not found with id: " + req.getCriterionId()));
                roundCriteria.setWeight(req.getWeight());
            }
        }
    }

}
