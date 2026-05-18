package com.trung.controller;


import com.trung.dto.request.InternshipPhaseCreateRequest;
import com.trung.dto.request.InternshipPhaseUpdateRequest;
import com.trung.dto.request.PageRequestDTO;
import com.trung.dto.response.ApiResponse;
import com.trung.dto.response.InternshipPhaseResponse;
import com.trung.dto.response.PageResponseDTO;
import com.trung.exception.ResourceBadRequestException;
import com.trung.exception.ResourceConflictException;
import com.trung.exception.ResourceNotFoundException;
import com.trung.service.InternshipPhaseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/internship-phases")
@RequiredArgsConstructor
public class InternshipPhaseController {
    private final InternshipPhaseService internshipPhaseService;

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<InternshipPhaseResponse>> createInternshipPhase(@Valid @RequestBody InternshipPhaseCreateRequest request) throws ResourceConflictException {
        return new ResponseEntity<>(internshipPhaseService.createInternshipPhase(request), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<PageResponseDTO<InternshipPhaseResponse>> getAllInternshipPhase(
            @RequestParam(required = false) String search,
            @ModelAttribute PageRequestDTO pageRequestDTO
    ) {
        return new ResponseEntity<>(internshipPhaseService.getAllInternshipPhase(search, pageRequestDTO), HttpStatus.OK);
    }

    @GetMapping("/{phaseId}")
    public ResponseEntity<ApiResponse<InternshipPhaseResponse>> getInternshipPhaseById(@PathVariable Long phaseId) throws ResourceNotFoundException {
        return new ResponseEntity<>(internshipPhaseService.getInternshipPhaseById(phaseId), HttpStatus.OK);
    }

    @PutMapping("/{phaseId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<InternshipPhaseResponse>> updateInternshipPhase(@PathVariable Long phaseId, @Valid @RequestBody InternshipPhaseUpdateRequest request) throws ResourceNotFoundException, ResourceConflictException, ResourceBadRequestException {
        return new ResponseEntity<>(internshipPhaseService.updateInternshipPhase(phaseId, request), HttpStatus.OK);
    }

    @DeleteMapping("/{phaseId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteInternshipPhase(@PathVariable Long phaseId) throws ResourceNotFoundException {
        return new ResponseEntity<>(internshipPhaseService.deleteInternshipPhase(phaseId), HttpStatus.OK);
    }
}
