package com.trung.controller;

import com.trung.dto.request.FormLoginRequest;
import com.trung.dto.request.FormRegisterRequest;
import com.trung.dto.response.ApiResponse;
import com.trung.dto.response.JwtResponse;
import com.trung.dto.response.RegisterResponse;
import com.trung.dto.response.UserResponse;
import com.trung.exception.InvalidCredentialsException;
import com.trung.exception.ResourceBadRequestException;
import com.trung.exception.ResourceConflictException;
import com.trung.exception.ResourceNotFoundException;
import com.trung.service.IAuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.naming.AuthenticationException;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final IAuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<RegisterResponse>> register(@Valid @RequestBody FormRegisterRequest request) throws ResourceConflictException, ResourceBadRequestException {
        ApiResponse<RegisterResponse> response = authService.register(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<JwtResponse>> login(@Valid @RequestBody FormLoginRequest request) throws ResourceConflictException, AuthenticationException, InvalidCredentialsException {
        ApiResponse<JwtResponse> response = authService.login(request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_MENTOR', 'ROLE_STUDENT')")
    public ResponseEntity<ApiResponse<UserResponse>> getMyProfile(Authentication authentication) throws ResourceConflictException, ResourceNotFoundException {
        String username = authentication.getName();
        ApiResponse<UserResponse> response = authService.getMyProfile(username);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/logout")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_MENTOR', 'ROLE_STUDENT')")
    public ResponseEntity<ApiResponse<String>> logout(@RequestHeader("Authorization") String authHeader) {
        String token = null;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        }
        ApiResponse<String> response = authService.logout(token);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
