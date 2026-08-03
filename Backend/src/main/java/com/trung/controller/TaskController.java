package com.trung.controller;

import com.trung.dto.request.PageRequestDTO;
import com.trung.dto.request.TaskRequest;
import com.trung.dto.response.ApiResponse;
import com.trung.dto.response.CommentResponse;
import com.trung.dto.response.PageResponseDTO;
import com.trung.dto.response.TaskResponse;
import com.trung.exception.ResourceConflictException;
import com.trung.exception.ResourceForbiddenException;
import com.trung.exception.ResourceNotFoundException;
import com.trung.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
public class TaskController {
    private final TaskService taskService;

    @GetMapping("/assignment/{assignmentId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_MENTOR', 'ROLE_STUDENT')")
    public ResponseEntity<PageResponseDTO<TaskResponse>> getTasks(@PathVariable Long assignmentId,
                                                                  @ModelAttribute PageRequestDTO requestDTO) throws ResourceForbiddenException, ResourceNotFoundException {
        return ResponseEntity.ok(taskService.getTasksByAssignment(assignmentId, requestDTO));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_MENTOR')")
    public ResponseEntity<ApiResponse<TaskResponse>> createTask(@RequestBody TaskRequest request) throws ResourceNotFoundException, ResourceConflictException, ResourceForbiddenException {
        return ResponseEntity.ok(taskService.createTask(request));
    }

    @PutMapping("/{taskId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_MENTOR')")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTask(@PathVariable Long taskId, @RequestBody TaskRequest request) throws ResourceNotFoundException, ResourceConflictException, ResourceForbiddenException {
        return ResponseEntity.ok(taskService.updateTask(taskId, request));
    }

    @PatchMapping("/{taskId}/status")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_MENTOR', 'ROLE_STUDENT')")
    public ResponseEntity<Void> updateStatus(@PathVariable Long taskId, @RequestParam String status) throws ResourceNotFoundException, ResourceForbiddenException {
        taskService.updateTaskStatus(taskId, status);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{taskId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_MENTOR')")
    public ResponseEntity<Void> deleteTask(@PathVariable Long taskId) {
        taskService.deleteTask(taskId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{taskId}/comments")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_MENTOR', 'ROLE_STUDENT')")
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Long taskId) {
        return ResponseEntity.ok(taskService.getTaskComments(taskId));
    }

    @PostMapping("/{taskId}/comments")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_MENTOR', 'ROLE_STUDENT')")
    public ResponseEntity<CommentResponse> addComment(@PathVariable Long taskId, @RequestBody Map<String, String> payload) throws ResourceNotFoundException {
        return ResponseEntity.ok(taskService.addComment(taskId, payload.get("content")));
    }

    @GetMapping("/assignment/{assignmentId}/progress")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_MENTOR', 'ROLE_STUDENT')")
    public ResponseEntity<Map<String, Object>> getTaskProgress(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(taskService.getTaskProgress(assignmentId));
    }
}