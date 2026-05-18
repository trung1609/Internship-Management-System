package com.trung.security.response;

import lombok.*;

@AllArgsConstructor
@Builder
@NoArgsConstructor
@Getter
@Setter
public class JwtErrorResponse {
    private String error;
    private Object errorDescription;
}
