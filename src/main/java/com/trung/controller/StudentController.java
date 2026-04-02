package com.trung.controller;

import com.trung.dto.request.PageRequestDTO;
import com.trung.dto.request.StudentCreateRequest;
import com.trung.dto.request.StudentUpdateRequest;
import com.trung.dto.response.ApiResponse;
import com.trung.dto.response.PageResponseDTO;
import com.trung.dto.response.StudentResponse;
import com.trung.exception.*;
import com.trung.service.IStudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/students")
@RequiredArgsConstructor
public class StudentController {
    private final IStudentService studentService;

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<StudentResponse>> createStudent(@Valid @RequestBody StudentCreateRequest request) throws ResourceConflictException, ResourceNotFoundException, ResourceBadRequestException, InvalidDateFormatException, ResourceForbiddenException {
        return new ResponseEntity<>(studentService.createStudent(request), org.springframework.http.HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_MENTOR')")
    public ResponseEntity<PageResponseDTO<StudentResponse>> getAllStudent(@ModelAttribute PageRequestDTO page) throws ResourceNotFoundException, ResourceForbiddenException {
        return new ResponseEntity<>(studentService.getAllStudent(page), HttpStatus.OK);
    }

    @GetMapping("/{studentId}")
    public ResponseEntity<ApiResponse<StudentResponse>> getStudentById(@PathVariable Long studentId) throws ResourceNotFoundException, ResourceForbiddenException {
        return new ResponseEntity<>(studentService.getStudentById(studentId), HttpStatus.OK);
    }

    @PutMapping("/{studentId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_STUDENT')")
    public ResponseEntity<ApiResponse<StudentResponse>> updateStudent(@PathVariable Long studentId, @Valid @RequestBody StudentUpdateRequest request) throws ResourceNotFoundException, ResourceBadRequestException, ResourceForbiddenException, ResourceConflictException, InvalidDateFormatException {
        return new ResponseEntity<>(studentService.updateStudent(studentId, request), HttpStatus.OK);
    }
}
