import java.util.Random;
import java.util.Scanner;

/**
 * NumberGuessingGame - A complete, interactive console-based Java game.
 * 
 * Features:
 * - Interactive Welcome Screen and Styled Console Menus
 * - 3 Difficulty Levels: Easy (1-50), Medium (1-100), Hard (1-500)
 * - Attempt Limit: Max 10 attempts per round
 * - Intelligent Feedback: "Too High", "Too Low", "Correct!"
 * - Dynamic Score Calculation based on remaining attempts and difficulty
 * - Statistics Tracking: Total Games, Games Won, Highest Score, Average Score
 * - Comprehensive Input Validation (no crashes on invalid input)
 * - Modular design adhering to standard Java coding conventions
 * 
 * @author Java Developer
 * @version 1.0
 */
public class NumberGuessingGame {

    // Global Constants
    private static final int MAX_ATTEMPTS = 10;
    private static final String SEPARATOR_LINE = "=================================================================";
    private static final String SUB_SEPARATOR  = "-----------------------------------------------------------------";

    // Global Game Statistics (In-Memory Tracking)
    private static int totalGamesPlayed = 0;
    private static int gamesWon = 0;
    private static int highestScore = 0;
    private static int totalScoreAccumulated = 0;

    /**
     * Main entry point of the Number Guessing Game.
     * Initializes scanner and controls the main program execution flow.
     * 
     * @param args Command-line arguments (unused)
     */
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        displayWelcomeScreen();

        boolean running = true;
        while (running) {
            displayMainMenu();
            int choice = getValidIntInput(scanner, "Enter your choice (1-3): ", 1, 3);

            switch (choice) {
                case 1:
                    startNewGame(scanner);
                    break;
                case 2:
                    displayScoreboard();
                    break;
                case 3:
                    running = false;
                    displayExitMessage();
                    break;
                default:
                    // Guarded by input validation, but included for complete switch coverage
                    System.out.println("Invalid selection. Please try again.");
                    break;
            }
        }

        scanner.close();
    }

    /**
     * Displays an attractive welcome banner with instructions and branding.
     */
    private static void displayWelcomeScreen() {
        System.out.println();
        System.out.println(SEPARATOR_LINE);
        System.out.println("               WELCOME TO THE NUMBER GUESSING GAME              ");
        System.out.println(SEPARATOR_LINE);
        System.out.println("  Test your intuition and logic by guessing secret numbers!");
        System.out.println("  Choose your difficulty level, track your highest score,");
        System.out.println("  and see if you can guess the hidden number in under 10 tries!");
        System.out.println(SEPARATOR_LINE);
        System.out.println();
    }

    /**
     * Displays the main menu options to the user.
     */
    private static void displayMainMenu() {
        System.out.println(SEPARATOR_LINE);
        System.out.println("                           MAIN MENU                             ");
        System.out.println(SEPARATOR_LINE);
        System.out.println("  1. Play Game");
        System.out.println("  2. View Score & Statistics");
        System.out.println("  3. Exit Game");
        System.out.println(SEPARATOR_LINE);
    }

    /**
     * Handles the flow of launching game rounds, including difficulty selection
     * and asking the user if they wish to play again.
     * 
     * @param scanner Shared Scanner instance for user input
     */
    private static void startNewGame(Scanner scanner) {
        boolean keepPlaying = true;

        while (keepPlaying) {
            int[] difficultyData = selectDifficulty(scanner);
            int maxRange = difficultyData[0];
            int difficultyLevel = difficultyData[1];
            String difficultyName = getDifficultyName(difficultyLevel);

            playSingleRound(scanner, maxRange, difficultyLevel, difficultyName);

            keepPlaying = promptPlayAgain(scanner);
        }
    }

    /**
     * Prompts the user to select a difficulty level and returns range specifications.
     * 
     * @param scanner Shared Scanner instance
     * @return Array containing [maxRange, difficultyLevelCode]
     */
    private static int[] selectDifficulty(Scanner scanner) {
        System.out.println();
        System.out.println(SEPARATOR_LINE);
        System.out.println("                      SELECT DIFFICULTY LEVEL                   ");
        System.out.println(SEPARATOR_LINE);
        System.out.println("  1. Easy   (Number range: 1 - 50,  Multiplier: 1.0x)");
        System.out.println("  2. Medium (Number range: 1 - 100, Multiplier: 1.5x)");
        System.out.println("  3. Hard   (Number range: 1 - 500, Multiplier: 2.5x)");
        System.out.println(SEPARATOR_LINE);

        int choice = getValidIntInput(scanner, "Select difficulty (1-3): ", 1, 3);
        int maxRange = 100;

        switch (choice) {
            case 1:
                maxRange = 50;
                break;
            case 2:
                maxRange = 100;
                break;
            case 3:
                maxRange = 500;
                break;
        }

        return new int[]{maxRange, choice};
    }

    /**
     * Converts a numeric difficulty level into its string representation.
     * 
     * @param level Numeric level (1=Easy, 2=Medium, 3=Hard)
     * @return Name of the difficulty level
     */
    private static String getDifficultyName(int level) {
        switch (level) {
            case 1:
                return "Easy (1-50)";
            case 2:
                return "Medium (1-100)";
            case 3:
                return "Hard (1-500)";
            default:
                return "Unknown";
        }
    }

    /**
     * Executes a single round of the guessing game.
     * Generates the secret number, tracks attempts, provides high/low feedback,
     * calculates score, and updates overall statistics.
     * 
     * @param scanner Shared Scanner instance
     * @param maxRange Maximum possible secret number for selected difficulty
     * @param difficultyLevel Numeric code for difficulty (1, 2, or 3)
     * @param difficultyName String display name for difficulty
     */
    private static void playSingleRound(Scanner scanner, int maxRange, int difficultyLevel, String difficultyName) {
        Random random = new Random();
        int targetNumber = random.nextInt(maxRange) + 1;
        int attemptsUsed = 0;
        boolean hasGuessedCorrectly = false;

        System.out.println();
        System.out.println(SEPARATOR_LINE);
        System.out.printf("  GAME STARTED | Mode: %-15s | Attempts Allowed: %d%n", difficultyName, MAX_ATTEMPTS);
        System.out.println(SEPARATOR_LINE);
        System.out.printf("  I have picked a secret number between 1 and %d.%n", maxRange);
        System.out.println("  Can you guess what it is?");
        System.out.println(SUB_SEPARATOR);

        while (attemptsUsed < MAX_ATTEMPTS && !hasGuessedCorrectly) {
            attemptsUsed++;
            int remainingAttempts = MAX_ATTEMPTS - attemptsUsed;

            String prompt = String.format("  Attempt %d/%d - Enter your guess (1-%d): ", attemptsUsed, MAX_ATTEMPTS, maxRange);
            int guess = getValidIntInput(scanner, prompt, 1, maxRange);

            if (guess == targetNumber) {
                hasGuessedCorrectly = true;
                System.out.println();
                System.out.println("  [!] CORRECT! Outstanding guess!");
            } else if (guess > targetNumber) {
                System.out.println("  [+] Too High!");
                if (remainingAttempts > 0) {
                    System.out.printf("     [Hint: Try a smaller number. %d attempt(s) left]%n", remainingAttempts);
                }
            } else {
                System.out.println("  [-] Too Low!");
                if (remainingAttempts > 0) {
                    System.out.printf("     [Hint: Try a larger number. %d attempt(s) left]%n", remainingAttempts);
                }
            }
            System.out.println(SUB_SEPARATOR);
        }

        // Update Global Statistics
        totalGamesPlayed++;
        int roundScore = 0;

        System.out.println();
        System.out.println(SEPARATOR_LINE);
        System.out.println("                           ROUND SUMMARY                         ");
        System.out.println(SEPARATOR_LINE);
        System.out.printf("  Secret Number      : %d%n", targetNumber);
        System.out.printf("  Attempts Used      : %d / %d%n", attemptsUsed, MAX_ATTEMPTS);

        if (hasGuessedCorrectly) {
            gamesWon++;
            int remainingAttempts = MAX_ATTEMPTS - attemptsUsed;
            roundScore = calculateScore(attemptsUsed, remainingAttempts, difficultyLevel);
            totalScoreAccumulated += roundScore;

            if (roundScore > highestScore) {
                highestScore = roundScore;
                System.out.println("  [*] NEW HIGH SCORE ACHIEVED!");
            }

            System.out.println("  Result             : VICTORY! [WIN]");
            System.out.printf("  Round Score Earned : %d pts%n", roundScore);
        } else {
            System.out.println("  Result             : DEFEAT! [LOSE] (Ran out of attempts)");
            System.out.println("  Round Score Earned : 0 pts");
        }

        System.out.printf("  Total Accumulated  : %d pts%n", totalScoreAccumulated);
        System.out.println(SEPARATOR_LINE);
    }

    /**
     * Calculates the score earned for a winning round based on attempts used,
     * remaining attempts bonus, and difficulty level multiplier.
     * 
     * @param attemptsUsed Number of attempts taken to guess correctly
     * @param remainingAttempts Number of unused attempts left
     * @param difficultyLevel Numeric difficulty code (1=Easy, 2=Medium, 3=Hard)
     * @return Calculated integer score
     */
    private static int calculateScore(int attemptsUsed, int remainingAttempts, int difficultyLevel) {
        // Base points per remaining attempt
        int basePoints = (remainingAttempts + 1) * 100;

        // Speed bonus based on how fast the player guessed
        int speedBonus = 0;
        if (attemptsUsed == 1) {
            speedBonus = 500; // Hole in one bonus!
        } else if (attemptsUsed <= 3) {
            speedBonus = 250;
        } else if (attemptsUsed <= 5) {
            speedBonus = 100;
        }

        // Difficulty multiplier
        double multiplier = 1.0;
        switch (difficultyLevel) {
            case 1:
                multiplier = 1.0; // Easy
                break;
            case 2:
                multiplier = 1.5; // Medium
                break;
            case 3:
                multiplier = 2.5; // Hard
                break;
        }

        return (int) Math.round((basePoints + speedBonus) * multiplier);
    }

    /**
     * Prompts the user to decide whether to play another round.
     * Validates input so only valid responses ('Y', 'N', 'YES', 'NO') are accepted.
     * 
     * @param scanner Shared Scanner instance
     * @return true if user wants to play again, false otherwise
     */
    private static boolean promptPlayAgain(Scanner scanner) {
        while (true) {
            System.out.print("Do you want to play again? (Y/N): ");
            String input = scanner.nextLine().trim().toUpperCase();

            if (input.equals("Y") || input.equals("YES")) {
                return true;
            } else if (input.equals("N") || input.equals("NO")) {
                return false;
            } else {
                System.out.println("Invalid response. Please enter 'Y' for Yes or 'N' for No.");
            }
        }
    }

    /**
     * Displays detailed statistics and performance metrics recorded across all played rounds.
     */
    private static void displayScoreboard() {
        System.out.println();
        System.out.println(SEPARATOR_LINE);
        System.out.println("                        SCOREBOARD & STATS                       ");
        System.out.println(SEPARATOR_LINE);

        if (totalGamesPlayed == 0) {
            System.out.println("  No games played yet! Start a new game to generate statistics.");
        } else {
            double winRate = ((double) gamesWon / totalGamesPlayed) * 100.0;
            double averageScore = (double) totalScoreAccumulated / totalGamesPlayed;

            System.out.printf("  Total Games Played : %d%n", totalGamesPlayed);
            System.out.printf("  Games Won          : %d%n", gamesWon);
            System.out.printf("  Games Lost         : %d%n", (totalGamesPlayed - gamesWon));
            System.out.printf("  Win Rate           : %.1f%%%n", winRate);
            System.out.printf("  Highest Score      : %d pts%n", highestScore);
            System.out.printf("  Total Score        : %d pts%n", totalScoreAccumulated);
            System.out.printf("  Average Score      : %.2f pts/game%n", averageScore);
        }

        System.out.println(SEPARATOR_LINE);
        System.out.println();
    }

    /**
     * Displays a polite exit message when quitting the game.
     */
    private static void displayExitMessage() {
        System.out.println();
        System.out.println(SEPARATOR_LINE);
        System.out.println("  Thank you for playing the Number Guessing Game!");
        System.out.println("  Hope you enjoyed the game. Have a great day!");
        System.out.println(SEPARATOR_LINE);
        System.out.println();
    }

    /**
     * Robust input helper that safely retrieves an integer from the user.
     * Prevents crashes caused by non-numeric inputs (e.g. letters or symbols)
     * and enforces specified lower and upper numerical bounds.
     * 
     * @param scanner Shared Scanner instance
     * @param prompt Question or instruction displayed to the user
     * @param min Minimum allowable integer value
     * @param max Maximum allowable integer value
     * @return Validated integer within [min, max]
     */
    private static int getValidIntInput(Scanner scanner, String prompt, int min, int max) {
        int value = -1;
        boolean valid = false;

        while (!valid) {
            System.out.print(prompt);
            String input = scanner.nextLine().trim();

            try {
                value = Integer.parseInt(input);
                if (value >= min && value <= max) {
                    valid = true;
                } else {
                    System.out.printf("  [!] Input out of bounds! Please enter a number between %d and %d.%n", min, max);
                }
            } catch (NumberFormatException e) {
                System.out.println("  [!] Invalid entry! Please enter a valid whole number (e.g. 5, 42).");
            }
        }

        return value;
    }
}
