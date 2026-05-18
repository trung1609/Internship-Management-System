package com.trung.mapper;

import com.trung.entity.AssessmentRound;
import com.trung.entity.EvaluationCriteria;
import com.trung.entity.RoundCriteria;
import com.trung.dto.request.RoundCriterionCreateRequest;
import com.trung.dto.request.RoundCriterionUpdateRequest;
import com.trung.dto.response.RoundCriterionResponse;

public class RoundCriteriaMapper {
    public static RoundCriterionResponse toDto(RoundCriteria rc) {
        return RoundCriterionResponse.builder()
                .criterionName(rc.getCriterion().getCriterionName())
                .weight(rc.getWeight())
                .maxScore(rc.getCriterion().getMaxScore())
                .roundName(rc.getRound().getRoundName())
                .isDeleted(rc.isDeleted())
                .build();
    }

    public static RoundCriteria toEntity(RoundCriterionCreateRequest request, AssessmentRound assessmentRound, EvaluationCriteria evaluationCriteria) {
        return RoundCriteria.builder()
                .round(assessmentRound)
                .criterion(evaluationCriteria)
                .weight(request.getWeight())
                .build();
    }

    public static void updateFromDto(RoundCriteria rc, RoundCriterionUpdateRequest request) {
        if (request.getWeight() != null) {
            rc.setWeight(request.getWeight());
        }
    }
}
