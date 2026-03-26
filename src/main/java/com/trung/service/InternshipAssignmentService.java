package com.trung.service;

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

import java.util.List;

public interface InternshipAssignmentService {
    ApiResponse<List<InternshipAssignmentResponse>> createInternshipAssignment(InternshipAssignmentCreateRequest request) throws ResourceNotFoundException, ResourceConflictException;
    PageResponseDTO<InternshipAssignmentResponse> getAllInternshipAssignment(String search, PageRequestDTO pageRequestDTO) throws ResourceNotFoundException, ResourceForbiddenException;
    ApiResponse<InternshipAssignmentResponse> getInternshipAssignmentById(Long internshipAssignmentId) throws ResourceNotFoundException, ResourceForbiddenException;
    ApiResponse<InternshipAssignmentResponse> updateInternshipAssignment(Long internshipAssignmentId, InternshipAssignmentUpdateRequest request) throws ResourceNotFoundException, ResourceBadRequestException;
    ApiResponse<String> deleteInternshipAssignment(Long id);
}
