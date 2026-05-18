package com.trung.controller;

import com.trung.dto.request.AssessmentResultCreateRequest;
import com.trung.dto.request.AssessmentResultUpdateRequest;
import com.trung.dto.request.PageRequestDTO;
import com.trung.dto.response.ApiResponse;
import com.trung.dto.response.AssessmentResultResponse;
import com.trung.dto.response.PageResponseDTO;
import com.trung.exception.ResourceConflictException;
import com.trung.exception.ResourceForbiddenException;
import com.trung.exception.ResourceNotFoundException;
import com.trung.service.IAssessmentResultService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/assessment-results")
@RequiredArgsConstructor
public class AssessmentResultController {
    private final IAssessmentResultService assessmentResultService;

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_MENTOR')")
    public ResponseEntity<ApiResponse<List<AssessmentResultResponse>>> createAssessmentResult(@Valid @RequestBody AssessmentResultCreateRequest request) throws ResourceConflictException, ResourceForbiddenException, ResourceNotFoundException {
        return new ResponseEntity<>(assessmentResultService.createAssessmentResult(request), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<PageResponseDTO<AssessmentResultResponse>> getAllAssessmentResults(@RequestParam(required = false) Long assignmentId,
                                                                                             @ModelAttribute PageRequestDTO request) throws ResourceConflictException, ResourceForbiddenException, ResourceNotFoundException {
        return new ResponseEntity<>(assessmentResultService.getAllAssessmentResult(assignmentId, request), HttpStatus.OK);
    }
    @PutMapping("/{resultId}")
    @PreAuthorize("hasAuthority('ROLE_MENTOR')")
    public ResponseEntity<ApiResponse<AssessmentResultResponse>> updateAssessmentResult(@PathVariable Long resultId,
                                                                                             @Valid @RequestBody AssessmentResultUpdateRequest request) throws ResourceConflictException, ResourceForbiddenException, ResourceNotFoundException {
        return new ResponseEntity<>(assessmentResultService.updateAssessmentResult(resultId, request), HttpStatus.OK);
    }

}
