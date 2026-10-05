package com.cricket.score.repository;

import com.cricket.score.entity.Match;
import com.cricket.score.entity.MatchEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchEventRepository extends JpaRepository<MatchEvent, Long> {
    List<MatchEvent> findByMatchOrderByOverNumberAscBallNumberAsc(Match match);
}
