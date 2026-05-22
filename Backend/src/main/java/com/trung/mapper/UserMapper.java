package com.trung.mapper;

import com.trung.dto.request.UserUpdateRequest;
import com.trung.dto.response.UserResponse;
import com.trung.entity.User;
import com.trung.util.enums.Role;

public class UserMapper {
    public static UserResponse toDto(User users){
        return UserResponse.builder()
                .userId(users.getUserId())
                .username(users.getUsername())
                .fullName(users.getFullName())
                .email(users.getEmail())
                .role(users.getRole().name())
                .phoneNumber(users.getPhoneNumber())
                .isActive(users.isActive())
                .createdAt(users.getCreatedAt())
                .updatedAt(users.getUpdatedAt())
                .build();
    }

    public static void updateFromDto(User users, UserUpdateRequest userUpdateRequest){
        if (userUpdateRequest.getUsername() != null && !userUpdateRequest.getUsername().isBlank()){
            users.setUsername(userUpdateRequest.getUsername());
        }
        if (userUpdateRequest.getFullName() != null && !userUpdateRequest.getFullName().isBlank()) {
            users.setFullName(userUpdateRequest.getFullName());
        }
        if (userUpdateRequest.getEmail() != null && !userUpdateRequest.getEmail().isBlank()) {
            users.setEmail(userUpdateRequest.getEmail());
        }
        if (userUpdateRequest.getPhoneNumber() != null && !userUpdateRequest.getPhoneNumber().isBlank()) {
            users.setPhoneNumber(userUpdateRequest.getPhoneNumber());
        }
        if (userUpdateRequest.getRole() != null && !userUpdateRequest.getRole().isBlank()){
            users.setRole(Role.valueOf(userUpdateRequest.getRole()));
        }
    }
}
