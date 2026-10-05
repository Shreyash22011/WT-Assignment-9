package com.cricket.score.dto;

import lombok.Data;

@Data
public class CricApiScoreData {
    private int r;
    private int w;
    private double o;
    private String inning;
}
