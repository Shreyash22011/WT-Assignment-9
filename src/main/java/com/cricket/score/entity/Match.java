package com.cricket.score.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "matches")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Match {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String apiMatchId;

    @ManyToOne
    @JoinColumn(name = "team1_id")
    private Team team1;

    @ManyToOne
    @JoinColumn(name = "team2_id")
    private Team team2;

    @Enumerated(EnumType.STRING)
    private MatchStatus status;

    private LocalDateTime matchDate;

    private String venue;
    
    private String winner;

    @OneToOne(mappedBy = "match", cascade = CascadeType.ALL)
    private Score currentScore;
}
