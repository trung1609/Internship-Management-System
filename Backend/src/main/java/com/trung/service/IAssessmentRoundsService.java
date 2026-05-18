package com.trung.service;

import com.trung.dto.request.AssessmentRoundCreateRequest;
import com.trung.dto.request.AssessmentRoundUpdateRequest;
import com.trung.dto.request.PageRequestDTO;
import com.trung.dto.response.ApiResponse;
import com.trung.dto.response.AssessmentRoundsResponse;
import com.trung.dto.response.PageResponseDTO;
import com.trung.exception.ResourceBadRequestException;
import com.trung.exception.ResourceConflictException;
import com.trung.exception.ResourceNotFoundException;

public interface IAssessmentRoundsService {
    ApiResponse<AssessmentRoundsResponse> createAssessmentRound(AssessmentRoundCreateRequest request) throws ResourceNotFoundException, ResourceConflictException;
    PageResponseDTO<AssessmentRoundsResponse> getAllAssessmentRound(String search,Long phaseId,  PageRequestDTO pageRequestDTO);
    ApiResponse<AssessmentRoundsResponse> getAssessmentRoundById(Long id) throws ResourceNotFoundException;
     ApiResponse<AssessmentRoundsResponse> updateAssessmentRound(Long id, AssessmentRoundUpdateRequest request) throws ResourceNotFoundException, ResourceConflictException, ResourceBadRequestException;
     ApiResponse<String> deleteAssessmentRound(Long id) throws ResourceNotFoundException;
}
