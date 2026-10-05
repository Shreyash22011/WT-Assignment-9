package com.cricket.score.dto;

import lombok.Data;
import java.util.List;

@Data
public class CricApiMatchData {
    private String id;
    private String name;
    private String matchType;
    private String status;
    private String venue;
    private String date;
    private String dateTimeGMT;
    private List<String> teams;
    private List<CricApiScoreData> score;
    private boolean matchStarted;
    private boolean matchEnded;
}
