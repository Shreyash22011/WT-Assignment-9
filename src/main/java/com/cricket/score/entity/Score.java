package com.cricket.score.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Score {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int runs;
    private int wickets;
    private double overs;
    private double runRate;

    @OneToOne
    @JoinColumn(name = "match_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Match match;
}
