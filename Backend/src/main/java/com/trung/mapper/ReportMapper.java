package com.trung.mapper;

import com.trung.dto.response.ReportResponse;
import com.trung.entity.Report;

public class ReportMapper {
    public static ReportResponse toDTO(Report report) {
        if (report == null) return null;

        return ReportResponse.builder()
                .reportId(report.getReportId())
                .title(report.getTitle())
                .originalFileName(report.getOriginalFileName())
                .storedFileName(report.getStoredFileName())
                .uploadTime(report.getUploadTime())
                .studentId(report.getUser().getStudent().getStudentId())
                .studentCode(report.getUser().getStudent().getStudentCode())
                .studentName(report.getUser().getFullName())
                .build();
    }
}