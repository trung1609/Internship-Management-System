package com.trung.service.impl;

import com.trung.dto.request.PageRequestDTO;
import com.trung.dto.response.ApiResponse;
import com.trung.dto.response.PageResponseDTO;
import com.trung.dto.response.ReportResponse;
import com.trung.entity.Report;
import com.trung.entity.User;
import com.trung.mapper.ReportMapper;
import com.trung.repository.IReportRepository;
import com.trung.service.IReportService;
import com.trung.util.CurrentUserUtil;
import com.trung.util.PaginationUtil;
import com.trung.util.enums.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements IReportService {
    private final IReportRepository reportRepository;
    private final FileStorageService fileStorageService;
    private final CurrentUserUtil currentUserUtil;

    @Override
    public ApiResponse<ReportResponse> processAndSaveReport(MultipartFile file, String title) {
        try {
            String storedFileName = fileStorageService.storeFile(file);

            Report report = Report.builder()
                    .title(title)
                    .originalFileName(file.getOriginalFilename())
                    .storedFileName(storedFileName)
                    .uploadTime(LocalDateTime.now())
                    .user(currentUserUtil.getCurrentUser().getStudent().getUser())
                    .build();

            Report savedReport = reportRepository.save(report);

            ReportResponse reportResponse = ReportMapper.toDTO(savedReport);

            return ApiResponse.<ReportResponse>builder()
                    .data(reportResponse)
                    .success(true)
                    .message("Tải báo cáo lên hệ thống thành công")
                    .error(null)
                    .timestamp(LocalDateTime.now())
                    .build();

        } catch (Exception e) {
            return ApiResponse.<ReportResponse>builder()
                    .data(null)
                    .success(false)
                    .message("Quá trình tải báo cáo thất bại")
                    .error(e.getMessage())
                    .timestamp(LocalDateTime.now())
                    .build();
        }
    }

    @Override
    public PageResponseDTO<ReportResponse> getAllReport(String search, PageRequestDTO pageRequestDTO) {
        Pageable pageable = PaginationUtil.createPageRequest(pageRequestDTO, "report");
        User user = currentUserUtil.getCurrentUser();
        Page<Report> reportPage;

        if (user.getRole() == Role.ROLE_ADMIN) {
            reportPage = reportRepository.findAllByAdmin(search, pageable);
        } else if (user.getRole() == Role.ROLE_MENTOR) {
            reportPage = reportRepository.findByMentorId(user.getMentor().getMentorId(), search, pageable);
        } else {
            reportPage = Page.empty();
        }
        return PaginationUtil.toPageResponseDTO(reportPage, ReportMapper::toDTO);
    }

    @Override
    public Resource getReportFileAsResource(String storedFileName) {
        return fileStorageService.loadFileAsResource(storedFileName);
    }

    @Override
    public PageResponseDTO<ReportResponse> getMyReport(String search, PageRequestDTO pageRequestDTO) {
        User user = currentUserUtil.getCurrentUser();
        Pageable pageable = PaginationUtil.createPageRequest(pageRequestDTO, "report");

        Page<Report> reportPage = reportRepository.findByStudentId(user.getStudent().getStudentId(), search, pageable);
        return PaginationUtil.toPageResponseDTO(reportPage, ReportMapper::toDTO);
    }

}
