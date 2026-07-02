package com.trung.service;

import com.trung.dto.request.GradeReportRequest;
import com.trung.dto.request.PageRequestDTO;
import com.trung.dto.response.ApiResponse;
import com.trung.dto.response.PageResponseDTO;
import com.trung.dto.response.ReportResponse;
import com.trung.exception.ResourceNotFoundException;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;

public interface IReportService {
    ApiResponse<ReportResponse> processAndSaveReport(MultipartFile file, String title);

    PageResponseDTO<ReportResponse> getAllReport(String search, PageRequestDTO pageRequestDTO);

    Resource getReportFileAsResource(String storedFileName);

    ApiResponse<ReportResponse> getReportById(Long reportId) throws ResourceNotFoundException;

    PageResponseDTO<ReportResponse> getMyReport(String search, PageRequestDTO pageRequestDTO);

    ByteArrayInputStream exportReportExcel(String search, PageRequestDTO pageRequestDTO);

    ByteArrayInputStream exportReportZip(String search, PageRequestDTO pageRequestDTO);

    void gradeReport(Long reportId, GradeReportRequest request) throws ResourceNotFoundException;
}
