package com.trung.scheduler;

import com.trung.repository.InternshipAssignmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Component
@RequiredArgsConstructor
@Slf4j
public class AssignmentScheduler {

    private final InternshipAssignmentRepository assignmentRepository;

    @Scheduled(cron = "0 0 0 * * *", zone = "Asia/Ho_Chi_Minh")
    @Transactional
    public void autoCloseExpiredAssignments() {
        log.info("--- Bắt đầu quét và đóng các đề tài quá hạn deadline ---");

        LocalDate today = LocalDate.now();

        int updatedCount = assignmentRepository.updateExpiredAssignments(today);

        log.info("--- Quét hoàn tất! Đã tự động cập nhật {} đề tài sang COMPLETED ---", updatedCount);
    }
}