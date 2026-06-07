package com.trung.controller;

import com.trung.dto.request.PageRequestDTO;
import com.trung.dto.response.ApiResponse;
import com.trung.dto.response.PageResponseDTO;
import com.trung.dto.response.ReportResponse;
import com.trung.service.impl.ReportServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
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

    @GetMapping("/download/{fileName}")
    public ResponseEntity<Resource> downloadReportFile(@PathVariable String fileName, HttpServletRequest request) {
        Resource resource = reportService.getReportFileAsResource(fileName);

        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (Exception ex) {
            System.out.println("Không thể xác định loại file tự động.");
        }

        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @GetMapping("/my-reports")
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    public ResponseEntity<PageResponseDTO<ReportResponse>> getMyReports(@RequestParam(required = false) String search,
                                                                        PageRequestDTO pageRequestDTO) {
        return new ResponseEntity<>(reportService.getMyReport(search, pageRequestDTO), HttpStatus.OK);
    }

    @GetMapping("/export-excel")
     @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_MENTOR')")
    public ResponseEntity<Resource> exportReportsToExcel(
            @RequestParam(required = false, defaultValue = "") String search,
            PageRequestDTO pageRequestDTO) {

        ByteArrayInputStream in = reportService.exportReportExcel(search, pageRequestDTO);
        InputStreamResource resource = new InputStreamResource(in);
        String fileName = "Danh_sach_Bao_cao_" + System.currentTimeMillis() + ".xlsx";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(resource);
    }

    @GetMapping("/export-zip")
    public ResponseEntity<Resource> exportReportsToZip(
            @RequestParam(required = false, defaultValue = "") String search,
            PageRequestDTO pageRequestDTO) {

        ByteArrayInputStream in = reportService.exportReportZip(search, pageRequestDTO);
        InputStreamResource resource = new InputStreamResource(in);

        String fileName = "Toan_Bo_Bao_Cao_" + System.currentTimeMillis() + ".zip";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .contentType(MediaType.parseMediaType("application/zip"))
                .body(resource);
    }
}