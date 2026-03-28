package com.trung.service.impl;

import com.trung.domain.entity.User;
import com.trung.domain.enums.Role;
import com.trung.dto.request.FormLoginRequest;
import com.trung.dto.request.FormRegisterRequest;
import com.trung.dto.response.*;
import com.trung.exception.InvalidCredentialsException;
import com.trung.exception.ResourceBadRequestException;
import com.trung.exception.ResourceConflictException;
import com.trung.exception.ResourceNotFoundException;
import com.trung.mapper.UserMapper;
import com.trung.repository.IUserRepository;
import com.trung.security.jwt.JwtAuthenticationFilter;
import com.trung.security.jwt.JwtProvider;
import com.trung.security.jwt.TokenBlacklistService;
import com.trung.security.principal.UserPrincipal;
import com.trung.service.IAuthService;
import com.trung.util.ValidationErrorUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements IAuthService {
    private final IUserRepository userRepository;
    private final JwtProvider jwtProvider;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final TokenBlacklistService tokenBlacklistService;

    @Value("${jwt_expire}")
    private long expire;

    @Override
    public ApiResponse<RegisterResponse> register(FormRegisterRequest request) throws ResourceBadRequestException {
        Map<String, String> errorList = ValidationErrorUtil.createErrorMap();
        User users = new User();

        if (request.getRole() != null) {
            try {
                users.setRole(Role.valueOf(request.getRole().toUpperCase()));
            }catch (IllegalArgumentException e) {
                errorList.put("role", "Invalid role value");
                throw new ResourceBadRequestException("Validation failed", errorList);
            }
        }

        users.setUsername(request.getUsername());
        users.setPassword(passwordEncoder.encode(request.getPassword()));
        users.setFullName(request.getFullName());
        users.setEmail(request.getEmail());
        users.setPhoneNumber(request.getPhoneNumber());


        userRepository.save(users);

        RegisterResponse response = RegisterResponse.builder()
                .message("Register successfully")
                .user(UserMapper.toDto(users))
                .build();

        return new ApiResponse<>(response, true, "SUCCESS", null, LocalDateTime.now());
    }

    @Override
    public ApiResponse<JwtResponse> login(FormLoginRequest request) throws InvalidCredentialsException {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            User users = userPrincipal.getUsers();

            Date expireDate = new Date(new Date().getTime() + expire);

            String token = jwtProvider.generateToken(users);
            JwtResponse response = JwtResponse.builder()
                    .token(token)
                    .expiresIn(expireDate)
                    .username(request.getUsername())
                    .user(UserMapper.toDto(users))
                    .build();
            return new ApiResponse<>(response, true, "SUCCESS", null, LocalDateTime.now());
        }catch (AuthenticationException ex) {
            throw new InvalidCredentialsException("Invalid username or password");
        }
    }

    @Override
    public ApiResponse<UserResponse> getMyProfile(String username) throws ResourceNotFoundException {
        User users = userRepository.findByUsernameAndIsDeletedFalseAndIsActiveTrue(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        return new ApiResponse<>(UserMapper.toDto(users), true, "SUCCESS", null, LocalDateTime.now());
    }

    @Override
    public ApiResponse<String> logout(String token) {
        if (token != null && !token.isEmpty()) {
            // Thêm token vào blacklist Redis
            tokenBlacklistService.addToBlacklist(token);
        }
        return new ApiResponse<>(
                "Logout successfully",
                true,
                "SUCCESS",
                null,
                LocalDateTime.now()
        );
    }
}
