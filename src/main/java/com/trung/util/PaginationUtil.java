package com.trung.util;

import com.trung.dto.request.PageRequestDTO;
import com.trung.dto.response.PageResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;


public class PaginationUtil {

    public static Pageable createPageRequest(PageRequestDTO pageRequestDTO) {

        // Danh sách các trường được phép sort cho User
        List<String> userAllowedSortFields = List.of("userId", "username", "email", "fullName", "role", "createdAt", "updatedAt");
        // Danh sách các trường được phép sort cho Student
        List<String> studentAllowedSortFields = List.of("studentId", "studentCode", "major", "classRoom", "dateOfBirth", "address", "createdAt", "updatedAt");
        // Danh sách các trường được phép sort cho Assignment
        List<String> assignmentAllowedSortFields = List.of("assignmentId", "student", "mentor", "status", "createdAt", "updatedAt");
        // Danh sách các trường được phép sort cho Mentor
        List<String> mentorAllowedSortFields = List.of("mentorId", "department", "academicRank", "createdAt", "updatedAt");

        int page = pageRequestDTO.getPage() != null && pageRequestDTO.getPage() > 0 ? pageRequestDTO.getPage() : 0;
        int size = pageRequestDTO.getSize() != null && pageRequestDTO.getSize() > 0 ? pageRequestDTO.getSize() : 10;


        List<String> allAllowedFields = new ArrayList<>();
        allAllowedFields.addAll(userAllowedSortFields);
        allAllowedFields.addAll(studentAllowedSortFields);
        allAllowedFields.addAll(assignmentAllowedSortFields);
        allAllowedFields.addAll(mentorAllowedSortFields);
        
        String sortBy = pageRequestDTO.getSortBy() != null && allAllowedFields.contains(pageRequestDTO.getSortBy())
                ? pageRequestDTO.getSortBy()
                : "createdAt";

        Sort.Direction direction;
        try {
            direction = pageRequestDTO.getSortDirection() == null || pageRequestDTO.getSortDirection().isBlank()
                    ? Sort.Direction.ASC
                    : Sort.Direction.fromString(pageRequestDTO.getSortDirection());
        } catch (Exception e) {
            direction = Sort.Direction.ASC; // Tránh user sort ko theo asc hoặc desc
        }

        return PageRequest.of(page, size, Sort.by(direction, sortBy));
    }

    public static <T, R> PageResponseDTO<R> toPageResponseDTO(Page<T> page, Function<T, R> mapper) {
        List<R> content = page.getContent().stream()
                .map(mapper)
                .toList();
        return new PageResponseDTO<>(
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                content,
                page.hasNext(),
                page.hasPrevious()
        );
    }
}
