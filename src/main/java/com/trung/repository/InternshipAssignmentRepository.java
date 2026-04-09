package com.trung.repository;

import com.trung.entity.InternshipAssignment;
import com.trung.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InternshipAssignmentRepository extends JpaRepository<InternshipAssignment, Long> {

    @Query("select ia.student from InternshipAssignment ia " +
            "where ia.mentor.mentorId = :mentorId")
    Page<Student> findStudentsByMentorId(@Param("mentorId") Long mentorId, Pageable pageable);

    @Query("select case when count(ia) > 0 then true else false end from InternshipAssignment ia " +
            "where ia.student.studentId = :studentId and ia.phase.phaseId = :phaseId")
    boolean existsByStudent_StudentIdAndPhase_PhaseId(@Param("studentId") Long studentId,
                                                      @Param("phaseId") Long phaseId);

    @Query("select case when count(ia) > 0 then true else false end from InternshipAssignment ia " +
            "where ia.mentor.mentorId = :mentorId and ia.assignmentId = :assignmentId")
    boolean existsByMentor_MentorIdAndAssignmentId(@Param("mentorId") Long mentorId,
                                                   @Param("assignmentId") Long assignmentId);

    @Query("select ia from InternshipAssignment ia where ia.mentor.mentorId = :mentorId and ( " +
            ":search is null or :search = '' or " +
            "lower(cast(ia.status as string )) like lower(concat('%', :search, '%')) or " +
            "lower(ia.phase.phaseName) like lower(concat('%', :search, '%')) or " +
            "lower(ia.mentor.user.fullName) like lower(concat('%', :search, '%')) or " +
            "lower(ia.student.user.fullName) like lower(concat('%', :search, '%')))")
    Page<InternshipAssignment> findStudent_StudentIdByMentor_MentorId(@Param("search") String search,
                                                                      @Param("mentorId") Long mentorId,
                                                                      Pageable pageable);


    @Query("select ia from InternshipAssignment ia where ia.student.studentId = :studentId and ( " +
            ":search is null or :search = '' or " +
            "lower(cast(ia.status as string )) like lower(concat('%', :search, '%')) or " +
            "lower(ia.phase.phaseName) like lower(concat('%', :search, '%')) or " +
            "lower(ia.mentor.user.fullName) like lower(concat('%', :search, '%')) or " +
            "lower(ia.student.user.fullName) like lower(concat('%', :search, '%')))")
    Page<InternshipAssignment> findByStudent_StudentId(@Param("search") String search,
                                                       @Param("studentId") Long studentId,
                                                       Pageable pageable);

    @Query("select ia from InternshipAssignment ia where " +
            ":search is null or :search = '' or " +
            "lower(cast(ia.status as string )) like lower(concat('%', :search, '%')) or " +
            "lower(ia.phase.phaseName) like lower(concat('%', :search, '%')) or " +
            "lower(ia.mentor.user.fullName) like lower(concat('%', :search, '%')) or " +
            "lower(ia.student.user.fullName) like lower(concat('%', :search, '%'))")
    Page<InternshipAssignment> findAllByKeyword(@Param("search") String search, Pageable pageable);


    Optional<InternshipAssignment> findByAssignmentIdAndMentor_MentorId(Long assignmentId, Long mentorId);

    Optional<InternshipAssignment> findByAssignmentIdAndStudent_StudentId(Long assignmentId, Long studentId);

    boolean existsByStudent_StudentIdAndAssignmentId(Long studentId, Long assignmentId);


}
