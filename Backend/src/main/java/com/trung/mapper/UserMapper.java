package com.trung.mapper;

import com.trung.entity.User;
import com.trung.dto.request.UserUpdateRequest;
import com.trung.dto.response.UserResponse;

public class UserMapper {
    public static UserResponse toDto(User users){
        return UserResponse.builder()
                .username(users.getUsername())
                .fullName(users.getFullName())
                .email(users.getEmail())
                .role(users.getRole().name())
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
    }
}
