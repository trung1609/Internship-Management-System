package com.trung.repository;

import com.trung.entity.AssessmentResult;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface IAssessmentResultRepository extends JpaRepository<AssessmentResult, Long> {

    @Query("select count(ar) > 0 from AssessmentResult ar where " +
            "ar.assignment.assignmentId = :assignmentId " +
            "and ar.round.roundId = :roundId " +
            "and ar.criterion.criterionId = :criterionId")
    boolean existsByAssignmentAndRoundAndCriterion(@Param("assignmentId") Long assignmentId,
                                                   @Param("roundId") Long roundId,
                                                   @Param("criterionId") Long criterionId);

    @Query("select count(ar) > 0 from AssessmentResult ar where " +
            "ar.resultId = :resultId and ar.assignment.mentor.mentorId = :userId")
    boolean existsByResultIdAndEvaluationId_UserId(@Param("resultId") Long resultId,
                                                   @Param("userId") Long userId);

    @Query("select ar from AssessmentResult ar where " +
            "ar.assignment.mentor.mentorId = :userId")
    Page<AssessmentResult> findAllByEvaluationId_UserId(@Param("userId") Long userId,
                                                        Pageable pageable);

    @Query("select ar from AssessmentResult ar where " +
            "ar.assignment.assignmentId = :assignmentId")
    Page<AssessmentResult> findAllByAssignment_AssignmentId(@Param("assignmentId") Long assignmentId,
                                                            Pageable pageable);

    @Query("select ar from AssessmentResult ar where " +
            "ar.assignment.assignmentId = :assignmentId and ar.assignment.mentor.mentorId = :userId")
    Page<AssessmentResult> findAllByAssignment_AssignmentIdAndEvaluationId_UserId(@Param("assignmentId") Long assignmentId,
                                                                                  @Param("userId") Long userId,
                                                                                  Pageable pageable);

    @Query("select ar from AssessmentResult ar where " +
            "ar.assignment.student.studentId = :studentId")
    Page<AssessmentResult> findAllByAssignment_Student_StudentId(@Param("studentId") Long studentId,
                                                                 Pageable pageable);

}
