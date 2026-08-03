package com.trung.repository;
import com.trung.entity.TaskComment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskCommentRepository extends JpaRepository<TaskComment, Long> {
    List<TaskComment> findByTask_TaskIdOrderByCreatedAtAsc(Long taskId);
}