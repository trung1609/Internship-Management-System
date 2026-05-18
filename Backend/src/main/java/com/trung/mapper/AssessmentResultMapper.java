package com.trung.mapper;

import com.trung.entity.AssessmentResult;
import com.trung.dto.request.AssessmentResultUpdateRequest;
import com.trung.dto.response.AssessmentResultResponse;

public class AssessmentResultMapper {
    public static AssessmentResultResponse toDTO(AssessmentResult entity) {
        return AssessmentResultResponse.builder()
                .assignmentId(entity.getAssignment().getAssignmentId())
                .assignmentName(entity.getAssignment().getPhase().getPhaseName())
                .roundId(entity.getRound().getRoundId())
                .roundName(entity.getRound().getRoundName())
                .criterionId(entity.getCriterion().getCriterionId())
                .criterionName(entity.getCriterion().getCriterionName())
                .score(entity.getScore())
                .comments(entity.getComment())
                .evaluatorId(entity.getEvaluationId().getUserId())
                .evaluatorName(entity.getEvaluationId().getFullName())
                .evaluationDate(entity.getEvaluationDate())
                .build();
    }

    public static void updateFromDto(AssessmentResult entity, AssessmentResultUpdateRequest dto) {
        if (dto.getScore() != null) {
            entity.setScore(dto.getScore());
        }
        if (dto.getComment() != null) {
            entity.setComment(dto.getComment());
        }
    }
}
