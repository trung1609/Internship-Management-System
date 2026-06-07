package com.trung.mapper;

import com.trung.entity.AssessmentResult;
import com.trung.dto.request.AssessmentResultUpdateRequest;
import com.trung.dto.response.AssessmentResultResponse;

public class AssessmentResultMapper {
    public static AssessmentResultResponse toDTO(AssessmentResult entity) {
        return AssessmentResultResponse.builder()
                .id(entity.getResultId())
                .assignmentId(entity.getAssignment().getAssignmentId())
                .assignmentName(entity.getAssignment().getAssignmentTitle())

                // Map thông tin sinh viên
                .studentId(entity.getStudent().getStudentId())
                .studentName(entity.getStudent().getUser().getFullName())
                .studentCode(entity.getStudent().getStudentCode())

                .roundId(entity.getRound().getRoundId())
                .roundName(entity.getRound().getRoundName())

                // Map tiêu chí đánh giá
                .criterionId(entity.getCriterion().getCriterionId())
                .criterionName(entity.getCriterion().getCriterionName())

                .score(entity.getScore())
                .contribution(entity.getContribution())
                .comments(entity.getComment()) // Nhớ lấy đúng trường comment trong entity
                .evaluatorId(entity.getEvaluationId().getUserId())
                .evaluatorName(entity.getEvaluationId().getFullName())
                .evaluationDate(entity.getEvaluationDate())
                .build();
    }

    public static void updateFromDto(AssessmentResult entity, AssessmentResultUpdateRequest dto) {
        if (dto.getScore() != null) {
            entity.setScore(dto.getScore());
        }
        if (dto.getComments() != null) {
            entity.setComment(dto.getComments());
        }
    }
}
