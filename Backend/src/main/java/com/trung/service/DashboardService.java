package com.trung.service;

import com.trung.dto.response.DashboardStatsResponse;
import com.trung.dto.response.MentorStatsResponse;
import com.trung.exception.ResourceNotFoundException;

public interface DashboardService {

    DashboardStatsResponse getDashboardStats();
    MentorStatsResponse getMentorStats(String username) throws ResourceNotFoundException;
}
