package com.trung.service.impl;

import com.trung.dto.request.GradeReportRequest;
import com.trung.dto.request.PageRequestDTO;
import com.trung.dto.response.ApiResponse;
import com.trung.dto.response.PageResponseDTO;
import com.trung.dto.response.ReportResponse;
import com.trung.entity.InternshipAssignment;
import com.trung.entity.Report;
import com.trung.entity.User;
import com.trung.event.NotificationEventDTO;
import com.trung.exception.ResourceNotFoundException;
import com.trung.mapper.ReportMapper;
import com.trung.repository.IReportRepository;
import com.trung.repository.InternshipAssignmentRepository;
import com.trung.service.IReportService;
import com.trung.util.CurrentUserUtil;
import com.trung.util.ExcelUtil;
import com.trung.util.PaginationUtil;
import com.trung.util.enums.ReportStatus;
import com.trung.util.enums.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StreamUtils;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.net.MalformedURLException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements IReportService {
    private final IReportRepository reportRepository;
    private final CurrentUserUtil currentUserUtil;
    private final InternshipAssignmentRepository internshipAssignmentRepository;
    private final RabbitTemplate rabbitTemplate;
    private final RestTemplate restTemplate = new RestTemplate();
    private final FileUploadService fileUploadService;

    @Value("${rabbitmq.exchange.name}")
    private String exchangeName;

    @Value("${rabbitmq.routing.key.notification}")
    private String routingKey;

    @Override
    public ApiResponse<ReportResponse> processAndSaveReport(MultipartFile file, String title) {
        try {
            String fileUrl = fileUploadService.uploadFile(file);

            Report report = Report.builder()
                    .title(title)
                    .originalFileName(file.getOriginalFilename())
                    .fileUrl(fileUrl)
                    .uploadTime(LocalDateTime.now())
                    .user(currentUserUtil.getCurrentUser().getStudent().getUser())
                    .build();

            Report savedReport = reportRepository.save(report);

            Page<InternshipAssignment> assignmentPage = internshipAssignmentRepository.findByStudent_StudentId(
                    "",
                    currentUserUtil.getCurrentUser().getStudent().getStudentId(),
                    PageRequest.of(0, 10)
            );

            List<InternshipAssignment> assignments = assignmentPage.getContent();

            for (InternshipAssignment assignment : assignments) {
                Long mentorUserId = assignment.getMentor().getUser().getUserId();

                NotificationEventDTO eventDTO = NotificationEventDTO.builder()
                        .recipientId(mentorUserId)
                        .title("🔔 Báo cáo mới từ sinh viên!")
                        .message("Sinh viên có mã sinh viên " + currentUserUtil.getCurrentUser().getStudent().getStudentCode() + " vừa nộp báo cáo: " + title)
                        .type("REPORT")
                        .build();

                rabbitTemplate.convertAndSend(exchangeName, routingKey, eventDTO);
            }

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
    public Resource getReportFileAsResource(String cloudinaryUrl) {
        try {
            Resource resource = new UrlResource(cloudinaryUrl);

            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("Không thể đọc file từ Cloudinary!");
            }
        } catch (MalformedURLException ex) {
            throw new RuntimeException("Lỗi định dạng URL: " + cloudinaryUrl, ex);
        }
    }

    @Override
    public ApiResponse<ReportResponse> getReportById(Long reportId) throws ResourceNotFoundException {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy báo cáo với ID: " + reportId));

        ReportResponse reportResponse = ReportMapper.toDTO(report);

        return ApiResponse.<ReportResponse>builder()
                .data(reportResponse)
                .success(true)
                .message("Lấy thông tin báo cáo thành công")
                .error(null)
                .timestamp(LocalDateTime.now())
                .build();
    }

    @Override
    public PageResponseDTO<ReportResponse> getMyReport(String search, PageRequestDTO pageRequestDTO) {
        User user = currentUserUtil.getCurrentUser();
        Pageable pageable = PaginationUtil.createPageRequest(pageRequestDTO, "report");

        Page<Report> reportPage = reportRepository.findByStudentId(user.getStudent().getStudentId(), search, pageable);
        return PaginationUtil.toPageResponseDTO(reportPage, ReportMapper::toDTO);
    }

    @Override
    public ByteArrayInputStream exportReportExcel(String search, PageRequestDTO pageRequestDTO) {
        PageResponseDTO<ReportResponse> pageData = this.getAllReport(search, pageRequestDTO);

        List<ReportResponse> dtoList = pageData.getContent();

        return ExcelUtil.exportReportsToExcel(dtoList);
    }

    @Override
    public ByteArrayInputStream exportReportZip(String search, PageRequestDTO pageRequestDTO) {
        PageResponseDTO<ReportResponse> pageData = this.getAllReport(search, pageRequestDTO);
        List<ReportResponse> reports = pageData.getContent();

        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try (ZipOutputStream zos = new ZipOutputStream(baos)) {
            for (ReportResponse report : reports) {
                try {
                    byte[] fileBytes = restTemplate.getForObject(report.getFileUrl(), byte[].class);

                    if (fileBytes != null) {
                        String entryName = report.getStudentCode() + "_" + report.getOriginalFileName();
                        ZipEntry zipEntry = new ZipEntry(entryName);
                        zos.putNextEntry(zipEntry);
                        zos.write(fileBytes);
                        zos.closeEntry();
                    }
                } catch (Exception e) {
                    System.err.println("Không thể nén file: " + report.getFileUrl() + " - " + e.getMessage());
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Lỗi nén file ZIP: " + e.getMessage());
        }

        return new ByteArrayInputStream(baos.toByteArray());
    }

    @Override
    @Transactional
    public void gradeReport(Long reportId, GradeReportRequest request) throws ResourceNotFoundException {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy báo cáo có ID: " + reportId));

        report.setScore(request.getScore());
        report.setFeedback(request.getFeedback());
        report.setReportStatus(ReportStatus.GRADED);

        reportRepository.save(report);

        Long studentId = report.getUser().getUserId();

        NotificationEventDTO notification = NotificationEventDTO.builder()
                .recipientId(studentId)
                .title("🔔 Điểm báo cáo mới!")
                .message(String.format("Báo cáo '%s' của bạn đã được chấm: %.2f điểm. Nhận xét: %s",
                        report.getTitle(), request.getScore(), request.getFeedback()))
                .type("REPORT_GRADED")
                .build();

        rabbitTemplate.convertAndSend(exchangeName, routingKey, notification);
    }
}
