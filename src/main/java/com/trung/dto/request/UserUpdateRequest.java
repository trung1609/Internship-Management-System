package com.trung.dto.request;

import com.trung.validation.Name;
import com.trung.validation.PhoneNumber;
import com.trung.validation.UniqueUsername;
import com.trung.validation.Username;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserUpdateRequest {
    @Username
    private String username;

    @Name
    private String fullName;

    @Email(message = "Email is not valid")
    private String email;

    @PhoneNumber
    private String phoneNumber;
}
