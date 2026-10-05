package com.cricket.score.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "match_id")
    @JsonIgnore
    private Match match;

    private int overNumber;
    private int ballNumber;

    @Enumerated(EnumType.STRING)
    private MatchEventType eventType;

    private int runs;
    private String description;
}
