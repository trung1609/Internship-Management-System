package com.trung.service;

import com.trung.dto.request.UpdateRoleRequest;
import com.trung.dto.request.UserCreateRequest;
import com.trung.dto.request.PageRequestDTO;
import com.trung.dto.request.UserUpdateRequest;
import com.trung.dto.response.ApiResponse;
import com.trung.dto.response.PageResponseDTO;
import com.trung.dto.response.UserResponse;
import com.trung.exception.ResourceBadRequestException;
import com.trung.exception.ResourceConflictException;
import com.trung.exception.ResourceForbiddenException;
import com.trung.exception.ResourceNotFoundException;

public interface IUserService {
    PageResponseDTO<UserResponse> getAllProfile(String role, PageRequestDTO pageRequestDTO) throws ResourceConflictException, ResourceBadRequestException;
    ApiResponse<UserResponse> getProfileById(Long id) throws ResourceConflictException, ResourceNotFoundException;
    ApiResponse<UserResponse> createProfile(UserCreateRequest userCreateRequest) throws ResourceConflictException, ResourceBadRequestException;
    ApiResponse<UserResponse> updateProfile(Long id, UserUpdateRequest userUpdateRequest) throws ResourceConflictException, ResourceNotFoundException;
    ApiResponse<UserResponse> updateStatus(Long id) throws ResourceConflictException, ResourceNotFoundException;
    ApiResponse<UserResponse> updateRole(Long id, UpdateRoleRequest request) throws ResourceConflictException, ResourceNotFoundException, ResourceForbiddenException, ResourceBadRequestException;
    ApiResponse<String> deleteProfile(Long id) throws ResourceConflictException, ResourceNotFoundException;
}
