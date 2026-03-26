package com.trung.service.impl;

import com.trung.domain.entity.EvaluationCriteria;
import com.trung.dto.request.EvaluationCriteriaCreateRequest;
import com.trung.dto.request.EvaluationCriteriaUpdateRequest;
import com.trung.dto.request.PageRequestDTO;
import com.trung.dto.response.ApiResponse;
import com.trung.dto.response.EvaluationCriteriaResponse;
import com.trung.dto.response.PageResponseDTO;
import com.trung.exception.ResourceConflictException;
import com.trung.exception.ResourceNotFoundException;
import com.trung.mapper.EvaluationCriteriaMapper;
import com.trung.repository.IEvaluationCriteriaRepository;
import com.trung.service.IEvaluationCriteriaService;
import com.trung.util.PaginationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EvaluationCriteriaServiceImpl implements IEvaluationCriteriaService {
    private final IEvaluationCriteriaRepository evaluationCriteriaRepository;

    @Override
    public ApiResponse<EvaluationCriteriaResponse> createCriteria(EvaluationCriteriaCreateRequest request) {
        EvaluationCriteria evaluationCriteria = EvaluationCriteriaMapper.toEntity(request);

        evaluationCriteriaRepository.save(evaluationCriteria);

        return new ApiResponse<>(
                EvaluationCriteriaMapper.toDTO(evaluationCriteria),
                true,
                "Created evaluation criteria successfully",
                null,
                LocalDateTime.now()
        );
    }

    @Override
    public PageResponseDTO<EvaluationCriteriaResponse> getAllCriteria(String search, PageRequestDTO pageRequestDTO) {
        Pageable pageable = PaginationUtil.createPageRequest(pageRequestDTO);

        Page<EvaluationCriteria> evaluationCriteriaPage;

        if (search != null && !search.isBlank()) {
            evaluationCriteriaPage = evaluationCriteriaRepository.findAllByKeyword(pageable, search);
        } else {
            evaluationCriteriaPage = evaluationCriteriaRepository.findAll(pageable);
        }

        return PaginationUtil.toPageResponseDTO(evaluationCriteriaPage, EvaluationCriteriaMapper::toDTO);
    }

    @Override
    public ApiResponse<EvaluationCriteriaResponse> getCriteriaById(Long id) throws ResourceNotFoundException {
        EvaluationCriteria evaluationCriteria = evaluationCriteriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evaluation criteria not found with id: " + id));

        return new ApiResponse<>(
                EvaluationCriteriaMapper.toDTO(evaluationCriteria),
                true,
                "Get evaluation criteria successfully",
                null,
                LocalDateTime.now()
        );
    }

    @Override
    public ApiResponse<EvaluationCriteriaResponse> updateCriteria(Long id, EvaluationCriteriaUpdateRequest request) throws ResourceNotFoundException, ResourceConflictException {
        Map<String, String> errors = new HashMap<>();
        EvaluationCriteria existingCriteria = evaluationCriteriaRepository.findByCriterionIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evaluation criteria not found with id: " + id));

        if (evaluationCriteriaRepository.existsByCriterionNameIgnoreCaseAndIsDeletedFalseAndCriterionIdNot(request.getCriterionName(), id)) {
            errors.put("criterionName", "Evaluation criteria name already exists");
        }
        if (!errors.isEmpty()) {
            throw new ResourceConflictException("Validation failed", errors);
        }

        EvaluationCriteriaMapper.updateFromDto(existingCriteria, request);
        evaluationCriteriaRepository.save(existingCriteria);
        return new ApiResponse<>(
                EvaluationCriteriaMapper.toDTO(existingCriteria),
                true,
                "Updated evaluation criteria successfully",
                null,
                LocalDateTime.now());
    }

    @Override
    public ApiResponse<String> deleteCriteria(Long id) throws ResourceNotFoundException {
        EvaluationCriteria existingCriteria = evaluationCriteriaRepository.findByCriterionIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evaluation criteria not found with id: " + id));

        existingCriteria.setDeleted(true);
        evaluationCriteriaRepository.save(existingCriteria);
        return new ApiResponse<>("Evaluation criteria deleted successfully",
                true,
                "SUCCESS",
                null,
                LocalDateTime.now());
    }
}
