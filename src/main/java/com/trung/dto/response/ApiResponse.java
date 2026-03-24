package com.trung.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ApiResponse <T>{
    private T data;
    private boolean success;
    private String message;
    private T error;
    private LocalDateTime timestamp;
}
