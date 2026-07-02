package com.trung.repository;

import com.trung.entity.Report;
import com.trung.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IReportRepository extends JpaRepository<Report, Long> {

    @Query("select r from Report r where (:keyword is null or :keyword = '' or lower(r.title) like lower(concat('%', :keyword, '%')))")
    Page<Report> findAllByAdmin(@Param("keyword") String keyword,
                                Pageable pageable);

    @Query("select r from Report r where r.user.student.studentId in " +
            "(select s.studentId from InternshipAssignment ia join ia.students s where ia.mentor.mentorId = :mentorId) and " +
            "(:keyword is null or :keyword = '' or lower(r.title) like lower(concat('%', :keyword, '%')))")
    Page<Report> findByMentorId(@Param("mentorId") Long mentorId,
                                @Param("keyword") String keyword,
                                Pageable pageable);

    @Query("select r from Report r where r.user.student.studentId = :studentId and " +
            "(:keyword is null or :keyword = '' or lower(r.title) like lower(concat('%', :keyword, '%')))" +
            "order by r.uploadTime desc")
    Page<Report> findByStudentId(@Param("studentId") Long studentId,
                                 @Param("keyword") String keyword,
                                 Pageable pageable);

    @Query("SELECT COUNT(r) FROM Report r WHERE r.user.mentor.mentorId = :mentorId AND r.reportStatus = 'PENDING'")
    long countPendingReportsByMentorId(@Param("mentorId") Long mentorId);

    @Query("SELECT COUNT(r) FROM Report r WHERE r.user.mentor.mentorId = :mentorId AND r.reportStatus = 'GRADED'")
    long countGradedReportsByMentorId(@Param("mentorId") Long mentorId);
}
