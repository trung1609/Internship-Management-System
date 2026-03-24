package com.trung.dto.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MentorResponse {
    private Long mentorId;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String department;
    private String academicRank;
}
