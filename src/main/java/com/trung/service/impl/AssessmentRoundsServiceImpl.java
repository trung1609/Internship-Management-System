package com.trung.service.impl;

import com.trung.domain.entity.AssessmentRound;
import com.trung.domain.entity.EvaluationCriteria;
import com.trung.domain.entity.InternshipPhase;
import com.trung.domain.entity.RoundCriteria;
import com.trung.dto.request.*;
import com.trung.dto.response.ApiResponse;
import com.trung.dto.response.AssessmentRoundsResponse;
import com.trung.dto.response.PageResponseDTO;
import com.trung.exception.InvalidDateFormatException;
import com.trung.exception.ResourceBadRequestException;
import com.trung.exception.ResourceConflictException;
import com.trung.exception.ResourceNotFoundException;
import com.trung.mapper.AssessmentRoundsMapper;
import com.trung.repository.IAssessmentRoundsRepository;
import com.trung.repository.IEvaluationCriteriaRepository;
import com.trung.repository.IRoundCriteriaRepository;
import com.trung.repository.InternshipPhaseRepository;
import com.trung.service.IAssessmentRoundsService;
import com.trung.service.IEvaluationCriteriaService;
import com.trung.util.PaginationUtil;
import com.trung.util.ValidationErrorUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AssessmentRoundsServiceImpl implements IAssessmentRoundsService {

    private final IAssessmentRoundsRepository assessmentRoundsRepository;
    private final IRoundCriteriaRepository roundCriteriaRepository;
    private final InternshipPhaseRepository internshipPhaseRepository;
    private final IEvaluationCriteriaRepository iEvaluationCriteriaRepository;


    @Override
    @Transactional
    public ApiResponse<AssessmentRoundsResponse> createAssessmentRound(AssessmentRoundCreateRequest request) throws ResourceNotFoundException, InvalidDateFormatException, ResourceConflictException {
        Map<String, String> errorList = ValidationErrorUtil.createErrorMap();
        InternshipPhase phase = internshipPhaseRepository.findByPhaseIdAndIsDeletedFalse(request.getPhaseId())
                .orElseThrow(() -> new ResourceNotFoundException("Internship phase not found with id: " + request.getPhaseId()));

        AssessmentRound assessmentRounds = AssessmentRoundsMapper.toEntity(request, phase);

        List<RoundCriteria> list = new ArrayList<>();
        Set<Long> uniqueCriterionIds = new HashSet<>();

        for (RoundCriterionCreateRequest req : request.getRoundCriteria()) {
            EvaluationCriteria criteria = iEvaluationCriteriaRepository.findByCriterionIdAndIsDeletedFalse(req.getCriterionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Evaluation criterion not found with id: " + req.getCriterionId()));

            if (!uniqueCriterionIds.add(req.getCriterionId())) {
                ValidationErrorUtil.addError(errorList, "roundCriteria", "Duplicate criterion ID");
            }
            if (ValidationErrorUtil.hasErrors(errorList)) {
                throw new ResourceConflictException("Validation failed", errorList);
            }

            RoundCriteria roundCriteria = RoundCriteria.builder()
                    .round(assessmentRounds)
                    .criterion(criteria)
                    .weight(req.getWeight())
                    .build();
            list.add(roundCriteria);
        }

        assessmentRounds.setRoundCriteriaList(list);
        assessmentRoundsRepository.save(assessmentRounds);


        return new ApiResponse<>(
                AssessmentRoundsMapper.toDto(assessmentRounds),
                true,
                "Assessment round created successfully",
                null,
                LocalDateTime.now()
        );
    }

    @Override
    public PageResponseDTO<AssessmentRoundsResponse> getAllAssessmentRound(String search, Long phaseId, PageRequestDTO pageRequestDTO) {
        Pageable pageable = PaginationUtil.createPageRequest(pageRequestDTO);

        Page<AssessmentRound> assessmentRoundsPage;

        if (search != null && !search.isBlank() && phaseId != null) {
            assessmentRoundsPage = assessmentRoundsRepository.findAllByKeywordAndPhaseId(search, phaseId, pageable);
        } else if (search != null && !search.isBlank()) {
            assessmentRoundsPage = assessmentRoundsRepository.findAllByKeyword(search, pageable);
        } else if (phaseId != null && phaseId != 0) {
            assessmentRoundsPage = assessmentRoundsRepository.findAllByPhase_PhaseId(phaseId, pageable);
        } else {
            assessmentRoundsPage = assessmentRoundsRepository.findAll(pageable);
        }
        return PaginationUtil.toPageResponseDTO(assessmentRoundsPage, AssessmentRoundsMapper::toDto);
    }

    @Override
    public ApiResponse<AssessmentRoundsResponse> getAssessmentRoundById(Long id) throws ResourceNotFoundException {
        AssessmentRound assessmentRound = assessmentRoundsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment round not found with id: " + id));

        return new ApiResponse<>(AssessmentRoundsMapper.toDto(assessmentRound),
                true,
                "Get assessment round with id: " + id + " successfully",
                null,
                LocalDateTime.now());
    }

    @Override
    public ApiResponse<AssessmentRoundsResponse> updateAssessmentRound(Long id, AssessmentRoundUpdateRequest request) throws ResourceNotFoundException, InvalidDateFormatException, ResourceConflictException, ResourceBadRequestException {
        AssessmentRound assessmentRound = assessmentRoundsRepository.findByRoundIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment round not found with id: " + id));

        AssessmentRoundsMapper.updateFromDto(assessmentRound, request);

//        Map<String, String> errorList = ValidationErrorUtil.createErrorMap();
//
//        Set<Long> uniqueCriterionIds = new HashSet<>();
//        if (assessmentRound.getRoundCriteriaList() != null) {
//            for(RoundCriterionUpdateRequest req : request.getCriteria()){
//                RoundCriteria roundCriteria = roundCriteriaRepository.findByRoundIdAndCriterionId(req.getCriterionId(), id)
//                        .orElseThrow(() -> new ResourceNotFoundException("Round criteria not found with id: " + req.getCriterionId()));
//
//                if (!uniqueCriterionIds.add(req.getCriterionId())) {
//                    ValidationErrorUtil.addError(errorList, "roundCriteria", "Duplicate criterion ID");
//                }
//                if (ValidationErrorUtil.hasErrors(errorList)) {
//                    throw new ResourceConflictException("Validation failed", errorList);
//                }
//
//                roundCriteria.setWeight(req.getWeight());
//                roundCriteriaRepository.save(roundCriteria);
//            }
//        }

        assessmentRoundsRepository.save(assessmentRound);
        return new ApiResponse<>(AssessmentRoundsMapper.toDto(assessmentRound),
                true,
                "Update assessment round successfully",
                null,
                LocalDateTime.now());
    }

    @Override
    public ApiResponse<String> deleteAssessmentRound(Long id) throws ResourceNotFoundException {
        AssessmentRound assessmentRound = assessmentRoundsRepository.findByRoundIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment round not found with id: " + id));
        assessmentRound.setDeleted(true);
        assessmentRound.setIsActive(false);
        assessmentRoundsRepository.save(assessmentRound);
        return new ApiResponse<>(
                "Assessment round with id: " + id + " has been deleted successfully",
                true,
                "SUCCESS",
                null,
                LocalDateTime.now()
        );
    }
}
