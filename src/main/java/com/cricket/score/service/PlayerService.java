package com.cricket.score.service;

import com.cricket.score.entity.Player;
import com.cricket.score.entity.Team;
import com.cricket.score.repository.PlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;

import java.util.List;

@Service
public class PlayerService {
    @Autowired
    private PlayerRepository playerRepository;

    public List<Player> getAllPlayers() {
        return playerRepository.findAll();
    }

    public Player getPlayerById(Long id) {
        return playerRepository.findById(id).orElse(null);
    }

    public List<Player> seedDemoPlayers(Team india, Team australia) {
        List<Player> seededPlayers = new ArrayList<>();

        if (india != null) {
            seededPlayers.add(getOrCreatePlayer("Arjun Sharma", india, 62, 71, 6, 2, 0, 0, 0));
            seededPlayers.add(getOrCreatePlayer("Rohan Patil", india, 45, 32, 4, 1, 0, 0, 0));
            seededPlayers.add(getOrCreatePlayer("Aditya Kulkarni", india, 12, 10, 1, 0, 1, 4, 22));
            seededPlayers.add(getOrCreatePlayer("Kunal Deshmukh", india, 0, 0, 0, 0, 3, 10, 45));
            seededPlayers.add(getOrCreatePlayer("Vikram Joshi", india, 5, 8, 0, 0, 2, 8, 38));
        }

        if (australia != null) {
            seededPlayers.add(getOrCreatePlayer("Liam Anderson", australia, 78, 65, 8, 3, 0, 0, 0));
            seededPlayers.add(getOrCreatePlayer("Noah Williams", australia, 34, 40, 2, 0, 0, 0, 0));
            seededPlayers.add(getOrCreatePlayer("Ethan Carter", australia, 22, 15, 3, 1, 0, 2, 15));
            seededPlayers.add(getOrCreatePlayer("Daniel Brooks", australia, 2, 4, 0, 0, 4, 10, 52));
            seededPlayers.add(getOrCreatePlayer("Ryan Mitchell", australia, 0, 1, 0, 0, 2, 9, 41));
        }

        return seededPlayers;
    }

    private Player getOrCreatePlayer(String name, Team team, int runs, int balls, int fours, int sixes, int wickets, int oversBowled, int runsConceded) {
        return playerRepository.findByNameAndTeam(name, team).orElseGet(() -> {
            Player player = new Player();
            player.setName(name);
            player.setTeam(team);
            player.setRuns(runs);
            player.setBalls(balls);
            player.setFours(fours);
            player.setSixes(sixes);
            player.setWickets(wickets);
            player.setOversBowled(oversBowled);
            player.setRunsConceded(runsConceded);
            return playerRepository.save(player);
        });
    }
}
