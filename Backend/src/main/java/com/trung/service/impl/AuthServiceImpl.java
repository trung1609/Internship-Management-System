package com.trung.service.impl;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.trung.dto.request.ForgotPasswordRequest;
import com.trung.dto.request.GoogleLoginRequest;
import com.trung.entity.Mentor;
import com.trung.entity.Student;
import com.trung.entity.User;
import com.trung.repository.IMentorRepository;
import com.trung.repository.IStudentRepository;
import com.trung.util.enums.Role;
import com.trung.dto.request.FormLoginRequest;
import com.trung.dto.request.FormRegisterRequest;
import com.trung.dto.response.*;
import com.trung.exception.InvalidCredentialsException;
import com.trung.exception.ResourceBadRequestException;
import com.trung.exception.ResourceConflictException;
import com.trung.exception.ResourceNotFoundException;
import com.trung.mapper.UserMapper;
import com.trung.repository.IUserRepository;
import com.trung.security.jwt.JwtProvider;
import com.trung.security.jwt.RefreshTokenService;
import com.trung.security.jwt.TokenBlacklistService;
import com.trung.security.principal.UserPrincipal;
import com.trung.service.IAuthService;
import com.trung.util.ValidationErrorUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Date;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements IAuthService {
    private final IUserRepository userRepository;
    private final JwtProvider jwtProvider;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final TokenBlacklistService tokenBlacklistService;
    private final RefreshTokenService refreshTokenService;
    private final IStudentRepository iStudentRepository;
    private final IMentorRepository iMentorRepository;
    private final StringRedisTemplate redisTemplate;
    private final EmailService emailService;

    @Value("${jwt_expire}")
    private long expire;

    @Value("${google.client-id}")
    private String googleClientId;

    @Override
    @Transactional
    public ApiResponse<RegisterResponse> register(FormRegisterRequest request) throws ResourceBadRequestException, ResourceConflictException {
        Map<String, String> errorList = ValidationErrorUtil.createErrorMap();
        String redisOtpKey = "OTP:" + request.getEmail();

        if (request.getOtp() == null || request.getOtp().trim().isEmpty()) {

            if (userRepository.existsByUsernameAndIsDeletedFalseAndIsActiveTrue(request.getUsername())) {
                errorList.put("username", "Username already exists");
            }
            if (userRepository.existsByEmailAndIsDeletedFalseAndIsActiveTrue(request.getEmail())) {
                errorList.put("email", "Email already exists");
            }
            if (ValidationErrorUtil.hasErrors(errorList)) {
                throw new ResourceConflictException("Validation failed", errorList);
            }

            emailService.sendOtpEmail(request.getEmail());

            RegisterResponse response = RegisterResponse.builder()
                    .message("OTP_SENT_REDIRECT")
                    .build();

            return new ApiResponse<>(response, true, "Mã OTP xác thực kích hoạt đã được gửi qua email.", null, LocalDateTime.now());
        }

        String savedOtp = redisTemplate.opsForValue().get(redisOtpKey);

        if (savedOtp == null) {
            errorList.put("otp", "Mã xác thực OTP đã hết hạn hoặc không tồn tại. Vui lòng quay lại đăng ký lại.");
            throw new ResourceConflictException("Xác thực thất bại", errorList);
        }

        if (!savedOtp.equals(request.getOtp().trim())) {
            errorList.put("otp", "Mã xác thực OTP không chính xác.");
            throw new ResourceConflictException("Xác thực thất bại", errorList);
        }
        if (userRepository.existsByUsernameAndIsDeletedFalseAndIsActiveTrue(request.getUsername())) {
            errorList.put("username", "Username already exists");
        }

        if (userRepository.existsByEmailAndIsDeletedFalseAndIsActiveTrue(request.getEmail())) {
            errorList.put("email", "Email already exists");
        }
        if (ValidationErrorUtil.hasErrors(errorList)) {
            throw new ResourceConflictException("Validation failed", errorList);
        }

        User users = new User();

        if (request.getRole() != null) {
            try {
                users.setRole(Role.valueOf(request.getRole().toUpperCase()));
            }catch (IllegalArgumentException e) {
                errorList.put("role", "Invalid role value");
                throw new ResourceBadRequestException("Validation failed", errorList);
            }
        }else {
            users.setRole(Role.ROLE_STUDENT);
        }

        users.setUsername(request.getUsername());
        users.setPassword(passwordEncoder.encode(request.getPassword()));
        users.setFullName(request.getFullName());
        users.setEmail(request.getEmail());
        users.setPhoneNumber(request.getPhoneNumber());
        userRepository.save(users);

        if (users.getRole() == Role.ROLE_STUDENT) {
            Student student = new Student();
            student.setUser(users);
            student.setStudentCode("STU" + String.format("%04d", users.getUserId()));
            iStudentRepository.save(student);
        }else if (users.getRole() == Role.ROLE_MENTOR) {
            Mentor mentor = new Mentor();
            mentor.setUser(users);
            iMentorRepository.save(mentor);
        }

        redisTemplate.delete(redisOtpKey);
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

            String accessToken = jwtProvider.generateAccessToken(users);

            String refreshToken = jwtProvider.generateRefreshToken(users);

            refreshTokenService.saveRefreshToken(refreshToken);

            JwtResponse response = JwtResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
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
    public ApiResponse<String> logout(String accessToken, String refreshToken) {
        // Them accessToken vao blacklist
        tokenBlacklistService.addTokenToBlacklist(accessToken, "access");

        refreshTokenService.deleteRefreshToken(refreshToken);

        return new ApiResponse<>(
                "Logout successfully",
                true,
                "SUCCESS",
                null,
                LocalDateTime.now()
        );
    }

    @Override
    public ApiResponse<RefreshTokenResponse> refreshToken(String refreshToken) throws InvalidCredentialsException, ResourceNotFoundException {
        if (!refreshTokenService.isRefreshTokenValid(refreshToken)) {
            throw new InvalidCredentialsException("Invalid refresh token or expired");
        }

        String username = jwtProvider.getUsernameFromToken(refreshToken);
        User users = userRepository.findByUsernameAndIsDeletedFalseAndIsActiveTrue(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        // Tao moi 1 accessToken va refreshToken moi
        String accessTokenNew = jwtProvider.generateAccessToken(users);
        String refreshTokenNew = jwtProvider.generateRefreshToken(users);
        refreshTokenService.saveRefreshToken(refreshTokenNew);
        refreshTokenService.deleteRefreshToken(refreshToken);
        RefreshTokenResponse response = RefreshTokenResponse.builder()
                .accessToken(accessTokenNew)
                .refreshToken(refreshTokenNew)
                .expiresIn(new Date(new Date().getTime() + expire))
                .build();

        return new ApiResponse<>(
                response,
                true,
                "SUCCESS",
                null,
                LocalDateTime.now()
        );
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ApiResponse<JwtResponse> googleLogin(GoogleLoginRequest request) throws Exception {
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                .setAudience(Collections.singletonList(googleClientId))
                .build();

        GoogleIdToken idToken = verifier.verify(request.getIdToken());
        if (idToken == null) {
            throw new InvalidCredentialsException("Mã xác thực Google không hợp lệ hoặc đã hết hạn.");
        }

        GoogleIdToken.Payload payload = idToken.getPayload();
        String email = payload.getEmail();
        String fullName = (String) payload.get("name");

        User user = userRepository.findByEmailAndIsDeletedFalseAndIsActiveTrue(email).orElse(null);

        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setUsername(email.split("@")[0]);
            user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
            user.setFullName(fullName);
            user.setRole(Role.ROLE_STUDENT);

            user = userRepository.save(user);

            Student student = new Student();
            student.setUser(user);
            student.setStudentCode("STU" + String.format("%04d", user.getUserId()));
            iStudentRepository.save(student);
        }

        Date expireDate = new Date(new Date().getTime() + expire);
        String accessToken = jwtProvider.generateAccessToken(user);
        String refreshToken = jwtProvider.generateRefreshToken(user);

        refreshTokenService.saveRefreshToken(refreshToken);

        JwtResponse response = JwtResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(expireDate)
                .username(user.getUsername())
                .user(UserMapper.toDto(user))
                .build();

        return new ApiResponse<>(response, true, "SUCCESS", null, LocalDateTime.now());
    }
}
