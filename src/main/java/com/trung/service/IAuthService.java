package com.trung.service;

import com.trung.dto.request.FormLoginRequest;
import com.trung.dto.request.FormRegisterRequest;
import com.trung.dto.response.*;
import com.trung.exception.InvalidCredentialsException;
import com.trung.exception.ResourceBadRequestException;
import com.trung.exception.ResourceConflictException;
import com.trung.exception.ResourceNotFoundException;

import javax.naming.AuthenticationException;

public interface IAuthService {
    ApiResponse<RegisterResponse> register(FormRegisterRequest request) throws ResourceConflictException, ResourceBadRequestException;
    ApiResponse<JwtResponse> login(FormLoginRequest request) throws AuthenticationException, InvalidCredentialsException, ResourceConflictException;
    ApiResponse<UserResponse> getMyProfile(String username) throws ResourceNotFoundException;
    ApiResponse<String> logout(String token);
}
