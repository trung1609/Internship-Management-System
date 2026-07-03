package com.trung.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentStatsResponse {
    private double progress;
    private long submittedReports;
    private double averageScore;
    private long upcomingDeadlines;
}
