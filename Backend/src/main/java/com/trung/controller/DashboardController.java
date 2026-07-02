package com.trung.controller;

import com.trung.dto.response.ApiResponse;
import com.trung.dto.response.DashboardStatsResponse;
import com.trung.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/dashboards")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getStats() {
        DashboardStatsResponse stats = dashboardService.getDashboardStats();

        ApiResponse<DashboardStatsResponse> response = new ApiResponse<>(
                stats, true, "Lấy thống kê hệ thống thành công", null, LocalDateTime.now()
        );

        return ResponseEntity.ok(response);
    }
}