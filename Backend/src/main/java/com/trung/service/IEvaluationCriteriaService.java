package com.trung.service;

import com.trung.dto.request.EvaluationCriteriaCreateRequest;
import com.trung.dto.request.EvaluationCriteriaUpdateRequest;
import com.trung.dto.request.PageRequestDTO;
import com.trung.dto.response.ApiResponse;
import com.trung.dto.response.EvaluationCriteriaResponse;
import com.trung.dto.response.PageResponseDTO;
import com.trung.exception.ResourceConflictException;
import com.trung.exception.ResourceNotFoundException;

public interface IEvaluationCriteriaService {
    ApiResponse<EvaluationCriteriaResponse> createCriteria(EvaluationCriteriaCreateRequest request) throws ResourceConflictException;
    PageResponseDTO<EvaluationCriteriaResponse> getAllCriteria(String search, PageRequestDTO pageRequestDTO);
    ApiResponse<EvaluationCriteriaResponse> getCriteriaById(Long id) throws ResourceNotFoundException;
    ApiResponse<EvaluationCriteriaResponse> updateCriteria(Long id, EvaluationCriteriaUpdateRequest request) throws ResourceNotFoundException, ResourceConflictException;
    ApiResponse<String> deleteCriteria(Long id) throws ResourceNotFoundException;
}
