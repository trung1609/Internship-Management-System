package com.trung.service;

import com.trung.dto.request.PageRequestDTO;
import com.trung.dto.request.TaskRequest;
import com.trung.dto.response.ApiResponse;
import com.trung.dto.response.CommentResponse;
import com.trung.dto.response.PageResponseDTO;
import com.trung.dto.response.TaskResponse;
import com.trung.exception.ResourceConflictException;
import com.trung.exception.ResourceForbiddenException;
import com.trung.exception.ResourceNotFoundException;

import java.util.List;
import java.util.Map;

public interface TaskService {
    PageResponseDTO<TaskResponse> getTasksByAssignment(Long assignmentId, PageRequestDTO requestDTO) throws ResourceForbiddenException, ResourceNotFoundException;
    ApiResponse<TaskResponse> createTask(TaskRequest request) throws ResourceNotFoundException, ResourceConflictException, ResourceForbiddenException;
    ApiResponse<TaskResponse> updateTask(Long taskId, TaskRequest request) throws ResourceNotFoundException, ResourceConflictException, ResourceForbiddenException;
    void updateTaskStatus(Long taskId, String statusStr) throws ResourceNotFoundException, ResourceForbiddenException;
    void deleteTask(Long taskId);
    List<CommentResponse> getTaskComments(Long taskId);
    CommentResponse addComment(Long taskId, String content) throws ResourceNotFoundException;
    Map<String, Object> getTaskProgress(Long assignmentId);
}
