package com.trung.service.impl;

import com.trung.dto.response.ChartDataResponse;
import com.trung.dto.response.DashboardStatsResponse;
import com.trung.dto.response.MentorStatsResponse;
import com.trung.entity.SiteTraffic;
import com.trung.entity.User;
import com.trung.exception.ResourceNotFoundException;
import com.trung.repository.*;
import com.trung.service.DashboardService;
import com.trung.util.enums.ReportStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final IUserRepository userRepository;
    private final InternshipPhaseRepository phaseRepository;
    private final InternshipAssignmentRepository assignmentRepository;
    private final IReportRepository reportRepository;
    private final SiteTrafficRepository siteTrafficRepository;

    @Override
    public DashboardStatsResponse getDashboardStats() {
        long totalUsers = userRepository.count();
        long activePhases = phaseRepository.count();
        long totalAssignments = assignmentRepository.count();
        long totalReports = reportRepository.count();

        List<SiteTraffic> traffics = siteTrafficRepository.findAll();
        long totalVisits = traffics.stream().mapToLong(SiteTraffic::getVisitCount).sum();

        List<ChartDataResponse> visitorData = traffics.stream()
                .sorted(Comparator.comparing(SiteTraffic::getVisitDate).reversed())
                .limit(6)
                .map(t -> new ChartDataResponse(t.getVisitDate().toString(), t.getVisitCount()))
                .collect(Collectors.toList());
        Collections.reverse(visitorData);

        List<ChartDataResponse> pieData = new ArrayList<>();
        long totalStudents = userRepository.count();
        long pendingReports = totalStudents > totalReports ? totalStudents - totalReports : 0;
        pieData.add(new ChartDataResponse("Đã nộp", totalReports));
        pieData.add(new ChartDataResponse("Chưa nộp", pendingReports));

        return DashboardStatsResponse.builder()
                .totalUsers(totalUsers)
                .activePhases(activePhases)
                .totalAssignments(totalAssignments)
                .totalReports(totalReports)
                .websiteVisits(totalVisits)
                .pieData(pieData)
                .visitorData(visitorData)
                .build();
    }

    @Override
    public MentorStatsResponse getMentorStats(String username) throws ResourceNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user"));
        Long mentorId = user.getMentor().getMentorId();

        long totalGroups = assignmentRepository.countByMentor_MentorId(mentorId);

        long totalStudents = userRepository.countStudentsByMentorId(mentorId);

        long pendingReports = reportRepository.countReportsByMentorIdAndStatus(mentorId, ReportStatus.PENDING);
        long studentsGraded = reportRepository.countDistinctStudentsGradedByMentor(mentorId, ReportStatus.GRADED);

        double completionRate = totalStudents > 0
                ? Math.round(((double) studentsGraded / totalStudents) * 100.0)
                : 0.0;

        return MentorStatsResponse.builder()
                .totalGroups(totalGroups)
                .totalStudents(totalStudents)
                .pendingReports(pendingReports)
                .completionRate(completionRate)
                .build();
    }
}