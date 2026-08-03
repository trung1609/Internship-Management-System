package com.trung.repository;

import com.trung.entity.Task;
import com.trung.util.enums.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query("select t from Task t where t.assignment.assignmentId = :assignmentId")
    Page<Task> findTasksByAssignmentId(@Param("assignmentId") Long assignmentId, Pageable pageable);
    long countByAssignment_AssignmentId(Long assignmentId);
    long countByAssignment_AssignmentIdAndStatus(Long assignmentId, TaskStatus status);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM task_assigned_students " +
            "WHERE student_id = :studentId AND " +
            "task_id IN " +
            "(SELECT task_id FROM tasks WHERE assignment_id = :assignmentId)", nativeQuery = true)
    void removeStudentFromAllTasksInAssignment(@Param("assignmentId") Long assignmentId, @Param("studentId") Long studentId);
}