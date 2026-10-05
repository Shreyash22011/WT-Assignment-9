package com.cricket.score.repository;

import com.cricket.score.entity.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {
    java.util.Optional<Match> findByApiMatchId(String apiMatchId);
    java.util.List<Match> findByStatus(com.cricket.score.entity.MatchStatus status);
}
