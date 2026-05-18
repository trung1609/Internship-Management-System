package com.trung.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserUpdateRequest {
    @Pattern(regexp = "^(|[a-zA-Z0-9_]+)$", message = "Username can only contain letters, numbers, and underscores")
    private String username;

    @Pattern(regexp = "^(|[\\p{L}0-9]+( [\\p{L}0-9]+)*)$", message = "Full name must contain only letters and numbers, and cannot have leading or trailing spaces")
    private String fullName;

    @Email(message = "Email is not valid")
    private String email;

    @Pattern(regexp = "^(|0[356789]\\d{8})$", message = "Phone number must be 10 digits and start with '0'")
    private String phoneNumber;
}
