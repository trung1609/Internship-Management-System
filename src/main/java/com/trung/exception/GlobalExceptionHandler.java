package com.trung.exception;

import com.trung.dto.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidationException(MethodArgumentNotValidException ex){
        Map<String, String> errors = ex.getFieldErrors()
                .stream()
                .collect(Collectors.toMap(
                        error -> error.getField(),
                        error -> error.getDefaultMessage()
                ));
        ApiResponse<Object> response = ApiResponse.builder()
                .success(false)
                .message("Dữ liệu không hợp lệ")
                .data(null)
                .error(errors)
                .timestamp(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleResourceNotFoundException(ResourceNotFoundException ex){
        ApiResponse<Object> response = ApiResponse.builder()
                .success(false)
                .message("Dữ liệu không tìm thấy")
                .data(null)
                .error(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ResourceConflictException.class)
    public ResponseEntity<ApiResponse<Object>> handleResourceConflictException(ResourceConflictException ex){
        ApiResponse<Object> response = ApiResponse.builder()
                .success(false)
                .message("Xung đột dữ liệu")
                .data(null)
                .error(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleException(Exception ex){
        ApiResponse<Object> response = ApiResponse.builder()
                .success(false)
                .message("Dữ liệu không hợp lệ")
                .data(null)
                .error(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
