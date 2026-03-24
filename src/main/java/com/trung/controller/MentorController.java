package com.trung.controller;

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
import com.trung.service.IMentorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/mentors")
@RequiredArgsConstructor
public class MentorController {
    private final IMentorService mentorService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_STUDENT')")
    public ResponseEntity<PageResponseDTO<Object>> getAllMentors(@ModelAttribute PageRequestDTO pageRequestDTO) throws ResourceForbiddenException, ResourceNotFoundException {
        return new ResponseEntity<>(mentorService.getAllMentor(pageRequestDTO), HttpStatus.OK);
    }

    @GetMapping("/{mentorId}")
    public ResponseEntity<ApiResponse<Object>> getMentorById(@PathVariable Long mentorId) throws ResourceNotFoundException, ResourceForbiddenException {
        return new ResponseEntity<>(mentorService.getMentorById(mentorId), HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<MentorResponse>> createMentor(@Valid @RequestBody MentorCreateRequest request) throws ResourceConflictException, ResourceForbiddenException, ResourceNotFoundException, ResourceBadRequestException {
        return new ResponseEntity<>(mentorService.createMentor(request), HttpStatus.CREATED);
    }

    @PutMapping("/{mentorId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_MENTOR')")
    public ResponseEntity<ApiResponse<MentorResponse>> updateMentor(@PathVariable Long mentorId, @Valid @RequestBody MentorUpdateRequest request) throws ResourceConflictException, ResourceForbiddenException, ResourceNotFoundException, ResourceBadRequestException {
        return new ResponseEntity<>(mentorService.updateMentor(mentorId, request), HttpStatus.OK);
    }
}
