package com.trung.repository;

import com.trung.entity.Report;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface IReportRepository extends JpaRepository<Report, Long> {

    @Query("select r from Report r where (:keyword is null or :keyword = '' or lower(r.title) like lower(concat('%', :keyword, '%')))")
    Page<Report> findAllByAdmin(@Param("keyword") String keyword,
                                Pageable pageable);

    @Query("select r from Report r where r.student.student.studentId in " +
            "(select ia.student.studentId from InternshipAssignment ia where ia.mentor.mentorId = :mentorId) and " +
            "(:keyword is null or :keyword = '' or lower(r.title) like lower(concat('%', :keyword, '%')))")
    Page<Report> findByMentorId(@Param("mentorId") Long mentorId,
                                @Param("keyword") String keyword,
                                Pageable pageable);
}
