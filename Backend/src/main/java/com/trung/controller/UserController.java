package com.trung.controller;

import com.trung.dto.request.PageRequestDTO;
import com.trung.dto.request.UpdateRoleRequest;
import com.trung.dto.request.UserCreateRequest;
import com.trung.dto.request.UserUpdateRequest;
import com.trung.dto.response.ApiResponse;
import com.trung.dto.response.PageResponseDTO;
import com.trung.dto.response.UserResponse;
import com.trung.exception.ResourceBadRequestException;
import com.trung.exception.ResourceConflictException;
import com.trung.exception.ResourceForbiddenException;
import com.trung.exception.ResourceNotFoundException;
import com.trung.service.IUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final IUserService userService;

    @GetMapping("/profiles")
    public ResponseEntity<PageResponseDTO<UserResponse>> getAllProfile(@RequestParam(required = false) String role,
                                                                       @ModelAttribute PageRequestDTO pageRequestDTO) throws ResourceBadRequestException, ResourceConflictException {
        return new ResponseEntity<>(userService.getAllProfile(role, pageRequestDTO), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<UserResponse>> createProfile(@Valid @RequestBody UserCreateRequest userCreateRequest) throws ResourceBadRequestException, ResourceConflictException {
        return new ResponseEntity<>(userService.createProfile(userCreateRequest), HttpStatus.CREATED);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserResponse>> getProfileById(@PathVariable Long userId) throws ResourceConflictException, ResourceNotFoundException {
        return new ResponseEntity<>(userService.getProfileById(userId), HttpStatus.OK);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(@PathVariable Long userId, @Valid @RequestBody UserUpdateRequest userUpdateRequest) throws ResourceConflictException, ResourceNotFoundException {
        return new ResponseEntity<>(userService.updateProfile(userId, userUpdateRequest), HttpStatus.OK);
    }

    @PutMapping("/{userId}/status")
    public ResponseEntity<ApiResponse<UserResponse>> updateStatus(@PathVariable Long userId) throws ResourceConflictException, ResourceNotFoundException {
        return new ResponseEntity<>(userService.updateStatus(userId), HttpStatus.OK);
    }

    @PutMapping("/{userId}/role")
    public ResponseEntity<ApiResponse<UserResponse>> updateRole(@PathVariable Long userId, @Valid @RequestBody UpdateRoleRequest request) throws ResourceConflictException, ResourceNotFoundException, ResourceForbiddenException, ResourceBadRequestException {
        return new ResponseEntity<>(userService.updateRole(userId, request), HttpStatus.OK);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<ApiResponse<String>> deleteProfile(@PathVariable Long userId) throws ResourceConflictException, ResourceNotFoundException {
        return new ResponseEntity<>(userService.deleteProfile(userId), HttpStatus.OK);
    }
}
