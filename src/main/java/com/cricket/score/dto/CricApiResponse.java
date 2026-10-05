package com.cricket.score.dto;

import lombok.Data;
import java.util.List;

@Data
public class CricApiResponse {
    private String apikey;
    private List<CricApiMatchData> data;
    private String status;
}
