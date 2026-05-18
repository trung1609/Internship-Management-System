package com.trung.service;

import com.trung.dto.request.InternshipPhaseCreateRequest;
import com.trung.dto.request.InternshipPhaseUpdateRequest;
import com.trung.dto.request.PageRequestDTO;
import com.trung.dto.response.ApiResponse;
import com.trung.dto.response.InternshipPhaseResponse;
import com.trung.dto.response.PageResponseDTO;
import com.trung.exception.ResourceBadRequestException;
import com.trung.exception.ResourceConflictException;
import com.trung.exception.ResourceNotFoundException;

public interface InternshipPhaseService {
    ApiResponse<InternshipPhaseResponse> createInternshipPhase(InternshipPhaseCreateRequest request) throws ResourceConflictException;
    PageResponseDTO<InternshipPhaseResponse> getAllInternshipPhase(String search, PageRequestDTO pageRequestDTO);
    ApiResponse<InternshipPhaseResponse> getInternshipPhaseById(Long id) throws ResourceNotFoundException;
    ApiResponse<InternshipPhaseResponse> updateInternshipPhase(Long id, InternshipPhaseUpdateRequest request) throws ResourceNotFoundException, ResourceConflictException, ResourceBadRequestException;
    ApiResponse<String> deleteInternshipPhase(Long id) throws ResourceNotFoundException;
}
