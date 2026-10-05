package com.cricket.score.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "team_id")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties("players")
    private Team team;

    // Statistics
    private int runs;
    private int balls;
    private int fours;
    private int sixes;
    private int wickets;
    private int oversBowled;
    private int runsConceded;
}
