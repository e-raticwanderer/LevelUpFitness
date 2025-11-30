# AlterFit: Gamer HUD Edition

**System Version:** 2.1.0 (Cyber-Soldier)  
**Status:** OPERATIONAL  
**Clearance:** UNCLASSIFIED

## 📋 Mission Overview: LevelUp is a high-fidelity, gamified fitness library application designed to transform standard training protocols into tactical missions. It leverages a "Gamer HUD" aesthetic to provide immediate visual feedback, RPG-style progression, and a distraction-free interface for serious training.

---

## 📜 Mission History (Development Log)

### **Phase 1: The Prototype (v1.0)**
- **Objective**: Establish core tracking capabilities.
- **Outcome**: Basic workout logging, local storage database (`db.js`), and initial "Gamer HUD" styling.
- **Status**: Deprecated.

### **Phase 2: Gamification Upgrade (v2.1.0 - Current)**
- **Objective**: Implement engagement engine.
- **Features Added**:
  - **XP System**: Users earn XP based on training volume (1 XP per 100 lbs).
  - **Sci-Fi Ranking**: Implemented thematic progression:
    - 🛡️ **Cadet** (0 XP)
    - 🛡️ **Trooper** (500 XP)
    - ⚔️ **Centurion** (1000 XP)
    - ⚡ **Fedaykin** (2500 XP)
    - ⭐ **Master** (5000 XP)
    - 👑 **Kwisatz Haderach** (10000 XP)
  - **Visual Feedback**: Integrated "Data Drop" confetti (Matrix-style rain) for level-up events.
  - **HUD Integration**: Added XP Progress Bar to the sidebar and "Service Record" to the Dashboard.

---

## 🎮 Core Systems

### 1. Command Center (Dashboard)
The central hub for all operations.
- **Service Record**: Displays current Rank, Level, and progress to next promotion.
- **Live Metrics**: Real-time visualization of active clients and system load.

### 2. Tactical Logger (Active Plan)
A focused interface for executing workout protocols.
- **Mission Briefing**: View daily objectives.
- **Execution**: Log sets, reps, and RPE with immediate visual confirmation.
- **Debrief**: Completing a mission awards XP and triggers rank progression checks.

### 3. Armory (Workout Library)
A comprehensive database of physical training protocols.
- **Categories**: Legs, Chest, Back, Shoulders, Arms, Core, Cardio, HITT.
- **Intel**: Video tutorials and difficulty ratings for every exercise.

### 4. Trainer Command
Administrative interface for "Commanders" (Trainers).
- **Unit Oversight**: Monitor client progress and compliance.
- **Protocol Editor**: Design and assign weekly training blocks to specific units.

---

## 🛠️ Technical Specifications
- **Framework**: React 18 (Vite)
- **Styling**: TailwindCSS + Custom "HUD" CSS (Glassmorphism, Neon Effects)
- **State Management**: React Context (`AuthContext`, `GamificationContext`)
- **Database**: LocalStorage Mock DB (`src/services/db.js`)
- **Visual Effects**: `canvas-confetti` (Customized for "Data Drop" effect)
- **Icons**: Lucide React
