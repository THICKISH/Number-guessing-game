# Number Guessing Game 🎯

An enterprise-grade, dual-edition project featuring both a **Stunning Interactive Web Application** and a **Robust Core Java Console Application**. Built to impress HR recruiters, technical interviewers, and game enthusiasts!

---

## 🌟 Dual Project Editions

This project includes two complete implementations:
1. **🌐 Web Edition (HTML5, Vanilla CSS3, JavaScript ES6)**: Glassmorphism dark UI, particle confetti fireworks, zero-dependency Web Audio API sound synthesizer, proximity gauge, smart hints, and LocalStorage persistence.
2. **☕ Java Console Edition (JDK 8+)**: Modular Java architecture, difficulty modes, dynamic score calculation, and robust exception-handled console interface.

---

## ✨ Key Features

### 🌐 Web Edition Features
- **🎨 Glassmorphism & Dark Mode**: Sleek frosted glass panels, glowing neon accents, and responsive layout powered by Google Fonts (`Plus Jakarta Sans`).
- **🎉 Canvas Confetti Fireworks**: Dynamic particle explosion engine celebrating game victories.
- **🔊 Web Audio API Synthesizer**: Zero-dependency audio synth providing custom sound effects (win chord, high/low tones, button clicks) with a mute toggle.
- **🌡️ Hot & Cold Proximity Gauge**: Dynamic progress bar indicating how close the guess is to the secret number.
- **💡 Smart AI Hint Assistant**: Real-time range contraction feedback + unlockable hints ("Is Prime?", "Is Even/Odd?").
- **📊 LocalStorage Stats Persistence**: Win streak, best score, total games, and guess history saved automatically across browser sessions.

### ☕ Java Console Edition Features
- **3 Difficulty Levels**: Easy (`1-50`), Medium (`1-500`), Hard (`1-500`).
- **Attempt Limit**: Maximum 10 attempts per game round.
- **Dynamic Scoring**: Score formula incorporating remaining attempts, speed bonus, and difficulty multiplier.
- **Input Validation**: Exception handling prevents crashes on non-numeric or out-of-range inputs.

---

## 📁 Project Structure

```
NumberGuessingGame/
│
├── index.html            # Web Dashboard HTML5 Entry Point
├── css/
│   └── styles.css        # Glassmorphism & Keyframe Animations
├── js/
│   ├── sound.js          # Web Audio Synthesizer
│   └── app.js            # Web Engine, Confetti Cannon & LocalStorage Logic
│
├── src/
│   └── NumberGuessingGame.java # Java Console Source Code
├── README.md             # Project Documentation
└── screenshots/          # Project Media & Assets
```

---

## 🚀 How to Run

### 🌐 Running the Web Edition (Browser)
Simply double-click `index.html` or open it in any modern web browser (Chrome, Edge, Firefox, Safari):

```bash
# Double click index.html or open via command line:
start NumberGuessingGame/index.html   # On Windows
open NumberGuessingGame/index.html    # On macOS
```

---

### ☕ Running the Java Console Edition

1. Open your terminal in the project folder:
   ```bash
   cd NumberGuessingGame
   ```

2. Compile the Java source code:
   ```bash
   javac src/NumberGuessingGame.java
   ```

3. Run the compiled application:
   ```bash
   java -cp src NumberGuessingGame
   ```
