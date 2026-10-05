package com.cricket.score.repository;

import com.cricket.score.entity.Player;
import com.cricket.score.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {
    Optional<Player> findByNameAndTeam(String name, Team team);
    List<Player> findByTeam(Team team);
}
