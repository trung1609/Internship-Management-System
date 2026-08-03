package com.trung.dto.response;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TaskResponse {
    private Long taskId;
    private String taskTitle;
    private String description;
    private String status;
    private Long assignmentId;
    private List<AssigneeInfo> assignees;
    private LocalDate dueDate;
    private String priority;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Getter
    @Setter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AssigneeInfo {
        private Long studentId;
        private String fullName;
        private String avatarUrl;
    }
}