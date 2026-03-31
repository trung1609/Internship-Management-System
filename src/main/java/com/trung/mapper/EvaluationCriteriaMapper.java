package com.trung.mapper;

import com.trung.domain.entity.EvaluationCriteria;
import com.trung.dto.request.EvaluationCriteriaCreateRequest;
import com.trung.dto.request.EvaluationCriteriaUpdateRequest;
import com.trung.dto.response.EvaluationCriteriaResponse;

public class EvaluationCriteriaMapper {
    public static EvaluationCriteriaResponse toDTO(EvaluationCriteria entity) {
        return EvaluationCriteriaResponse.builder()
                .criterionName(entity.getCriterionName())
                .description(entity.getDescription())
                .maxScore(entity.getMaxScore())
                .build();
    }

    public static EvaluationCriteria toEntity(EvaluationCriteriaCreateRequest dto) {
        return EvaluationCriteria.builder()
                .criterionName(dto.getCriterionName())
                .description(dto.getDescription())
                .maxScore(dto.getMaxScore())
                .build();
    }

    public static void updateFromDto(EvaluationCriteria entity, EvaluationCriteriaUpdateRequest dto) {
        if (dto.getCriterionName() != null) {
            entity.setCriterionName(dto.getCriterionName());
        }
        if (dto.getDescription() != null) {
            entity.setDescription(dto.getDescription());
        }
        if (dto.getMaxScore() != null) {
            entity.setMaxScore(dto.getMaxScore());
        }
    }
}
