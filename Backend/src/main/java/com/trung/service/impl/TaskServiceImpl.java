package com.trung.service.impl;

import com.trung.dto.request.PageRequestDTO;
import com.trung.dto.request.TaskRequest;
import com.trung.dto.response.ApiResponse;
import com.trung.dto.response.CommentResponse;
import com.trung.dto.response.PageResponseDTO;
import com.trung.dto.response.TaskResponse;
import com.trung.entity.*;
import com.trung.exception.ResourceConflictException;
import com.trung.exception.ResourceForbiddenException;
import com.trung.exception.ResourceNotFoundException;
import com.trung.mapper.TaskMapper;
import com.trung.repository.IStudentRepository;
import com.trung.repository.InternshipAssignmentRepository;
import com.trung.repository.TaskCommentRepository;
import com.trung.repository.TaskRepository;
import com.trung.service.TaskService;
import com.trung.util.CurrentUserUtil;
import com.trung.util.PaginationUtil;
import com.trung.util.ValidationErrorUtil;
import com.trung.util.enums.TaskStatus;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {
    private static final Logger log = LoggerFactory.getLogger(TaskServiceImpl.class);
    private final TaskRepository taskRepository;
    private final InternshipAssignmentRepository assignmentRepository;
    private final IStudentRepository studentRepository;
    private final CurrentUserUtil currentUserUtil;
    private final TaskCommentRepository commentRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional(readOnly = true)
    public PageResponseDTO<TaskResponse> getTasksByAssignment(Long assignmentId, PageRequestDTO requestDTO) throws ResourceForbiddenException, ResourceNotFoundException {

        InternshipAssignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + assignmentId));

        User user = currentUserUtil.getCurrentUser();
        String role = user.getRole().name();
        Pageable pageable = PaginationUtil.createPageRequest(requestDTO, "task");

        if (role.equals("ROLE_ADMIN")) {
        } else if (role.equals("ROLE_MENTOR")) {
            validateMentorOrAdminPermission(assignment, user);
        } else if (role.equals("ROLE_STUDENT")) {
            boolean isStudentInAssignment = assignment.getStudents().stream()
                    .anyMatch(s -> s.getUser().getUserId().equals(user.getUserId()));
            if (!isStudentInAssignment) {
                throw new ResourceForbiddenException("User does not have permission to view tasks for this assignment.");
            }
        } else {
            throw new ResourceForbiddenException("User does not have permission to view tasks for this assignment.");
        }

        Page<Task> taskPage = taskRepository.findTasksByAssignmentId(assignmentId, pageable);

        return PaginationUtil.toPageResponseDTO(taskPage, TaskMapper::toDTO);
    }

    @Transactional(rollbackFor = Exception.class)
    public ApiResponse<TaskResponse> createTask(TaskRequest request) throws ResourceNotFoundException, ResourceConflictException, ResourceForbiddenException {
        Map<String, String> errors = ValidationErrorUtil.createErrorMap();

        InternshipAssignment assignment = assignmentRepository.findById(request.getAssignmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + request.getAssignmentId()));

        User user = currentUserUtil.getCurrentUser();
        validateMentorOrAdminPermission(assignment, user);

        List<Student> students = new ArrayList<>();
        if (request.getAssignedStudentIds() != null && !request.getAssignedStudentIds().isEmpty()) {
            Set<Long> uniqueStudentIds = new HashSet<>(request.getAssignedStudentIds());
            if (uniqueStudentIds.size() < request.getAssignedStudentIds().size()) {
                errors.put("assignedStudentIds", "Duplicate student IDs found in the request.");
                throw new ResourceConflictException("Validation Failed", errors);
            }

            students = studentRepository.findAllById(request.getAssignedStudentIds());
            if (students.size() != request.getAssignedStudentIds().size()) {
                throw new ResourceNotFoundException("One or more students not found with the provided IDs.");
            }

            for (Student student : students) {
                if (!assignmentRepository.existsStudentsByAssignmentId(assignment.getAssignmentId(), student.getStudentId())) {
                    errors.put("student_" + student.getStudentId(), "Student with ID " + student.getStudentId() + " is not part of the assignment.");
                    throw new ResourceConflictException("Validation Failed", errors);
                }
            }
        }

        if (ValidationErrorUtil.hasErrors(errors)) {
            throw new ResourceConflictException("Validation Failed", errors);
        }

        Task task = TaskMapper.toEntity(request, students, assignment);
        taskRepository.save(task);
        return new ApiResponse<>(
                TaskMapper.toDTO(task),
                true,
                "Task created successfully",
                null,
                LocalDateTime.now()
        );
    }

    @Transactional(rollbackFor = Exception.class)
    public ApiResponse<TaskResponse> updateTask(Long taskId, TaskRequest request) throws ResourceNotFoundException, ResourceConflictException, ResourceForbiddenException {
        Map<String, String> errors = ValidationErrorUtil.createErrorMap();

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));

        InternshipAssignment assignment = assignmentRepository.findById(request.getAssignmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + request.getAssignmentId()));

        User user = currentUserUtil.getCurrentUser();
        validateMentorOrAdminPermission(assignment, user);

        TaskMapper.updateFromDto(task, request);

        if (request.getAssignedStudentIds() != null && !request.getAssignedStudentIds().isEmpty()) {
            Set<Long> uniqueStudentIds = new HashSet<>(request.getAssignedStudentIds());
            if (uniqueStudentIds.size() < request.getAssignedStudentIds().size()) {
                errors.put("assignedStudentIds", "Duplicate student IDs found in the request.");
                throw new ResourceConflictException("Validation Failed", errors);
            }

            List<Student> students = studentRepository.findAllById(request.getAssignedStudentIds());
            if (students.size() != request.getAssignedStudentIds().size()) {
                throw new ResourceNotFoundException("One or more students not found with the provided IDs.");
            }

            for (Student student : students) {
                if (!assignmentRepository.existsStudentsByAssignmentId(task.getAssignment().getAssignmentId(), student.getStudentId())) {
                    errors.put("studentId_" + student.getStudentId(), "Student with ID " + student.getStudentId() + " is not part of the assignment.");
                }
            }

            if (ValidationErrorUtil.hasErrors(errors)) {
                throw new ResourceConflictException("Validation Failed", errors);
            }

            task.getAssignedStudents().clear();
            task.getAssignedStudents().addAll(students);
        } else {
            task.getAssignedStudents().clear();
        }

        taskRepository.save(task);
        return new ApiResponse<>(TaskMapper.toDTO(task),
                true,
                "Task updated",
                null,
                LocalDateTime.now()
        );
    }

    @Transactional(rollbackFor = Exception.class)
    public void updateTaskStatus(Long taskId, String statusStr) throws ResourceNotFoundException, ResourceForbiddenException {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));

        task.setStatus(TaskStatus.valueOf(statusStr.toUpperCase()));
        taskRepository.save(task);
    }

    @Transactional(rollbackFor = Exception.class)
    public void deleteTask(Long taskId) {
        taskRepository.deleteById(taskId);
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> getTaskComments(Long taskId) {
        return commentRepository.findByTask_TaskIdOrderByCreatedAtAsc(taskId).stream()
                .map(c -> CommentResponse.builder()
                        .commentId(c.getCommentId())
                        .content(c.getContent())
                        .authorName(c.getUser().getFullName())
                        .authorAvatar(c.getUser().getAvatarUrl())
                        .createdAt(c.getCreatedAt())
                        .build()).collect(Collectors.toList());
    }

    @Transactional(rollbackFor = Exception.class)
    public CommentResponse addComment(Long taskId, String content) throws ResourceNotFoundException {
        Task task = taskRepository.findById(taskId).orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        User user = currentUserUtil.getCurrentUser();

        TaskComment comment = TaskComment.builder()
                .content(content)
                .task(task)
                .user(user)
                .build();
        commentRepository.saveAndFlush(comment);

        CommentResponse response = CommentResponse.builder()
                .commentId(comment.getCommentId())
                .content(comment.getContent())
                .authorName(user.getFullName())
                .authorAvatar(user.getAvatarUrl())
                .createdAt(comment.getCreatedAt())
                .build();

        log.info("Đang gửi thông báo WebSocket cho taskId: {}", taskId);
        messagingTemplate.convertAndSend("/topic/tasks/" + taskId + "/comments", response);

        return response;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getTaskProgress(Long assignmentId) {
        long total = taskRepository.countByAssignment_AssignmentId(assignmentId);
        long completed = taskRepository.countByAssignment_AssignmentIdAndStatus(assignmentId, TaskStatus.COMPLETED);

        long percentage = (total == 0) ? 0 : (completed * 100) / total;

        return Map.of(
                "totalTasks", total,
                "completedTasks", completed,
                "percentage", percentage
        );
    }

    private void validateMentorOrAdminPermission(InternshipAssignment assignment, User currentUser) throws ResourceForbiddenException {
        boolean isAdmin = currentUser.getRole().name().equals("ROLE_ADMIN");

        boolean isMentorOfAssignment = assignment.getMentor() != null &&
                assignment.getMentor().getUser().getUserId().equals(currentUser.getUserId());

        if (!isAdmin && !isMentorOfAssignment) {
            throw new ResourceForbiddenException("User does not have permission to modify tasks for this assignment.");
        }
    }
}