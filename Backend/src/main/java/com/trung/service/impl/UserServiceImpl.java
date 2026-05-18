package com.trung.service.impl;

import com.trung.entity.User;
import com.trung.util.enums.Role;
import com.trung.dto.request.PageRequestDTO;
import com.trung.dto.request.UpdateRoleRequest;
import com.trung.dto.request.UserCreateRequest;
import com.trung.dto.request.UserUpdateRequest;
import com.trung.dto.response.ApiResponse;
import com.trung.dto.response.PageResponseDTO;
import com.trung.dto.response.UserResponse;
import com.trung.exception.ResourceBadRequestException;
import com.trung.exception.ResourceConflictException;
import com.trung.exception.ResourceForbiddenException;
import com.trung.exception.ResourceNotFoundException;
import com.trung.mapper.UserMapper;
import com.trung.repository.IUserRepository;
import com.trung.service.IUserService;
import com.trung.util.PaginationUtil;
import com.trung.util.ValidationErrorUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements IUserService {
    private final IUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public PageResponseDTO<UserResponse> getAllProfile(String role, PageRequestDTO pageRequestDTO) throws ResourceBadRequestException {

        Map<String, String> errorList = ValidationErrorUtil.createErrorMap();
        Pageable pageable = PaginationUtil.createPageRequest(pageRequestDTO, "user");

        Page<User> usersPage;
        Role roleEnum = null;
        if (role != null && !role.isBlank()) {
            try {
                roleEnum = Role.valueOf(role.toUpperCase());
            } catch (IllegalArgumentException e) {
                ValidationErrorUtil.addError(errorList, "role", "Invalid role value");
                throw new ResourceBadRequestException("BAD_REQUEST", errorList);
            }
        }

        if (roleEnum != null) {
            usersPage = userRepository.findByRoleAndIsDeletedFalseAndIsActiveTrue(Role.valueOf(role.toUpperCase()), pageable);
        } else {
            usersPage = userRepository.findAllByIsDeletedFalseAndIsActiveTrue(pageable);
        }

        return PaginationUtil.toPageResponseDTO(usersPage, UserMapper::toDto);
    }

    @Override
    public ApiResponse<UserResponse> getProfileById(Long id) throws ResourceNotFoundException {
        User users = userRepository.findByUserIdAndIsDeletedFalseAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return new ApiResponse<>(UserMapper.toDto(users), true, "SUCCESS", null, null);
    }

    @Override
    public ApiResponse<UserResponse> createProfile(UserCreateRequest userCreateRequest) throws ResourceBadRequestException, ResourceConflictException {
        Role roleEnum = null;
        Map<String, String> errorList = ValidationErrorUtil.createErrorMap();

        if (userRepository.existsByUsernameAndIsDeletedFalseAndIsActiveTrue(userCreateRequest.getUsername())) {
            ValidationErrorUtil.addError(errorList, "username", "Username already exists");
        }

        if (userRepository.existsByEmailAndIsDeletedFalseAndIsActiveTrue(userCreateRequest.getEmail())) {
            ValidationErrorUtil.addError(errorList, "email", "Email already exists");
        }

        if (ValidationErrorUtil.hasErrors(errorList)) {
            throw new ResourceConflictException("CONFLICT", errorList);
        }

        try {
            roleEnum = Role.valueOf(userCreateRequest.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            ValidationErrorUtil.addError(errorList, "role", "Invalid role value");
            throw new ResourceBadRequestException("BAD_REQUEST", errorList);
        }

        User users = new User();

        users.setUsername(userCreateRequest.getUsername());
        users.setPassword(passwordEncoder.encode(userCreateRequest.getPassword()));
        users.setFullName(userCreateRequest.getFullName());
        users.setEmail(userCreateRequest.getEmail());
        users.setPhoneNumber(userCreateRequest.getPhoneNumber());
        users.setRole(roleEnum);

        userRepository.save(users);

        return new ApiResponse<>(UserMapper.toDto(users), true, "SUCCESS", null, LocalDateTime.now());
    }

    @Override
    public ApiResponse<UserResponse> updateProfile(Long id, UserUpdateRequest userUpdateRequest) throws ResourceConflictException, ResourceNotFoundException {
        Map<String, String> errorList = ValidationErrorUtil.createErrorMap();
        User existingUser = userRepository.findByUserIdAndIsDeletedFalseAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        if (userRepository.existsByUsernameAndIsDeletedFalseAndIsActiveTrueAndUserIdNot(userUpdateRequest.getUsername(), id)) {
            errorList.put("username", "Username already exists");
        }

        if (userRepository.existsByEmailAndIsDeletedFalseAndIsActiveTrueAndUserIdNot(userUpdateRequest.getEmail(), id)) {
            errorList.put("email", "Email already exists");
        }
        if (ValidationErrorUtil.hasErrors(errorList)) {
            throw new ResourceConflictException("CONFLICT", errorList);
        }
        UserMapper.updateFromDto(existingUser, userUpdateRequest);
        userRepository.save(existingUser);
        return new ApiResponse<>(UserMapper.toDto(existingUser), true, "SUCCESS", null, LocalDateTime.now());
    }

    @Override
    public ApiResponse<UserResponse> updateStatus(Long id) throws ResourceNotFoundException {
        User users = userRepository.findByUserIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        users.setActive(!users.isActive());
        userRepository.save(users);
        return new ApiResponse<>(UserMapper.toDto(users), true, "SUCCESS", null, LocalDateTime.now());
    }

    @Override
    public ApiResponse<UserResponse> updateRole(Long id, UpdateRoleRequest request) throws ResourceNotFoundException, ResourceForbiddenException, ResourceBadRequestException {
        Map<String, String> errorList = ValidationErrorUtil.createErrorMap();
        User users = userRepository.findByUserIdAndIsDeletedFalseAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (users.getRole() == Role.ROLE_ADMIN) {
            throw new ResourceForbiddenException("Cannot change role of an admin user");
        }
        try {
            users.setRole(Role.valueOf(request.getRole().toUpperCase()));
        } catch (IllegalArgumentException e) {
            errorList.put("role", "Invalid role value");
            throw new ResourceBadRequestException("BAD_REQUEST", errorList);
        }
        userRepository.save(users);
        return new ApiResponse<>(UserMapper.toDto(users), true, "SUCCESS", null, LocalDateTime.now());
    }

    @Override
    public ApiResponse<String> deleteProfile(Long id) throws ResourceNotFoundException {
        User users = userRepository.findByUserIdAndIsDeletedFalseAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        users.setDeleted(true);
        users.setActive(false);
        userRepository.save(users);
        return new ApiResponse<>("User deleted successfully", true, "SUCCESS", null, LocalDateTime.now());
    }
}
