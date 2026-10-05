package com.cricket.score.service;

import com.cricket.score.entity.Match;
import com.cricket.score.entity.MatchEvent;
import com.cricket.score.entity.MatchEventType;
import com.cricket.score.entity.MatchStatus;
import com.cricket.score.entity.Score;
import com.cricket.score.repository.MatchEventRepository;
import com.cricket.score.repository.MatchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MatchEventService {

    @Autowired
    private MatchEventRepository matchEventRepository;

    @Autowired
    private MatchRepository matchRepository;

    public List<MatchEvent> getEventsByMatchId(Long matchId) {
        Match match = matchRepository.findById(matchId).orElse(null);
        if (match == null) return null;
        return matchEventRepository.findByMatchOrderByOverNumberAscBallNumberAsc(match);
    }

    @Transactional
    public MatchEvent addEventToMatch(Long matchId, MatchEvent event) {
        Match match = matchRepository.findById(matchId).orElseThrow(() -> new RuntimeException("Match not found"));

        if (match.getStatus() != MatchStatus.LIVE) {
            throw new RuntimeException("Cannot add events to a non-LIVE match");
        }

        validateEvent(event);

        Score score = match.getCurrentScore();
        if (score == null) {
            score = new Score();
            score.setMatch(match);
            match.setCurrentScore(score);
        }

        int currentLegalBalls = calculateLegalBalls(score.getOvers());
        int nextBall = currentLegalBalls + 1;

        int overNumber = currentLegalBalls / 6;
        int ballInOver = (currentLegalBalls % 6) + 1;

        event.setMatch(match);
        event.setOverNumber(overNumber);
        event.setBallNumber(ballInOver);

        matchEventRepository.save(event);

        updateScore(score, event.getEventType(), event.getRuns());

        matchRepository.save(match);

        return event;
    }

    private void validateEvent(MatchEvent event) {
        if (event.getRuns() < 0) throw new RuntimeException("Runs cannot be negative");

        switch (event.getEventType()) {
            case DOT_BALL:
                if (event.getRuns() != 0) throw new RuntimeException("DOT_BALL must have 0 runs");
                break;
            case FOUR:
                if (event.getRuns() != 4) throw new RuntimeException("FOUR must have exactly 4 runs");
                break;
            case SIX:
                if (event.getRuns() != 6) throw new RuntimeException("SIX must have exactly 6 runs");
                break;
            case RUN:
                if (event.getRuns() <= 0) throw new RuntimeException("RUN must have positive runs");
                break;
            case WICKET:
                if (event.getRuns() != 0) throw new RuntimeException("WICKET (simple) must have 0 runs in this phase");
                break;
            default:
                throw new RuntimeException("Unknown event type");
        }
    }

    private int calculateLegalBalls(double overs) {
        int completedOvers = (int) overs;
        int ballsInCurrentOver = (int) Math.round((overs - completedOvers) * 10);
        return (completedOvers * 6) + ballsInCurrentOver;
    }

    private void updateScore(Score score, MatchEventType type, int runs) {
        int currentBalls = calculateLegalBalls(score.getOvers());
        int nextBalls = currentBalls + 1;

        score.setRuns(score.getRuns() + runs);

        if (type == MatchEventType.WICKET) {
            score.setWickets(score.getWickets() + 1);
        }

        int newCompletedOvers = nextBalls / 6;
        int newBallsInOver = nextBalls % 6;
        score.setOvers(newCompletedOvers + (newBallsInOver / 10.0));

        if (nextBalls > 0) {
            double oversEquivalent = nextBalls / 6.0;
            score.setRunRate(Math.round((score.getRuns() / oversEquivalent) * 100.0) / 100.0);
        }
    }
}
