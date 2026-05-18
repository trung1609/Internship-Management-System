package com.trung.dto.response;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RefreshTokenResponse {
    private String accessToken;
    private Date expiresIn;
}
