package com.trung.mapper;

import com.trung.dto.request.TaskRequest;
import com.trung.dto.response.TaskResponse;
import com.trung.entity.InternshipAssignment;
import com.trung.entity.Student;
import com.trung.entity.Task;
import com.trung.util.enums.TaskStatus;

import java.util.List;
import java.util.stream.Collectors;

public class TaskMapper {
    public static TaskResponse toDTO(Task task) {
        return TaskResponse.builder()
                .taskId(task.getTaskId())
                .taskTitle(task.getTaskTitle())
                .description(task.getDescription())
                .status(task.getStatus().name())
                .assignmentId(task.getAssignment().getAssignmentId())
                .dueDate(task.getDueDate())
                .priority(task.getPriority() != null ? task.getPriority().name() : null)
                .assignees(task.getAssignedStudents().stream()
                        .map(student -> TaskResponse.AssigneeInfo.builder()
                                .studentId(student.getStudentId())
                                .fullName(student.getUser().getFullName())
                                .avatarUrl(student.getUser().getAvatarUrl())
                                .build())
                        .collect(Collectors.toList()))
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }

    public static Task toEntity(TaskRequest request, List<Student> assignedStudentIds, InternshipAssignment assignment) {
        return Task.builder()
                .taskTitle(request.getTaskTitle())
                .description(request.getDescription())
                .assignedStudents(assignedStudentIds)
                .status(request.getStatus() != null ? request.getStatus() : TaskStatus.TO_DO)
                .assignment(assignment)
                .dueDate(request.getDueDate())
                .priority(request.getPriority())
                .build();
    }

    public static void updateFromDto(Task task, TaskRequest request) {
        if (request.getTaskTitle() != null) {
            task.setTaskTitle(request.getTaskTitle());
        }
        if (request.getDescription() != null) {
            task.setDescription(request.getDescription());
        }
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }
        if (request.getDueDate() != null) {
            task.setDueDate(request.getDueDate());
        }
        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }
    }
}
