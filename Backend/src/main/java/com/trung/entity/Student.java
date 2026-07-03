package com.trung.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Student {
    @Id
    private Long studentId;

    @Column(nullable = false, unique = true)
    private String studentCode;

    @Column(nullable = true)
    private String major;

    @Column(nullable = true)
    private String classRoom;

    @Column(nullable = true)
    private LocalDate dateOfBirth;

    @Column(nullable = true)
    private String address;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @OneToOne
    @MapsId // Đảm bảo studentId và userId là cùng một giá trị
    @JoinColumn(name = "student_id")
    private User user;
}
