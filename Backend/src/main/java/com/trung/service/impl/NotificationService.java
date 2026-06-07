package com.trung.service.impl;

import com.trung.dto.request.PageRequestDTO;
import com.trung.dto.response.ApiResponse;
import com.trung.dto.response.NotificationResponse;
import com.trung.dto.response.PageResponseDTO;
import com.trung.entity.Notification;
import com.trung.entity.User;
import com.trung.mapper.NotificationMapper;
import com.trung.repository.INotificationRepository;
import com.trung.util.CurrentUserUtil;
import com.trung.util.PaginationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final INotificationRepository notificationRepository;
    private final CurrentUserUtil currentUserUtil;

    public void createNotification(User recipient, String message, String type) {
        Notification notification = Notification.builder()
                .user(recipient)
                .message(message)
                .type(type)
                .isRead(false)
                .build();
        notificationRepository.save(notification);
    }

    public PageResponseDTO<NotificationResponse> getMyNotifications(String search, PageRequestDTO pageRequestDTO) {
        Long userId = currentUserUtil.getCurrentUser().getUserId();

        Pageable pageable = PaginationUtil.createPageRequest(pageRequestDTO, "notification");

        Page<Notification> notificationPage = notificationRepository.findByUser_UserIdOrderByCreatedAtDesc(userId, search, pageable);

        return PaginationUtil.toPageResponseDTO(notificationPage, NotificationMapper::toDTO);
    }

    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        });
    }

    @Transactional
    public void markAllAsRead() {
        Long userId = currentUserUtil.getCurrentUser().getUserId();
        notificationRepository.markAllAsReadByUserId(userId);
    }
}
