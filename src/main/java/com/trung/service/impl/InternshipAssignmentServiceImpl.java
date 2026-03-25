package com.trung.service.impl;

import com.trung.domain.entity.*;
import com.trung.domain.enums.Role;
import com.trung.dto.request.InternshipAssignmentCreateRequest;
import com.trung.dto.request.InternshipAssignmentUpdateRequest;
import com.trung.dto.request.PageRequestDTO;
import com.trung.dto.response.ApiResponse;
import com.trung.dto.response.InternshipAssignmentResponse;
import com.trung.dto.response.PageResponseDTO;
import com.trung.exception.ResourceConflictException;
import com.trung.exception.ResourceForbiddenException;
import com.trung.exception.ResourceNotFoundException;
import com.trung.mapper.InternshipAssignmentMapper;
import com.trung.repository.*;
import com.trung.service.InternshipAssignmentService;
import com.trung.util.PaginationUtil;
import com.trung.util.ValidationErrorUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.support.PageableUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private final IUserRepository iUserRepository;


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


        List<InternshipAssignmentResponse> responseList = new ArrayList<>();


        for (Long studentId : request.getStudentIds()) {
            Student student = iStudentRepository.findById(studentId).orElseThrow(
                    () -> new ResourceNotFoundException("Student not found with id: " + studentId));

            if (internshipAssignmentRepository.existsByStudent_StudentIdAndPhase_PhaseId(studentId, request.getPhaseId())) {
                errorList.put("studentId_" + studentId, "Student with id " + studentId + " is already assigned to this phase");
                continue;
            }

            InternshipAssignment internshipAssignment = InternshipAssignmentMapper.toEntity(student, mentor, phase);
            internshipAssignmentRepository.save(internshipAssignment);
            responseList.add(InternshipAssignmentMapper.toDto(internshipAssignment));
        }

        if (ValidationErrorUtil.hasErrors(errorList)) {
            throw new ResourceConflictException("Validation failed", errorList);
        }
        return new ApiResponse<>(responseList,
                true,
                "Internship assignments created successfully",
                null,
                LocalDateTime.now());
    }

    @Override
    public PageResponseDTO<InternshipAssignmentResponse> getAllInternshipAssignment(PageRequestDTO pageRequestDTO) throws ResourceNotFoundException, ResourceForbiddenException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = iUserRepository.findByUsernameAndIsDeletedFalseAndIsActiveTrue(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        Pageable pageable = PaginationUtil.createPageRequest(pageRequestDTO);

        Page<InternshipAssignment> internshipAssignmentPage;

        if (user.getRole() == Role.ROLE_ADMIN) {
            internshipAssignmentPage = internshipAssignmentRepository.findAll(pageable);
        }else if (user.getRole() == Role.ROLE_MENTOR) {
            internshipAssignmentPage = internshipAssignmentRepository.findStudent_StudentIdByMentor_MentorId(user.getMentor().getMentorId(), pageable);
        } else if (user.getRole() == Role.ROLE_STUDENT) {
            internshipAssignmentPage = internshipAssignmentRepository.findByStudent_StudentId(user.getStudent().getStudentId(), pageable);
        } else {
            throw new ResourceForbiddenException("User does not have permission to access internship assignments");
        }

        return PaginationUtil.toPageResponseDTO(internshipAssignmentPage, InternshipAssignmentMapper::toDto);
    }

    @Override
    public ApiResponse<InternshipAssignmentResponse> getInternshipAssignmentById(Long internshipAssignmentId) {
        return null;
    }

    @Override
    public ApiResponse<InternshipAssignmentResponse> updateInternshipAssignment(Long internshipAssignmentId, InternshipAssignmentUpdateRequest request) {
        return null;
    }

    @Override
    public ApiResponse<String> deleteInternshipAssignment(Long id) {
        return null;
    }
}
