package com.trung.dto.request;
import com.trung.util.enums.TaskPriority;
import com.trung.util.enums.TaskStatus;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TaskRequest {
    private String taskTitle;
    private String description;
    private Long assignmentId;
    private List<Long> assignedStudentIds;
    private TaskStatus status;
    private LocalDate dueDate;
    private TaskPriority priority;
}