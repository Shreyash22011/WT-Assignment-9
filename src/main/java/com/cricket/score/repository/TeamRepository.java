package com.cricket.score.repository;

import com.cricket.score.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
    java.util.Optional<Team> findByName(String name);
}
