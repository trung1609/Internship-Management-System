package com.trung.service;

import com.trung.dto.request.PageRequestDTO;
import com.trung.dto.request.StudentCreateRequest;
import com.trung.dto.request.StudentUpdateRequest;
import com.trung.dto.response.ApiResponse;
import com.trung.dto.response.PageResponseDTO;
import com.trung.dto.response.StudentResponse;
import com.trung.exception.ResourceBadRequestException;
import com.trung.exception.ResourceConflictException;
import com.trung.exception.ResourceForbiddenException;
import com.trung.exception.ResourceNotFoundException;

public interface IStudentService {
    ApiResponse<StudentResponse> createStudent(StudentCreateRequest request) throws ResourceConflictException, ResourceNotFoundException, ResourceBadRequestException, ResourceForbiddenException;
    PageResponseDTO<StudentResponse> getAllStudent(PageRequestDTO pageRequestDTO) throws ResourceNotFoundException, ResourceForbiddenException;
    ApiResponse<StudentResponse> getCurrentStudentInfo() throws ResourceNotFoundException, ResourceForbiddenException;
    ApiResponse<StudentResponse> getStudentById(Long id) throws ResourceNotFoundException, ResourceForbiddenException;
    ApiResponse<StudentResponse> updateStudent(Long id, StudentUpdateRequest request) throws ResourceNotFoundException, ResourceBadRequestException, ResourceForbiddenException, ResourceConflictException;
}
