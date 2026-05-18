package com.trung.dto.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MentorPublicResponse {
    private String fullName;
    private String department;
    private String academicRank;
}
