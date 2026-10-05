package com.cricket.score.client;

import com.cricket.score.dto.CricApiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class CricketApiClient {

    @Value("${cricket.api.key}")
    private String apiKey;

    private final String BASE_URL = "https://api.cricapi.com/v1/currentMatches";

    private final RestTemplate restTemplate;

    public CricketApiClient() {
        this.restTemplate = new RestTemplate();
    }

    public CricApiResponse fetchCurrentMatches() {
        String url = BASE_URL + "?apikey=" + apiKey + "&offset=0";
        try {
            return restTemplate.getForObject(url, CricApiResponse.class);
        } catch (Exception e) {
            System.err.println("Error fetching data from external API: " + e.getMessage());
            return null;
        }
    }
}
