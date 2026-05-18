package com.trung.service;

import com.trung.dto.request.MentorCreateRequest;
import com.trung.dto.request.MentorUpdateRequest;
import com.trung.dto.request.PageRequestDTO;
import com.trung.dto.response.ApiResponse;
import com.trung.dto.response.MentorResponse;
import com.trung.dto.response.PageResponseDTO;
import com.trung.exception.ResourceBadRequestException;
import com.trung.exception.ResourceConflictException;
import com.trung.exception.ResourceForbiddenException;
import com.trung.exception.ResourceNotFoundException;

public interface IMentorService {
    PageResponseDTO<Object> getAllMentor(PageRequestDTO pageRequestDTO) throws ResourceNotFoundException, ResourceForbiddenException;
    ApiResponse<Object> getMentorById(Long id) throws ResourceNotFoundException, ResourceForbiddenException;
    ApiResponse<MentorResponse> createMentor(MentorCreateRequest request) throws ResourceNotFoundException, ResourceForbiddenException, ResourceBadRequestException, ResourceConflictException;
    ApiResponse<MentorResponse> updateMentor(Long id, MentorUpdateRequest request) throws ResourceNotFoundException, ResourceForbiddenException, ResourceBadRequestException, ResourceConflictException;
}
