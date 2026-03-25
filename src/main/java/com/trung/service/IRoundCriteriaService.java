package com.trung.service;

import com.trung.dto.request.PageRequestDTO;
import com.trung.dto.request.RoundCriterionCreateRequest;
import com.trung.dto.request.RoundCriterionUpdateRequest;
import com.trung.dto.response.ApiResponse;
import com.trung.dto.response.PageResponseDTO;
import com.trung.dto.response.RoundCriterionResponse;
import com.trung.exception.ResourceNotFoundException;

import java.util.List;

public interface IRoundCriteriaService {
    PageResponseDTO<RoundCriterionResponse> getAllCriteriaInRound(Long roundId, PageRequestDTO pageRequestDTO) throws ResourceNotFoundException;
    ApiResponse<RoundCriterionResponse> getCriterionInRoundById(Long roundCriteriaId) throws ResourceNotFoundException;

    ApiResponse<RoundCriterionResponse> createCriterionInRound(RoundCriterionCreateRequest request) throws ResourceNotFoundException;
    ApiResponse<RoundCriterionResponse> updateWeight(Long roundCriteriaId, RoundCriterionUpdateRequest request) throws ResourceNotFoundException;
    ApiResponse<String> deleteCriterionInRound(Long roundCriteriaId) throws ResourceNotFoundException;
}
