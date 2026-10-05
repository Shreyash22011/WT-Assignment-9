package com.cricket.score.service;

import com.cricket.score.client.CricketApiClient;
import com.cricket.score.dto.CricApiMatchData;
import com.cricket.score.dto.CricApiResponse;
import com.cricket.score.dto.CricApiScoreData;
import com.cricket.score.entity.Match;
import com.cricket.score.entity.MatchStatus;
import com.cricket.score.entity.Score;
import com.cricket.score.entity.Team;
import com.cricket.score.repository.MatchRepository;
import com.cricket.score.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MatchService {

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private CricketApiClient cricketApiClient;

    public List<Match> getAllMatches() {
        return matchRepository.findAll();
    }

    public Match getMatchById(Long id) {
        return matchRepository.findById(id).orElse(null);
    }

    public List<Match> getLiveMatches() {
        return matchRepository.findByStatus(MatchStatus.LIVE);
    }

    public List<Match> fetchLiveMatchesAndProcess() {
        CricApiResponse response = cricketApiClient.fetchCurrentMatches();
        
        if (response != null && response.getData() != null) {
            for (CricApiMatchData data : response.getData()) {
                processMatchData(data);
            }
        }
        
        return getAllMatches();
    }

    private void processMatchData(CricApiMatchData data) {
        if (data.getTeams() == null || data.getTeams().size() < 2) return;
        
        Team team1 = getOrCreateTeam(data.getTeams().get(0));
        Team team2 = getOrCreateTeam(data.getTeams().get(1));

        Match match = matchRepository.findByApiMatchId(data.getId()).orElse(new Match());
        
        match.setApiMatchId(data.getId());
        match.setTeam1(team1);
        match.setTeam2(team2);
        match.setVenue(data.getVenue());
        match.setMatchDate(LocalDateTime.now());
        
        if (data.isMatchStarted() && !data.isMatchEnded()) {
            match.setStatus(MatchStatus.LIVE);
        } else if (data.isMatchEnded()) {
            match.setStatus(MatchStatus.COMPLETED);
            match.setWinner(data.getStatus());
        } else {
            match.setStatus(MatchStatus.UPCOMING);
        }

        if (data.getScore() != null && !data.getScore().isEmpty()) {
            CricApiScoreData apiScore = data.getScore().get(0);
            
            Score score = match.getCurrentScore();
            if (score == null) {
                score = new Score();
                score.setMatch(match);
            }
            score.setRuns(apiScore.getR());
            score.setWickets(apiScore.getW());
            score.setOvers(apiScore.getO());
            if (apiScore.getO() > 0) {
                score.setRunRate(Math.round((apiScore.getR() / apiScore.getO()) * 100.0) / 100.0);
            }
            match.setCurrentScore(score);
        }

        matchRepository.save(match);
    }

    public Team getOrCreateTeam(String name) {
        return teamRepository.findByName(name).orElseGet(() -> {
            Team team = new Team();
            team.setName(name);
            return teamRepository.save(team);
        });
    }

    public Match createDemoLiveMatch() {
        String demoApiId = "demo-live-match-1";
        return matchRepository.findByApiMatchId(demoApiId).orElseGet(() -> {
            Team india = getOrCreateTeam("India XI");
            Team australia = getOrCreateTeam("Australia XI");

            Match match = new Match();
            match.setApiMatchId(demoApiId);
            match.setTeam1(india);
            match.setTeam2(australia);
            match.setVenue("Maharashtra Cricket Association Stadium, Pune");
            match.setMatchDate(LocalDateTime.now());
            match.setStatus(MatchStatus.LIVE);

            Score score = new Score();
            score.setRuns(142);
            score.setWickets(3);
            score.setOvers(24.2);
            score.setRunRate(5.81);
            score.setMatch(match);
            
            match.setCurrentScore(score);
            return matchRepository.save(match);
        });
    }

    public Match updateDemoLiveMatchScore(int runs, int wickets, double overs, double runRate) {
        String demoApiId = "demo-live-match-1";
        Match match = matchRepository.findByApiMatchId(demoApiId).orElse(null);
        if (match != null && match.getStatus() == MatchStatus.LIVE) {
            Score score = match.getCurrentScore();
            if (score != null) {
                score.setRuns(runs);
                score.setWickets(wickets);
                score.setOvers(overs);
                score.setRunRate(runRate);
                matchRepository.save(match);
            }
        }
        return match;
    }

    public Match completeDemoLiveMatch(String winner) {
        String demoApiId = "demo-live-match-1";
        Match match = matchRepository.findByApiMatchId(demoApiId).orElse(null);
        if (match != null && match.getStatus() == MatchStatus.LIVE) {
            match.setStatus(MatchStatus.COMPLETED);
            match.setWinner(winner);
            matchRepository.save(match);
        }
        return match;
    }
}
