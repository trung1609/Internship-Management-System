package com.trung.mapper;

import com.trung.entity.AssessmentRound;
import com.trung.entity.InternshipPhase;
import com.trung.entity.RoundCriteria;
import com.trung.dto.request.AssessmentRoundCreateRequest;
import com.trung.dto.request.AssessmentRoundUpdateRequest;
import com.trung.dto.request.RoundCriterionUpdateRequest;
import com.trung.dto.response.AssessmentRoundsResponse;
import com.trung.exception.ResourceBadRequestException;
import com.trung.exception.ResourceConflictException;
import com.trung.exception.ResourceNotFoundException;
import com.trung.util.ValidationErrorUtil;

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
                .isDeleted(assessmentRounds.isDeleted())
                .build();
    }

    public static AssessmentRound toEntity(AssessmentRoundCreateRequest request, InternshipPhase phase) {
        return AssessmentRound.builder()
                .phase(phase)
                .roundName(request.getRoundName())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .description(request.getDescription())
                .build();
    }

    public static void updateFromDto(AssessmentRound assessmentRound, AssessmentRoundUpdateRequest request) throws ResourceConflictException, ResourceBadRequestException, ResourceNotFoundException {
        Map<String, String> errorList = ValidationErrorUtil.createErrorMap();
        if (request.getRoundName() != null) {
            assessmentRound.setRoundName(request.getRoundName());
        }
        if (request.getStartDate() != null) {
            if (request.getStartDate().isAfter(assessmentRound.getEndDate())) {
                errorList.put("startDate", "Start date cannot be after end date");
                throw new ResourceBadRequestException("Validation failed", errorList);
            }
            assessmentRound.setStartDate(request.getStartDate());
        }
        if (request.getEndDate() != null) {
            if (request.getEndDate().isBefore(assessmentRound.getStartDate())) {
                errorList.put("endDate", "End date cannot be before start date");
                throw new ResourceBadRequestException("Validation failed", errorList);
            }
            assessmentRound.setEndDate(request.getEndDate());
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
