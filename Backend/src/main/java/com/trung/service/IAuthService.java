package com.trung.service;

import com.trung.dto.request.*;
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
    ApiResponse<String> logout(String accessToken, String refreshToken);
    ApiResponse<RefreshTokenResponse> refreshToken(String refreshToken) throws InvalidCredentialsException, ResourceNotFoundException;
    ApiResponse<JwtResponse> googleLogin(GoogleLoginRequest request) throws Exception;
    ApiResponse<JwtResponse> githubLogin(GithubLoginRequest request) throws Exception;
}
