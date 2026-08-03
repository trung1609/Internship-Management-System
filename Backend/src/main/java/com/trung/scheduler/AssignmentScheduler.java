package com.trung.scheduler;

import com.trung.repository.InternshipAssignmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;

@Component
@RequiredArgsConstructor
@Slf4j
public class AssignmentScheduler {

    private final InternshipAssignmentRepository assignmentRepository;

    @Scheduled(cron = "0 0 0 * * *", zone = "Asia/Ho_Chi_Minh")
    @Transactional
    public void autoCloseExpiredAssignments() {
        log.info("--- [Daily Schedule] Bắt đầu quét các đề tài quá hạn ---");
        executeDeadlineScan();
    }

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void runOnStartup() {
        log.info("--- [System Startup] Kiểm tra chạy bù các đề tài quá hạn ---");
        executeDeadlineScan();
    }

    private void executeDeadlineScan() {
        LocalDate today = LocalDate.now(ZoneId.of("Asia/Ho_Chi_Minh"));

        int updatedCount = assignmentRepository.updateExpiredAssignments(today);

        log.info("--- Quét hoàn tất! Đã tự động cập nhật {} đề tài sang COMPLETED ---", updatedCount);
    }
}