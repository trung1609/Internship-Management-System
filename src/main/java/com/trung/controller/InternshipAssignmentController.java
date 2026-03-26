package com.trung.controller;

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
import com.trung.service.InternshipAssignmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/internship-assignments")
@RequiredArgsConstructor
public class InternshipAssignmentController {
    private final InternshipAssignmentService internshipAssignmentService;

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<InternshipAssignmentResponse>>> createInternshipAssignment(@Valid @RequestBody InternshipAssignmentCreateRequest request) throws ResourceConflictException, ResourceNotFoundException {
        return new ResponseEntity<>(internshipAssignmentService.createInternshipAssignment(request), org.springframework.http.HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<PageResponseDTO<InternshipAssignmentResponse>> getAllInternshipAssignments(@RequestParam(required = false) String search,
                                                                                                     @ModelAttribute PageRequestDTO pageRequestDTO) throws ResourceNotFoundException, ResourceForbiddenException {
        return new ResponseEntity<>(internshipAssignmentService.getAllInternshipAssignment(search, pageRequestDTO), HttpStatus.OK);
    }

    @GetMapping("/{assignmentId}")
    public ResponseEntity<ApiResponse<InternshipAssignmentResponse>> getInternshipAssignmentById(@PathVariable Long assignmentId) throws ResourceNotFoundException, ResourceForbiddenException {
        return new ResponseEntity<>(internshipAssignmentService.getInternshipAssignmentById(assignmentId), HttpStatus.OK);
    }

    @PutMapping("/{assignmentId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<InternshipAssignmentResponse>> updateStatusAssignment(@PathVariable Long assignmentId, @Valid @RequestBody InternshipAssignmentUpdateRequest request) throws ResourceNotFoundException, ResourceBadRequestException {
        return new ResponseEntity<>(internshipAssignmentService.updateInternshipAssignment(assignmentId, request), HttpStatus.OK);
    }
}
