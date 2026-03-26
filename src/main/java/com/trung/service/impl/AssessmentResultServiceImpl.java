package com.trung.service.impl;

import com.trung.domain.entity.*;
import com.trung.domain.enums.Role;
import com.trung.dto.request.AssessmentResultCreateRequest;
import com.trung.dto.request.AssessmentResultUpdateRequest;
import com.trung.dto.request.CriterionScoreRequest;
import com.trung.dto.request.PageRequestDTO;
import com.trung.dto.response.ApiResponse;
import com.trung.dto.response.AssessmentResultResponse;
import com.trung.dto.response.PageResponseDTO;
import com.trung.exception.ResourceConflictException;
import com.trung.exception.ResourceForbiddenException;
import com.trung.exception.ResourceNotFoundException;
import com.trung.mapper.AssessmentResultMapper;
import com.trung.repository.*;
import com.trung.service.IAssessmentResultService;
import com.trung.util.CurrentUserUtil;
import com.trung.util.PaginationUtil;
import com.trung.util.ValidationErrorUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class AssessmentResultServiceImpl implements IAssessmentResultService {
    private final IAssessmentResultRepository assessmentResultRepository;
    private final InternshipAssignmentRepository internshipAssignmentRepository;
    private final IAssessmentRoundsRepository iAssessmentRoundsRepository;
    private final IEvaluationCriteriaRepository iEvaluationCriteriaRepository;
    private final CurrentUserUtil currentUserUtil;

    @Override
    @Transactional
    public ApiResponse<List<AssessmentResultResponse>> createAssessmentResult(AssessmentResultCreateRequest request) throws ResourceNotFoundException, ResourceForbiddenException, ResourceConflictException {
        Map<String, String> errorList = ValidationErrorUtil.createErrorMap();
        InternshipAssignment assignment = internshipAssignmentRepository.findById(request.getAssignmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Internship assignment not found with id: " + request.getAssignmentId()));

        AssessmentRound round = iAssessmentRoundsRepository.findByRoundIdAndIsDeletedFalse(request.getRoundId())
                .orElseThrow(() -> new ResourceNotFoundException("Assessment round not found with id: " + request.getRoundId()));


        User user = currentUserUtil.getCurrentUser();

        if (!internshipAssignmentRepository.existsByMentor_MentorIdAndAssignmentId(user.getMentor().getMentorId(), assignment.getAssignmentId())){
            errorList.put("assignmentId", "Mentor does not have permission to evaluate this assignment");
            throw new ResourceConflictException("Validation failed", errorList);
        }

//        log.info("Assignment {} has phaseId {}", assignment.getAssignmentId(), assignment.getPhase().getPhaseId());
//        log.info("Round {} has phaseId {}", round.getRoundId(), round.getPhase().getPhaseId());

        if(!assignment.getPhase().getPhaseId().equals(round.getPhase().getPhaseId())){
            errorList.put("roundId", "Round does not belong to the assignment's phase");
            throw new ResourceConflictException("Validation failed", errorList);
        }



        Set<Long> uniqueCriteriaIds = new HashSet<>();
        List<AssessmentResult> assessmentResultList = new ArrayList<>();

        for (CriterionScoreRequest req : request.getResults()){
            EvaluationCriteria criteria = iEvaluationCriteriaRepository.findByCriterionIdAndIsDeletedFalse(req.getCriterionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Evaluation criterion not found with id: " + req.getCriterionId()));

            if (!uniqueCriteriaIds.add(req.getCriterionId())){
                errorList.put("criterionIds", "Has duplicate criterion IDs in the request");
            }

            if (assessmentResultRepository.existsByAssignmentAndRoundAndCriterion(assignment, round, criteria)){
                errorList.put("criterionIds", "Assessment result already exists for criterion id: " + req.getCriterionId());
            }

            if (ValidationErrorUtil.hasErrors(errorList)){
                throw new ResourceConflictException("Validation failed", errorList);
            }

            AssessmentResult assessmentResult = AssessmentResult.builder()
                    .assignment(assignment)
                    .round(round)
                    .criterion(criteria)
                    .score(req.getScore())
                    .comment(req.getComment())
                    .evaluationId(user)
                    .evaluationDate(LocalDateTime.now())
                    .build();

            assessmentResultList.add(assessmentResult);
        }

        assessmentResultRepository.saveAll(assessmentResultList);

        List<AssessmentResultResponse> responses = assessmentResultList.stream()
                .map(AssessmentResultMapper::toDTO)
                .toList();

        return new ApiResponse<>(
                responses,
                true,
                "Assessment results created successfully",
                null,
                LocalDateTime.now()
        );
    }

    @Override
    public PageResponseDTO<AssessmentResultResponse> getAllAssessmentResult(Long assignmentId, PageRequestDTO requestDTO) throws ResourceNotFoundException, ResourceForbiddenException {

        Pageable pageable = PaginationUtil.createPageRequest(requestDTO);
        Page<AssessmentResult> assessmentResultPage;

        User user = currentUserUtil.getCurrentUser();

        if (user.getRole() == Role.ROLE_ADMIN){
            if (assignmentId != null){
                assessmentResultPage = assessmentResultRepository.findAllByAssignment_AssignmentId(assignmentId, pageable);
            }else {
                assessmentResultPage = assessmentResultRepository.findAll(pageable);
            }
        } else if (user.getRole() == Role.ROLE_MENTOR) {
            if (assignmentId != null){
                if (!internshipAssignmentRepository.existsByMentor_MentorIdAndAssignmentId(user.getMentor().getMentorId(), assignmentId)){
                    throw new ResourceForbiddenException("Mentor does not have permission to view assessment results for this assignment");
                }
                assessmentResultPage = assessmentResultRepository.findAllByAssignment_AssignmentIdAndEvaluationId_UserId(assignmentId, user.getUserId(), pageable);
            }else {
                assessmentResultPage = assessmentResultRepository.findAllByEvaluationId_UserId(user.getUserId(), pageable);
            }

        } else if (user.getRole() == Role.ROLE_STUDENT) {
            if (assignmentId != null){
                if (!internshipAssignmentRepository.existsByStudent_StudentIdAndAssignmentId(user.getStudent().getStudentId(), assignmentId)){
                    throw new ResourceForbiddenException("Student does not have permission to view assessment results for this assignment");
                }
                assessmentResultPage = assessmentResultRepository.findAllByAssignment_AssignmentId(assignmentId, pageable);
            }else {
                assessmentResultPage = assessmentResultRepository.findAllByAssignment_Student_StudentId(user.getUserId(), pageable);
            }
        }else {
            throw new ResourceForbiddenException("User does not have permission to view assessment results");
        }

        return PaginationUtil.toPageResponseDTO(assessmentResultPage, AssessmentResultMapper::toDTO);
    }

    @Override
    public ApiResponse<AssessmentResultResponse> updateAssessmentResult(Long id, AssessmentResultUpdateRequest request) throws ResourceNotFoundException, ResourceForbiddenException {
        AssessmentResult assessmentResult = assessmentResultRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment result not found with id: " + id));

        User user = currentUserUtil.getCurrentUser();

        if (!assessmentResultRepository.existsByResultIdAndEvaluationId_UserId(id,user.getUserId())){
            throw new ResourceForbiddenException("You do not have permission to update this assessment result");
        }

        AssessmentResultMapper.updateFromDto(assessmentResult, request);
        assessmentResultRepository.save(assessmentResult);

        return new ApiResponse<>(
                AssessmentResultMapper.toDTO(assessmentResult),
                true,
                "Assessment result updated successfully",
                null,
                LocalDateTime.now()
        );
    }
}
