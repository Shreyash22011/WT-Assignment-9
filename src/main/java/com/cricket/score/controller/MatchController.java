package com.cricket.score.controller;

import com.cricket.score.entity.Match;
import com.cricket.score.entity.MatchEvent;
import com.cricket.score.entity.Score;
import com.cricket.score.service.MatchEventService;
import com.cricket.score.service.MatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class MatchController {

    @Autowired
    private MatchService matchService;

    @Autowired
    private MatchEventService matchEventService;

    @GetMapping("/matches")
    public ResponseEntity<List<Match>> getAllMatches() {
        return ResponseEntity.ok(matchService.getAllMatches());
    }

    @GetMapping("/matches/{id}")
    public ResponseEntity<Match> getMatchById(@PathVariable Long id) {
        Match match = matchService.getMatchById(id);
        if (match == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(match);
    }

    @GetMapping("/matches/{id}/score")
    public ResponseEntity<Score> getScoreByMatchId(@PathVariable Long id) {
        Match match = matchService.getMatchById(id);
        if (match == null || match.getCurrentScore() == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(match.getCurrentScore());
    }

    @GetMapping("/matches/{id}/events")
    public ResponseEntity<List<MatchEvent>> getEventsByMatchId(@PathVariable Long id) {
        List<MatchEvent> events = matchEventService.getEventsByMatchId(id);
        if (events == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(events);
    }

    @GetMapping("/live-matches")
    public ResponseEntity<List<Match>> getLiveMatches() {
        return ResponseEntity.ok(matchService.getLiveMatches());
    }

    @GetMapping("/matches/fetch-live")
    public ResponseEntity<List<Match>> fetchLiveMatches() {
        try {
            List<Match> matches = matchService.fetchLiveMatchesAndProcess();
            return ResponseEntity.ok(matches);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
