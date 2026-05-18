package com.trung.service;

import com.trung.dto.request.AssessmentResultCreateRequest;
import com.trung.dto.request.AssessmentResultUpdateRequest;
import com.trung.dto.request.PageRequestDTO;
import com.trung.dto.response.ApiResponse;
import com.trung.dto.response.AssessmentResultResponse;
import com.trung.dto.response.PageResponseDTO;
import com.trung.exception.ResourceConflictException;
import com.trung.exception.ResourceForbiddenException;
import com.trung.exception.ResourceNotFoundException;

import java.util.List;

public interface IAssessmentResultService {
    ApiResponse<List<AssessmentResultResponse>> createAssessmentResult(AssessmentResultCreateRequest request) throws ResourceNotFoundException, ResourceForbiddenException, ResourceConflictException;
    PageResponseDTO<AssessmentResultResponse> getAllAssessmentResult(Long assignmentId ,PageRequestDTO requestDTO) throws ResourceNotFoundException, ResourceForbiddenException;
    ApiResponse<AssessmentResultResponse> updateAssessmentResult(Long id, AssessmentResultUpdateRequest request) throws ResourceNotFoundException, ResourceForbiddenException;
}
