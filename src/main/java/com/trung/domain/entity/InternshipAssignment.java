package com.trung.domain.entity;

import com.trung.domain.enums.AssignmentStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "internship_assignments",
uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "phase_id"}))
public class InternshipAssignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long assignmentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mentor_id")
    private Mentor mentor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "phase_id")
    private InternshipPhase phase;

    private LocalDateTime assignedDate;

    @Enumerated(EnumType.STRING)
    private AssignmentStatus status;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
