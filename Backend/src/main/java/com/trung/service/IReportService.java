package com.trung.service;

import com.trung.dto.request.PageRequestDTO;
import com.trung.dto.response.ApiResponse;
import com.trung.dto.response.PageResponseDTO;
import com.trung.dto.response.ReportResponse;
import org.springframework.web.multipart.MultipartFile;

public interface IReportService {
    ApiResponse<ReportResponse> processAndSaveReport(MultipartFile file,String title);

    PageResponseDTO<ReportResponse> getAllReport(String search, PageRequestDTO pageRequestDTO);
}
