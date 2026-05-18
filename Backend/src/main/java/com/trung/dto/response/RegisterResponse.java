package com.trung.dto.response;

import lombok.*;

@AllArgsConstructor
@Builder
@Getter
@Setter
@NoArgsConstructor
public class RegisterResponse {
    private String message;
    private UserResponse user;
}
