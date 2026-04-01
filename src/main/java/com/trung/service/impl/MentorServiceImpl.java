package com.trung.service.impl;

import com.trung.domain.entity.Mentor;
import com.trung.domain.entity.User;
import com.trung.domain.enums.Role;
import com.trung.dto.request.MentorCreateRequest;
import com.trung.dto.request.MentorUpdateRequest;
import com.trung.dto.request.PageRequestDTO;
import com.trung.dto.response.ApiResponse;
import com.trung.dto.response.MentorResponse;
import com.trung.dto.response.PageResponseDTO;
import com.trung.exception.ResourceBadRequestException;
import com.trung.exception.ResourceConflictException;
import com.trung.exception.ResourceForbiddenException;
import com.trung.exception.ResourceNotFoundException;
import com.trung.mapper.MentorMapper;
import com.trung.repository.IMentorRepository;
import com.trung.repository.IUserRepository;
import com.trung.service.IMentorService;
import com.trung.util.CurrentUserUtil;
import com.trung.util.PaginationUtil;
import com.trung.util.ValidationErrorUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MentorServiceImpl implements IMentorService {
    private final IMentorRepository mentorRepository;
    private final IUserRepository iUserRepository;
    private final CurrentUserUtil currentUserUtil;

    @Override
    public PageResponseDTO<Object> getAllMentor(PageRequestDTO pageRequestDTO) throws ResourceNotFoundException, ResourceForbiddenException {
        User user = currentUserUtil.getCurrentUser();

        Page<Mentor> mentorPage;
        if (user.getRole() == Role.ROLE_ADMIN) {
            Pageable pageable = PaginationUtil.createPageRequest(pageRequestDTO, "mentor");
            mentorPage = mentorRepository.findAll(pageable);
            return PaginationUtil.toPageResponseDTO(mentorPage, MentorMapper::toDto);
        } else if (user.getRole() == Role.ROLE_STUDENT) {
            Pageable pageable = PaginationUtil.createPageRequest(pageRequestDTO, "mentor");
            mentorPage = mentorRepository.findAll(pageable);
            return PaginationUtil.toPageResponseDTO(mentorPage, MentorMapper::toPublicDto);
        } else {
            throw new ResourceForbiddenException("User role not supported for this operation");
        }
    }

    @Override
    public ApiResponse<Object> getMentorById(Long id) throws ResourceNotFoundException, ResourceForbiddenException {
        User user = currentUserUtil.getCurrentUser();

        if (user.getRole() == Role.ROLE_ADMIN) {
            Mentor mentor = mentorRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Mentor not found with id: " + id));

            return new ApiResponse<>(MentorMapper.toDto(mentor), true, "SUCCESS", null, null);
        } else if (user.getRole() == Role.ROLE_STUDENT) {
            Mentor mentor = mentorRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Mentor not found with id: " + id));

            return new ApiResponse<>(MentorMapper.toPublicDto(mentor), true, "SUCCESS", null, null);
        } else if (user.getRole() == Role.ROLE_MENTOR) {
            Mentor mentor = mentorRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Mentor not found with id: " + id));
            if (!mentor.getUser().getUserId().equals(user.getUserId())) {
                throw new ResourceForbiddenException("You cannot view other mentor's information");
            }
            return new ApiResponse<>(MentorMapper.toDto(mentor), true, "SUCCESS", null, null);
        } else {
            throw new ResourceForbiddenException("User role not supported for this operation");
        }
    }

    @Override
    public ApiResponse<MentorResponse> createMentor(MentorCreateRequest request) throws ResourceNotFoundException, ResourceForbiddenException, ResourceBadRequestException, ResourceConflictException {
        Map<String, String> errorList = ValidationErrorUtil.createErrorMap();

        User user = iUserRepository.findByUserIdAndIsDeletedFalseAndIsActiveTrue(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        if (user.getRole() != Role.ROLE_MENTOR) {
            errorList.put("userId", "User with id " + request.getUserId() + " does not have the MENTOR role");
            throw new ResourceBadRequestException("User role is not MENTOR", errorList);
        }

        if (mentorRepository.existsById(request.getUserId())) {
            errorList.put("userId", "Mentor with this user ID already exists");
            throw new ResourceConflictException("Validation failed", errorList);
        }

        Mentor mentor = Mentor.builder()
                .user(user)
                .academicRank(request.getAcademicRank())
                .department(request.getDepartment())
                .build();
        mentor = mentorRepository.save(mentor);
        return new ApiResponse<>(
                MentorMapper.toDto(mentor),
                true,
                "SUCCESS",
                null,
                LocalDateTime.now());
    }

    @Override
    public ApiResponse<MentorResponse> updateMentor(Long id, MentorUpdateRequest request) throws ResourceNotFoundException, ResourceForbiddenException, ResourceBadRequestException, ResourceConflictException {
        Map<String, String> errorList = ValidationErrorUtil.createErrorMap();
        User currentUser = currentUserUtil.getCurrentUser();

        if (currentUser.getRole() == Role.ROLE_ADMIN){
            Mentor existingMentor = mentorRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Mentor not found with id: " + id));

            if (iUserRepository.existsByEmailAndIsDeletedFalseAndIsActiveTrueAndUserIdNot(request.getEmail(), existingMentor.getUser().getUserId())) {
                errorList.put("email", "Email already exists");
                throw new ResourceConflictException("Validation failed", errorList);
            }

            MentorMapper.updateFromDto(existingMentor, request);
            existingMentor = mentorRepository.save(existingMentor);
            return new ApiResponse<>(
                    MentorMapper.toDto(existingMentor),
                    true,
                    "Mentor updated successfully",
                    null,
                    LocalDateTime.now());
        } else if (currentUser.getRole() == Role.ROLE_MENTOR) {
            Mentor existingMentor = mentorRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Mentor not found with id: " + id));

            if (!existingMentor.getUser().getUserId().equals(currentUser.getUserId())) {
                throw new ResourceForbiddenException("You cannot update other mentor's information");
            }

            if (iUserRepository.existsByEmailAndIsDeletedFalseAndIsActiveTrueAndUserIdNot(request.getEmail(), existingMentor.getUser().getUserId())) {
                errorList.put("email", "Email already exists");
                throw new ResourceConflictException("Validation failed", errorList);
            }

            MentorMapper.updateFromDto(existingMentor, request);
            existingMentor = mentorRepository.save(existingMentor);
            return new ApiResponse<>(
                    MentorMapper.toDto(existingMentor),
                    true,
                    "Mentor updated successfully",
                    null,
                    LocalDateTime.now());
        }else {
            throw new ResourceForbiddenException("User role not supported for this operation");
        }
    }


}
