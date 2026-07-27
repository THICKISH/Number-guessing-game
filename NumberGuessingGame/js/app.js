/**
 * Number Guessing Game - Web Edition Logic Engine
 * Features: LocalStorage stats, Confetti Cannon, Hot/Cold Gauge, Hints Assistant
 */

class NumberGuessingGameEngine {
    constructor() {
        this.difficulties = {
            easy: { name: 'Easy', min: 1, max: 50, multiplier: 1.0 },
            medium: { name: 'Medium', min: 1, max: 100, multiplier: 1.5 },
            hard: { name: 'Hard', min: 1, max: 500, multiplier: 2.5 }
        };

        this.currentDiffKey = 'medium';
        this.maxAttempts = 10;
        this.attemptsUsed = 0;
        this.secretNumber = 0;
        this.currentMin = 1;
        this.currentMax = 100;
        this.isGameOver = false;

        this.stats = this.loadStats();
        this.confettiParticles = [];
        this.animFrameId = null;

        this.initDOMElements();
        this.bindEvents();
        this.resetGame();
        this.updateStatsUI();
    }

    initDOMElements() {
        // Inputs & Buttons
        this.guessInput = document.getElementById('guess-input');
        this.guessBtn = document.getElementById('guess-btn');
        this.soundBtn = document.getElementById('sound-toggle');
        this.resetStatsBtn = document.getElementById('reset-stats-btn');
        this.hintBtn = document.getElementById('get-hint-btn');

        // Dynamic Text & Containers
        this.targetRangeText = document.getElementById('target-range-text');
        this.attemptsNum = document.getElementById('attempts-num');
        this.ringWrapper = document.getElementById('ring-wrapper');
        this.gaugeFill = document.getElementById('gauge-fill');
        this.proximityText = document.getElementById('proximity-text');
        this.hintText = document.getElementById('hint-text');
        this.historyList = document.getElementById('history-list');

        // Stats Displays
        this.statGames = document.getElementById('stat-games');
        this.statWon = document.getElementById('stat-won');
        this.statWinrate = document.getElementById('stat-winrate');
        this.statBest = document.getElementById('stat-best');

        // Modal
        this.modalOverlay = document.getElementById('victory-modal');
        this.modalIcon = document.getElementById('modal-icon');
        this.modalTitle = document.getElementById('modal-title');
        this.modalSubtitle = document.getElementById('modal-subtitle');
        this.modalAttempts = document.getElementById('modal-attempts');
        this.modalScore = document.getElementById('modal-score');
        this.modalPlayAgainBtn = document.getElementById('modal-play-again');

        // Difficulty Cards
        this.diffCards = document.querySelectorAll('.diff-card');

        // Confetti Canvas
        this.canvas = document.getElementById('confetti-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    bindEvents() {
        // Submit Guess
        this.guessBtn.addEventListener('click', () => this.handleGuess());
        this.guessInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleGuess();
        });

        // Difficulty Switch
        this.diffCards.forEach(card => {
            card.addEventListener('click', () => {
                const diffKey = card.dataset.diff;
                this.selectDifficulty(diffKey);
            });
        });

        // Sound Toggle
        this.soundBtn.addEventListener('click', () => {
            const isMuted = window.soundEngine.toggleMute();
            this.soundBtn.textContent = isMuted ? '🔇' : '🔊';
        });

        // Reset Stats
        if (this.resetStatsBtn) {
            this.resetStatsBtn.addEventListener('click', () => {
                if (confirm("Are you sure you want to reset all game statistics?")) {
                    this.stats = { gamesPlayed: 0, gamesWon: 0, highestScore: 0, totalScore: 0 };
                    this.saveStats();
                    this.updateStatsUI();
                    window.soundEngine.playClick();
                }
            });
        }

        // Hint Request
        this.hintBtn.addEventListener('click', () => this.provideSmartHint());

        // Play Again Button in Modal
        this.modalPlayAgainBtn.addEventListener('click', () => {
            this.hideModal();
            this.resetGame();
            window.soundEngine.playClick();
        });
    }

    selectDifficulty(diffKey) {
        if (this.currentDiffKey === diffKey) return;
        this.currentDiffKey = diffKey;

        this.diffCards.forEach(card => {
            card.classList.toggle('active', card.dataset.diff === diffKey);
        });

        window.soundEngine.playClick();
        this.resetGame();
    }

    resetGame() {
        const config = this.difficulties[this.currentDiffKey];
        this.secretNumber = Math.floor(Math.random() * config.max) + 1;
        this.attemptsUsed = 0;
        this.currentMin = config.min;
        this.currentMax = config.max;
        this.isGameOver = false;

        // UI Reset
        this.targetRangeText.textContent = `${config.min} - ${config.max}`;
        this.attemptsNum.textContent = this.maxAttempts;
        this.ringWrapper.style.setProperty('--progress', 1);
        this.gaugeFill.style.width = '0%';
        this.proximityText.textContent = 'Enter a guess to check distance!';
        this.hintText.textContent = 'Unlock smart hints during gameplay';
        this.historyList.innerHTML = '<div class="history-item">Game started! Make your first guess.</div>';
        
        this.guessInput.value = '';
        this.guessInput.disabled = false;
        this.guessBtn.disabled = false;
        this.guessInput.focus();

        console.log(`[Debug] Secret number is: ${this.secretNumber}`);
    }

    handleGuess() {
        if (this.isGameOver) return;

        const rawValue = this.guessInput.value.trim();
        const guess = parseInt(rawValue, 10);
        const config = this.difficulties[this.currentDiffKey];

        // Validation
        if (isNaN(guess) || guess < config.min || guess > config.max) {
            this.triggerInputError(`Enter a valid number between ${config.min} and ${config.max}`);
            return;
        }

        this.attemptsUsed++;
        const remainingAttempts = this.maxAttempts - this.attemptsUsed;

        // Update Attempt Ring
        this.attemptsNum.textContent = remainingAttempts;
        this.ringWrapper.style.setProperty('--progress', remainingAttempts / this.maxAttempts);

        // Calculate Proximity Distance
        const distance = Math.abs(guess - this.secretNumber);
        const proximityPercentage = Math.max(0, Math.min(100, 100 - (distance / config.max) * 100));
        this.gaugeFill.style.width = `${proximityPercentage}%`;

        // Check Guess Outcome
        if (guess === this.secretNumber) {
            this.handleVictory();
        } else if (this.attemptsUsed >= this.maxAttempts) {
            this.handleDefeat();
        } else {
            // High or Low Feedback
            if (guess > this.secretNumber) {
                this.currentMax = Math.min(this.currentMax, guess - 1);
                this.proximityText.textContent = `Too High! Try a number smaller than ${guess}`;
                this.addHistoryItem(guess, 'High 📈', 'high');
                window.soundEngine.playTooHigh();
            } else {
                this.currentMin = Math.max(this.currentMin, guess + 1);
                this.proximityText.textContent = `Too Low! Try a number larger than ${guess}`;
                this.addHistoryItem(guess, 'Low 📉', 'low');
                window.soundEngine.playTooLow();
            }
        }

        this.guessInput.value = '';
        this.guessInput.focus();
    }

    triggerInputError(msg) {
        window.soundEngine.playError();
        this.guessInput.classList.add('shake');
        this.proximityText.textContent = `⚠️ ${msg}`;
        setTimeout(() => this.guessInput.classList.remove('shake'), 400);
    }

    provideSmartHint() {
        if (this.isGameOver) return;
        window.soundEngine.playClick();

        const hints = [];
        hints.push(`Secret number is between ${this.currentMin} and ${this.currentMax}`);
        hints.push(`Secret number is ${this.secretNumber % 2 === 0 ? 'EVEN' : 'ODD'}`);

        if (this.isPrime(this.secretNumber)) {
            hints.push('Secret number is a PRIME number!');
        } else {
            hints.push('Secret number is a COMPOSITE number.');
        }

        const randomHint = hints[Math.floor(Math.random() * hints.length)];
        this.hintText.textContent = `💡 Hint: ${randomHint}`;
    }

    isPrime(num) {
        if (num <= 1) return false;
        for (let i = 2; i <= Math.sqrt(num); i++) {
            if (num % i === 0) return false;
        }
        return true;
    }

    handleVictory() {
        this.isGameOver = true;
        window.soundEngine.playVictory();

        const config = this.difficulties[this.currentDiffKey];
        const remainingAttempts = this.maxAttempts - this.attemptsUsed;
        const score = this.calculateScore(this.attemptsUsed, remainingAttempts, config.multiplier);

        // Update Stats
        this.stats.gamesPlayed++;
        this.stats.gamesWon++;
        this.stats.totalScore += score;
        let isNewBest = false;
        if (score > this.stats.highestScore) {
            this.stats.highestScore = score;
            isNewBest = true;
        }
        this.saveStats();
        this.updateStatsUI();

        this.addHistoryItem(this.secretNumber, `CORRECT! (${score} pts) 🎉`, 'correct');

        // Confetti Fireworks
        this.launchConfetti();

        // Show Modal
        this.modalIcon.textContent = '🎉';
        this.modalTitle.textContent = isNewBest ? 'NEW HIGH SCORE!' : 'VICTORY!';
        this.modalSubtitle.textContent = `You guessed the secret number ${this.secretNumber}!`;
        this.modalAttempts.textContent = `${this.attemptsUsed} / ${this.maxAttempts}`;
        this.modalScore.textContent = `${score} pts`;
        this.showModal();
    }

    handleDefeat() {
        this.isGameOver = true;
        window.soundEngine.playDefeat();

        this.stats.gamesPlayed++;
        this.saveStats();
        this.updateStatsUI();

        this.addHistoryItem(this.secretNumber, 'Out of attempts! ❌', 'high');

        this.modalIcon.textContent = '💔';
        this.modalTitle.textContent = 'GAME OVER';
        this.modalSubtitle.textContent = `The secret number was ${this.secretNumber}. Better luck next time!`;
        this.modalAttempts.textContent = `${this.maxAttempts} / ${this.maxAttempts}`;
        this.modalScore.textContent = '0 pts';
        this.showModal();
    }

    calculateScore(attemptsUsed, remainingAttempts, multiplier) {
        const base = (remainingAttempts + 1) * 100;
        let bonus = 0;
        if (attemptsUsed === 1) bonus = 500;
        else if (attemptsUsed <= 3) bonus = 250;
        else if (attemptsUsed <= 5) bonus = 100;

        return Math.round((base + bonus) * multiplier);
    }

    addHistoryItem(guess, resultText, cssClass) {
        const item = document.createElement('div');
        item.className = `history-item ${cssClass}`;
        item.innerHTML = `<span>Attempt ${this.attemptsUsed}: <strong>${guess}</strong></span> <span>${resultText}</span>`;
        this.historyList.prepend(item);
    }

    showModal() {
        this.modalOverlay.classList.add('active');
    }

    hideModal() {
        this.modalOverlay.classList.remove('active');
        this.stopConfetti();
    }

    // Stats LocalStorage Management
    loadStats() {
        const saved = localStorage.getItem('number_guessing_game_stats');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) {}
        }
        return { gamesPlayed: 0, gamesWon: 0, highestScore: 0, totalScore: 0 };
    }

    saveStats() {
        localStorage.setItem('number_guessing_game_stats', JSON.stringify(this.stats));
    }

    updateStatsUI() {
        this.statGames.textContent = this.stats.gamesPlayed;
        this.statWon.textContent = this.stats.gamesWon;
        const winRate = this.stats.gamesPlayed > 0 
            ? ((this.stats.gamesWon / this.stats.gamesPlayed) * 100).toFixed(0) 
            : 0;
        this.statWinrate.textContent = `${winRate}%`;
        this.statBest.textContent = `${this.stats.highestScore} pts`;
    }

    // Canvas Confetti Particle System
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    launchConfetti() {
        this.confettiParticles = [];
        const colors = ['#6366f1', '#a855f7', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e'];
        for (let i = 0; i < 150; i++) {
            this.confettiParticles.push({
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
                vx: (Math.random() - 0.5) * 15,
                vy: (Math.random() - 0.7) * 15,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rSpeed: (Math.random() - 0.5) * 10,
                opacity: 1
            });
        }
        this.animateConfetti();
    }

    animateConfetti() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        let activeParticles = 0;
        this.confettiParticles.forEach(p => {
            if (p.opacity <= 0) return;
            activeParticles++;

            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.3; // Gravity
            p.rotation += p.rSpeed;
            p.opacity -= 0.008;

            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate((p.rotation * Math.PI) / 180);
            this.ctx.globalAlpha = Math.max(0, p.opacity);
            this.ctx.fillStyle = p.color;
            this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            this.ctx.restore();
        });

        if (activeParticles > 0) {
            this.animFrameId = requestAnimationFrame(() => this.animateConfetti());
        }
    }

    stopConfetti() {
        if (this.animFrameId) {
            cancelAnimationFrame(this.animFrameId);
            this.animFrameId = null;
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.gameEngine = new NumberGuessingGameEngine();
});
