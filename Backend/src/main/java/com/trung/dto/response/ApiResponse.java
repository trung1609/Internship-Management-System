package com.trung.dto.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class ApiResponse <T>{
    private T data;
    private boolean success;
    private String message;
    private Object error;
    private LocalDateTime timestamp;
}
