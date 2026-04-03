package com.trung.service.impl;

import com.trung.domain.entity.*;
import com.trung.domain.enums.AssignmentStatus;
import com.trung.domain.enums.Role;
import com.trung.dto.request.InternshipAssignmentCreateRequest;
import com.trung.dto.request.InternshipAssignmentUpdateRequest;
import com.trung.dto.request.PageRequestDTO;
import com.trung.dto.response.ApiResponse;
import com.trung.dto.response.InternshipAssignmentResponse;
import com.trung.dto.response.PageResponseDTO;
import com.trung.exception.ResourceBadRequestException;
import com.trung.exception.ResourceConflictException;
import com.trung.exception.ResourceForbiddenException;
import com.trung.exception.ResourceNotFoundException;
import com.trung.mapper.InternshipAssignmentMapper;
import com.trung.repository.IMentorRepository;
import com.trung.repository.IStudentRepository;
import com.trung.repository.InternshipAssignmentRepository;
import com.trung.repository.InternshipPhaseRepository;
import com.trung.service.InternshipAssignmentService;
import com.trung.util.CurrentUserUtil;
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
public class InternshipAssignmentServiceImpl implements InternshipAssignmentService {
    private final InternshipAssignmentRepository internshipAssignmentRepository;
    private final InternshipPhaseRepository internshipPhaseRepository;
    private final IMentorRepository iMentorRepository;
    private final IStudentRepository iStudentRepository;
    private final CurrentUserUtil currentUserUtil;

    @Override
    @Transactional
    public ApiResponse<List<InternshipAssignmentResponse>> createInternshipAssignment(InternshipAssignmentCreateRequest request) throws ResourceNotFoundException, ResourceConflictException {
        Map<String, String> errorList = ValidationErrorUtil.createErrorMap();
        InternshipPhase phase = internshipPhaseRepository.findByPhaseIdAndIsDeletedFalse(request.getPhaseId())
                .orElseThrow(() -> new ResourceNotFoundException("Internship phase not found with id: " + request.getPhaseId()));

        Mentor mentor = iMentorRepository.findById(request.getMentorId())
                .orElseThrow(() -> new ResourceNotFoundException("Mentor not found with id: " + request.getMentorId()));

        Set<Long> uniqueStudentIds = new HashSet<>(request.getStudentIds());
        if (uniqueStudentIds.size() != request.getStudentIds().size()) {
            errorList.put("studentIds", "Has duplicate student IDs in the request");
            throw new ResourceConflictException("Validation failed", errorList);
        }

        List<Student> studentList = iStudentRepository.findAllById(request.getStudentIds());
        if (studentList.size() != request.getStudentIds().size()) {
            throw new ResourceNotFoundException("One or more students not found with the provided IDs");
        }

        for (Long studentId : request.getStudentIds()) {
            if (internshipAssignmentRepository.existsByStudent_StudentIdAndPhase_PhaseId(studentId, request.getPhaseId())) {
                errorList.put("studentId_" + studentId, "Student with id " + studentId + " is already assigned to this phase");
            }
        }
        if (ValidationErrorUtil.hasErrors(errorList)) {
            throw new ResourceConflictException("Validation failed", errorList);
        }

        List<InternshipAssignmentResponse> responseList = new ArrayList<>();

        for (Student student : studentList) {
            InternshipAssignment internshipAssignment = InternshipAssignmentMapper.toEntity(student, mentor, phase);
            internshipAssignmentRepository.save(internshipAssignment);
            responseList.add(InternshipAssignmentMapper.toDto(internshipAssignment));
        }

        return new ApiResponse<>(
                responseList,
                true,
                "Internship assignments created successfully",
                null,
                LocalDateTime.now());
    }

    @Override
    public PageResponseDTO<InternshipAssignmentResponse> getAllInternshipAssignment(String search, PageRequestDTO pageRequestDTO) throws ResourceNotFoundException, ResourceForbiddenException {
        User user = currentUserUtil.getCurrentUser();

        Pageable pageable = PaginationUtil.createPageRequest(pageRequestDTO, "internshipAssignment");

        Page<InternshipAssignment> internshipAssignmentPage;

        if (user.getRole() == Role.ROLE_ADMIN) {
            internshipAssignmentPage = internshipAssignmentRepository.findAllByKeyword(search, pageable);
        } else if (user.getRole() == Role.ROLE_MENTOR) {
            internshipAssignmentPage = internshipAssignmentRepository.findStudent_StudentIdByMentor_MentorId(search, user.getMentor().getMentorId(), pageable);
        } else if (user.getRole() == Role.ROLE_STUDENT) {
            internshipAssignmentPage = internshipAssignmentRepository.findByStudent_StudentId(search, user.getStudent().getStudentId(), pageable);
        } else {
            throw new ResourceForbiddenException("User does not have permission to access internship assignments");
        }

        return PaginationUtil.toPageResponseDTO(internshipAssignmentPage, InternshipAssignmentMapper::toDto);
    }

    @Override
    public ApiResponse<InternshipAssignmentResponse> getInternshipAssignmentById(Long internshipAssignmentId) throws ResourceNotFoundException, ResourceForbiddenException {
        User user = currentUserUtil.getCurrentUser();

        if (user.getRole() == Role.ROLE_ADMIN) {
            InternshipAssignment internshipAssignment = internshipAssignmentRepository.findById(internshipAssignmentId)
                    .orElseThrow(() -> new ResourceNotFoundException("Internship assignment not found with id: " + internshipAssignmentId));

            return new ApiResponse<>(InternshipAssignmentMapper.toDto(internshipAssignment),
                    true,
                    "Get internshipAssignment by id successfully",
                    null,
                    LocalDateTime.now());
        } else if (user.getRole() == Role.ROLE_MENTOR) {
            InternshipAssignment internshipAssignment = internshipAssignmentRepository.findByAssignmentIdAndMentor_MentorId(internshipAssignmentId, user.getMentor().getMentorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Internship assignment not found with id: " + internshipAssignmentId));

            return new ApiResponse<>(InternshipAssignmentMapper.toDto(internshipAssignment),
                    true,
                    "Get internshipAssignment by id successfully",
                    null,
                    LocalDateTime.now());
        } else if (user.getRole() == Role.ROLE_STUDENT) {
            InternshipAssignment internshipAssignment = internshipAssignmentRepository.findByAssignmentIdAndStudent_StudentId(internshipAssignmentId, user.getStudent().getStudentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Internship assignment not found with id: " + internshipAssignmentId));

            return new ApiResponse<>(InternshipAssignmentMapper.toDto(internshipAssignment),
                    true,
                    "Get internshipAssignment by id successfully",
                    null,
                    LocalDateTime.now());
        } else {
            throw new ResourceForbiddenException("User does not have permission to access internship assignment");
        }
    }

    @Override
    public ApiResponse<InternshipAssignmentResponse> updateInternshipAssignment(Long internshipAssignmentId, InternshipAssignmentUpdateRequest request) throws ResourceNotFoundException, ResourceBadRequestException {
        Map<String, String> errorList = ValidationErrorUtil.createErrorMap();
        InternshipAssignment internshipAssignment = internshipAssignmentRepository.findById(internshipAssignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Internship assignment not found with id: " + internshipAssignmentId));
        try {
            internshipAssignment.setStatus(AssignmentStatus.valueOf(request.getStatus().toUpperCase()));
        } catch (IllegalArgumentException e) {
            ValidationErrorUtil.addError(errorList, "status", "Invalid status value");
            throw new ResourceBadRequestException("Validation failed", errorList);
        }
        internshipAssignmentRepository.save(internshipAssignment);
        return new ApiResponse<>(
                InternshipAssignmentMapper.toDto(internshipAssignment),
                true,
                "Internship assignment updated status successfully",
                null,
                LocalDateTime.now());
    }

}
