package com.trung.mapper;

import com.trung.dto.response.NotificationResponse;
import com.trung.entity.Notification;

public class NotificationMapper {
    public static NotificationResponse toDTO(Notification notification) {
        if (notification == null) return null;

        return NotificationResponse.builder()
                .id(notification.getId())
                .message(notification.getMessage())
                .type(notification.getType())
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
