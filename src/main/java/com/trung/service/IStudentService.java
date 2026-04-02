package com.trung.service;

import com.trung.dto.request.PageRequestDTO;
import com.trung.dto.request.StudentCreateRequest;
import com.trung.dto.request.StudentUpdateRequest;
import com.trung.dto.request.UpdateRoleRequest;
import com.trung.dto.response.ApiResponse;
import com.trung.dto.response.PageResponseDTO;
import com.trung.dto.response.StudentResponse;
import com.trung.exception.*;

public interface IStudentService {
    ApiResponse<StudentResponse> createStudent(StudentCreateRequest request) throws ResourceConflictException, ResourceNotFoundException, ResourceBadRequestException, InvalidDateFormatException, ResourceForbiddenException;
    PageResponseDTO<StudentResponse> getAllStudent(PageRequestDTO pageRequestDTO) throws ResourceNotFoundException, ResourceForbiddenException;
    ApiResponse<StudentResponse> getStudentById(Long id) throws ResourceNotFoundException, ResourceForbiddenException;
    ApiResponse<StudentResponse> updateStudent(Long id, StudentUpdateRequest request) throws ResourceNotFoundException, ResourceBadRequestException, ResourceForbiddenException, ResourceConflictException, InvalidDateFormatException;
}
