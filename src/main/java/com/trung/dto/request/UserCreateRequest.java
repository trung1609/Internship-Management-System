package com.trung.dto.request;

import com.trung.validation.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserCreateRequest {

    @NotBlank(message = "Username is required")
    @Username
    @UniqueUsername
    private String username;

    @NotBlank(message = "Password is required")
    @StrongPassword
    private String password;

    @NotBlank(message = "Full name is required")
    @Name
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email is invalid")
    @UniqueEmail
    private String email;

    @PhoneNumber
    private String phoneNumber;

    @NotBlank(message = "Role is required")
    private String role;
}
