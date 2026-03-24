package com.trung.dto.request;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MentorUpdateRequest {
    private String department;
    private String academicRank;
    private String fullName;
    private String phoneNumber;
    private String email;
}
