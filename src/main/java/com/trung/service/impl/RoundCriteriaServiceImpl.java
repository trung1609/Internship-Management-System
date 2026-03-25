package com.trung.service.impl;

import com.trung.domain.entity.AssessmentRound;
import com.trung.domain.entity.EvaluationCriteria;
import com.trung.domain.entity.RoundCriteria;
import com.trung.dto.request.PageRequestDTO;
import com.trung.dto.request.RoundCriterionCreateRequest;
import com.trung.dto.request.RoundCriterionUpdateRequest;
import com.trung.dto.response.ApiResponse;
import com.trung.dto.response.PageResponseDTO;
import com.trung.dto.response.RoundCriterionResponse;
import com.trung.exception.ResourceNotFoundException;
import com.trung.mapper.RoundCriteriaMapper;
import com.trung.repository.IAssessmentRoundsRepository;
import com.trung.repository.IEvaluationCriteriaRepository;
import com.trung.repository.IRoundCriteriaRepository;
import com.trung.service.IRoundCriteriaService;
import com.trung.util.PaginationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RoundCriteriaServiceImpl implements IRoundCriteriaService {
    private final IRoundCriteriaRepository roundCriteriaRepository;
    private final IAssessmentRoundsRepository iAssessmentRoundsRepository;
    private final IEvaluationCriteriaRepository iEvaluationCriteriaRepository;


    @Override
    public PageResponseDTO<RoundCriterionResponse> getAllCriteriaInRound(Long roundId, PageRequestDTO pageRequestDTO) throws ResourceNotFoundException {
        Pageable pageable = PaginationUtil.createPageRequest(pageRequestDTO);
        Page<RoundCriteria> roundCriteriaPage = roundCriteriaPage = roundCriteriaRepository.findAllByRound_RoundId(roundId, pageable);

        return PaginationUtil.toPageResponseDTO(roundCriteriaPage, RoundCriteriaMapper::toDto);
    }

    @Override
    public ApiResponse<RoundCriterionResponse> getCriterionInRoundById(Long roundCriteriaId) throws ResourceNotFoundException {
        RoundCriteria roundCriteria = roundCriteriaRepository.findByRoundCriteriaId(roundCriteriaId)
                .orElseThrow(() -> new ResourceNotFoundException("RoundCriteria not found with id: " + roundCriteriaId));
        return new ApiResponse<>(
                RoundCriteriaMapper.toDto(roundCriteria),
                true,
                "SUCCESS",
                null,
                null);
    }

    @Override
    public ApiResponse<RoundCriterionResponse> createCriterionInRound(RoundCriterionCreateRequest request) throws ResourceNotFoundException {

        AssessmentRound assessmentRound = iAssessmentRoundsRepository.findByRoundIdAndIsDeletedFalse(request.getRoundId())
                .orElseThrow(() -> new ResourceNotFoundException("AssessmentRound not found with id: " + request.getRoundId()));

        EvaluationCriteria evaluationCriteria = iEvaluationCriteriaRepository.findByCriterionIdAndIsDeletedFalse(request.getCriterionId())
                .orElseThrow(() -> new ResourceNotFoundException("EvaluationCriteria not found with id: " + request.getCriterionId()));

        if (roundCriteriaRepository.existsByCriterionAndRound(request.getRoundId(), request.getCriterionId())) {
            throw new ResourceNotFoundException("RoundCriteria already exists with criterion id: " + request.getCriterionId() + " and round id: " + request.getRoundId());
        }

        RoundCriteria roundCriteria = RoundCriteria.builder()
                .round(assessmentRound)
                .criterion(evaluationCriteria)
                .weight(request.getWeight())
                .build();
        roundCriteriaRepository.save(roundCriteria);
        return new ApiResponse<>(
                RoundCriteriaMapper.toDto(roundCriteria),
                true,
                "SUCCESS",
                null,
                null);
    }

    @Override
    public ApiResponse<RoundCriterionResponse> updateWeight(Long roundCriteriaId, RoundCriterionUpdateRequest request) throws ResourceNotFoundException {

        RoundCriteria roundCriteria = roundCriteriaRepository.findByRoundCriteriaId(roundCriteriaId)
                .orElseThrow(() -> new ResourceNotFoundException("RoundCriteria not found with id: " + roundCriteriaId));

        RoundCriteriaMapper.updateFromDto(roundCriteria, request);
        roundCriteriaRepository.save(roundCriteria);

        return new ApiResponse<>(
                RoundCriteriaMapper.toDto(roundCriteria),
                true,
                "SUCCESS",
                null,
                null);
    }

    @Override
    public ApiResponse<String> deleteCriterionInRound(Long roundCriteriaId) throws ResourceNotFoundException {
        RoundCriteria roundCriteria = roundCriteriaRepository.findByRoundCriteriaId(roundCriteriaId)
                .orElseThrow(() -> new ResourceNotFoundException("RoundCriteria not found with id: " + roundCriteriaId));

        roundCriteria.setDeleted(true);
        roundCriteriaRepository.save(roundCriteria);
        return new ApiResponse<>("RoundCriteria deleted successfully",
                true,
                "SUCCESS",
                null,
                null);
    }
}
