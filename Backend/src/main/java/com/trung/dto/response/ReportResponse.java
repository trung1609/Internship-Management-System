package com.trung.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReportResponse {
    private Long reportId;
    private String title;
    private String originalFileName;
    private String storedFileName;

    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    private LocalDateTime uploadTime;

    private String studentName;
    private String studentCode;
    private Long studentId;
}