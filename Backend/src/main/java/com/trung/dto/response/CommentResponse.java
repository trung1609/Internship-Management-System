package com.trung.dto.response;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CommentResponse {
    private Long commentId;
    private String content;
    private String authorName;
    private String authorAvatar;
    private LocalDateTime createdAt;
}