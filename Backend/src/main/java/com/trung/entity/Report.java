package com.trung.entity;

import com.trung.util.enums.ReportStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reportId;

    private String title;

    private String originalFileName;

    private LocalDateTime uploadTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private User user;

    private String fileUrl;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ReportStatus reportStatus = ReportStatus.PENDING;

    private Double score;

    private String feedback;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
