package com.trung.controller;

import com.trung.dto.request.PageRequestDTO;
import com.trung.dto.response.ApiResponse;
import com.trung.dto.response.PageResponseDTO;
import com.trung.dto.response.ReportResponse;
import com.trung.service.impl.ReportServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportServiceImpl reportService;


    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ReportResponse>> uploadReport(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title) {

        ApiResponse<ReportResponse> response = reportService.processAndSaveReport(file, title);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_MENTOR')")
    public ResponseEntity<PageResponseDTO<ReportResponse>> getAllReports(@RequestParam(required = false) String search,
                                                                         PageRequestDTO pageRequestDTO) {
        return new ResponseEntity<>(reportService.getAllReport(search, pageRequestDTO), HttpStatus.OK);
    }
}