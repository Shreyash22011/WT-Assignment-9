# Cricket Score Management System

A modern, full-stack web application designed for tracking live cricket scores, managing match events, and displaying comprehensive player statistics. This platform dynamically switches between real live matches (via external API) and a fully functional controlled demo match when no live matches are underway.

## 🚀 Features

- **Real-Time Match Fetching:** Connects seamlessly with CricAPI to fetch real-world ongoing cricket matches.
- **Smart Demo Fallback:** Automatically provides a controlled "Demo Live Match" (India XI vs Australia XI) if no real matches are currently available to ensure continuous demonstrability.
- **Score Management (Demo):** Allows administrators to click UI buttons (e.g., +1 Run, FOUR, WICKET) to add live match events. The backend automatically calculates precise run-rates and fractional over counting (e.g., `24.5` -> `25.0`).
- **Match Events Feed:** A dedicated match details page with a chronologically ordered feed of match events (`WICKET`, `SIX`, `FOUR`, `RUN`, `DOT_BALL`).
- **Comprehensive Dashboard:** A responsive, dark-mode themed React dashboard featuring 'Live Matches' and 'Recent Matches'.
- **Sample Player Statistics:** A grouped statistical view displaying runs, balls, boundaries, overs bowled, and wickets for seeded players.

---

## 🛠️ Tech Stack & Versions

### Backend
- **Java:** `17`
- **Spring Boot:** `4.1.1` (Spring Web, Spring Data JPA)
- **Database:** MySQL 8.x
- **Utilities:** Lombok
- **Integration:** RestTemplate (for CricAPI `currentMatches` endpoint)

### Frontend
- **Framework:** React `19.2.8`
- **Build Tool:** Vite `8.3.0`
- **Language:** TypeScript `~6.0.2`
- **Routing:** React Router DOM `7.18.4`
- **Styling:** Custom Vanilla CSS with modern Glassmorphism and CSS variables
- **Icons:** Lucide React `1.48.0`

---

## 📸 Screenshots

> **Note:** Please add your screenshots to a `screenshots/` directory at the root of the project to display them below.

### 1. Dashboard Overview
*(Shows the smart toggle between real CricAPI live matches and the Demo Live Match fallback, alongside recently completed matches).*
![Dashboard Overview](screenshots/dashboard.png)

### 2. Match Details & Score Management
*(Demonstrates the Live Event buttons and the chronological feed of recent deliveries/events).*
![Match Details & Score Management](screenshots/match-details.png)

### 3. Sample Player Statistics
*(Displays the seeded player records grouped by their respective teams).*
![Player Statistics](screenshots/players.png)

---

## ⚙️ Architecture & Data Flow

1. **Frontend (React/Vite):** Runs on port `5173`. Uses Axios-like explicit fetch calls via a custom `api.ts` service.
2. **Backend (Spring Boot):** Runs on port `8080`. 
   - Polling is highly optimized. The frontend silently polls the backend DB every 20 seconds.
   - The backend strictly fetches from CricAPI *only* when the user explicitly clicks the "Refresh" button on the UI, protecting API quotas.
3. **Database (MySQL):** Runs on port `3307` (`cricket_score_db`). Persists matches, events, scores, teams, and players to preserve state across restarts.

---

## 🚀 How to Run Locally

### Prerequisites
- Java 17+
- Maven
- Node.js & npm
- MySQL Server running on port `3307` with a schema named `cricket_score_db`
- A valid CricAPI key placed in `src/main/resources/application.properties`

### Running the Backend
```bash
cd cricket-score-management
mvn spring-boot:run
```
*(Backend will start on `http://localhost:8080`)*

### Running the Frontend
```bash
cd cricket-score-management/frontend
npm install
npm run dev
```
*(Frontend will start on `http://localhost:5173`)*

---

## 📝 Authors & License

Developed as Assignment 9 for Web Technologies (WT) Semester 5.
