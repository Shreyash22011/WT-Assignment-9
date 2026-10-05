package com.cricket.score.controller;

import com.cricket.score.entity.Match;
import com.cricket.score.entity.MatchEvent;
import com.cricket.score.entity.Player;
import com.cricket.score.entity.Team;
import com.cricket.score.service.MatchEventService;
import com.cricket.score.service.MatchService;
import com.cricket.score.service.PlayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/demo")
@CrossOrigin(origins = "*")
public class DemoController {

    @Autowired
    private MatchService matchService;

    @Autowired
    private PlayerService playerService;

    @Autowired
    private MatchEventService matchEventService;

    @PostMapping("/matches/{matchId}/events")
    public ResponseEntity<?> addEventToMatch(@PathVariable Long matchId, @RequestBody MatchEvent event) {
        try {
            MatchEvent savedEvent = matchEventService.addEventToMatch(matchId, event);
            return ResponseEntity.ok(savedEvent);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/players/seed")
    public ResponseEntity<List<Player>> seedDemoPlayers() {
        Team india = matchService.getOrCreateTeam("India");
        Team australia = matchService.getOrCreateTeam("Australia");
        List<Player> players = playerService.seedDemoPlayers(india, australia);
        return ResponseEntity.ok(players);
    }

    @PostMapping("/live-match")
    public ResponseEntity<Match> createDemoLiveMatch() {
        Match match = matchService.createDemoLiveMatch();
        return ResponseEntity.ok(match);
    }

    @PostMapping("/live-match/update")
    public ResponseEntity<Match> updateDemoLiveMatchScore(
            @RequestParam int runs,
            @RequestParam int wickets,
            @RequestParam double overs,
            @RequestParam double runRate) {
        Match match = matchService.updateDemoLiveMatchScore(runs, wickets, overs, runRate);
        if (match == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(match);
    }

    @PostMapping("/live-match/complete")
    public ResponseEntity<Match> completeDemoLiveMatch(@RequestParam String winner) {
        Match match = matchService.completeDemoLiveMatch(winner);
        if (match == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(match);
    }
}
