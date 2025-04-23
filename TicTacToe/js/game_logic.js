// -- Game State Variables --
let currentPlayer = 'X'; // Tracks the current player ('X' or 'O')
let gameBoardState = []; // Stores the moves made, e.g., ["cell-0X", "cell-4O"]
let isGameActive = true; // Flag to control game flow, prevents clicks after game ends

// -- DOM Elements --
const gameBody = document.getElementById('game-body');
const winIndicatorCanvas = document.getElementById('winning-indicator');
const canvasContext = winIndicatorCanvas.getContext('2d');

// -- Constants --
const PLAYER_X = 'X';
const PLAYER_O = 'O';
const WINNING_COMBINATIONS = [
    // Rows
    ['cell-0', 'cell-1', 'cell-2'], ['cell-3', 'cell-4', 'cell-5'], ['cell-6', 'cell-7', 'cell-8'],
    // Columns
    ['cell-0', 'cell-3', 'cell-6'], ['cell-1', 'cell-4', 'cell-7'], ['cell-2', 'cell-5', 'cell-8'],
    // Diagonals
    ['cell-0', 'cell-4', 'cell-8'], ['cell-2', 'cell-4', 'cell-6']
];

// -- Core Functions --

/**
 * Handles clicks on the Tic Tac Toe cells.
 * @param {string} cellId - The ID of the clicked cell (e.g., "cell-0").
 */
function cellClicked(cellId) {
    // Check if the cell is already taken or if the game is inactive
    const isCellTaken = gameBoardState.some(move => move.startsWith(cellId));
    if (!isGameActive || isCellTaken) {
        return; // Do nothing if cell taken or game over
    }

    // Update the visual board
    const cellElement = document.getElementById(cellId);
    let imageUrl;
    if (currentPlayer === PLAYER_X) {
        imageUrl = 'https://media.geeksforgeeks.org/wp-content/uploads/20201230114437/x.png';
    } else { // currentPlayer is PLAYER_O
        imageUrl = 'https://media.geeksforgeeks.org/wp-content/uploads/20201230114434/o-300x300.png';
    }    
    cellElement.style.backgroundImage = `url("${imagePath}")`;

    // Record the move
    gameBoardState.push(cellId + currentPlayer);

    // Play sound effect
    playSound('./media/place.mp3');

    // Check if the current move resulted in a win or tie
    if (checkForWinner()) {
        endGame(false); // Win condition met
    } else if (gameBoardState.length === 9) {
        endGame(true); // Tie condition met
    } else {
        // Switch player and potentially trigger AI move
        switchPlayer();
    }
}

/**
 * Switches the current player and triggers the AI if it's O's turn.
 */
function switchPlayer() {
    currentPlayer = (currentPlayer === PLAYER_X) ? PLAYER_O : PLAYER_X;

    if (currentPlayer === PLAYER_O && isGameActive) {
        disableBoardInteraction();
        // Delay AI move slightly for better UX
        setTimeout(executeAiMove, 750); // Adjusted delay
    }
}

/**
 * Executes the AI's (computer's) move. Picks a random available cell.
 */
function executeAiMove() {
    let availableCells = [];
    for (let i = 0; i < 9; i++) {
        const cellId = `cell-${i}`;
        if (!gameBoardState.some(move => move.startsWith(cellId))) {
            availableCells.push(cellId);
        }
    }

    // Pick a random available cell
    if (availableCells.length > 0) {
        const randomChoice = Math.floor(Math.random() * availableCells.length);
        const chosenCellId = availableCells[randomChoice];
        cellClicked(chosenCellId); // AI makes its move
    }
     enableBoardInteraction(); // Re-enable after AI move is processed via cellClicked
}

/**
 * Checks if the current board state matches any winning combination.
 * @returns {boolean} - True if a winner is found, false otherwise.
 */
function checkForWinner() {
    for (const combination of WINNING_COMBINATIONS) {
        const [cellA, cellB, cellC] = combination;
        if (isWinningCombo(cellA, cellB, cellC)) {
            // Found a winner, determine the winning line coordinates
             const lineCoords = getLineCoordinates(combination);
             if (lineCoords) {
                 startWinAnimation(lineCoords.x1, lineCoords.y1, lineCoords.x2, lineCoords.y2);
             }
            return true;
        }
    }
    return false;
}

/**
 * Helper function to check if three specific cells form a winning line for the current player.
 * @param {string} idA - Cell ID 1
 * @param {string} idB - Cell ID 2
 * @param {string} idC - Cell ID 3
 * @returns {boolean} - True if it's a winning combination.
 */
function isWinningCombo(idA, idB, idC) {
    const checkA = gameBoardState.includes(idA + currentPlayer);
    const checkB = gameBoardState.includes(idB + currentPlayer);
    const checkC = gameBoardState.includes(idC + currentPlayer);
    return checkA && checkB && checkC;
}


/**
 * Finalizes the game state, displays messages, and triggers reset.
 * @param {boolean} isTie - Indicates if the game ended in a tie.
 */
function endGame(isTie) {
    isGameActive = false; // Stop further moves
    disableBoardInteraction(); // Prevent clicks during reset delay

    if (isTie) {
        playSound('./media/tie.mp3');
        // Optionally display a tie message
        console.log("Game Over: It's a tie!");
    } else {
        playSound('./media/winGame.mp3');
        // Optionally display a win message
        console.log(`Game Over: Player ${currentPlayer} wins!`);
    }

    // Reset the game after a delay
    setTimeout(resetGameBoard, 1500); // Increased delay to see win line
}

/**
 * Resets the game board to its initial state.
 */
function resetGameBoard() {
    // Clear board state array
    gameBoardState = [];
    // Reset current player to X
    currentPlayer = PLAYER_X;
    // Clear visual board
    for (let i = 0; i < 9; i++) {
        const cell = document.getElementById(`cell-${i}`);
        cell.style.backgroundImage = '';
    }
    // Clear the winning line canvas
    clearCanvas();
    // Re-enable interactions
    isGameActive = true;
     enableBoardInteraction();
    console.log("Game reset.");
}

// -- Utility Functions --

/**
 * Plays an audio file.
 * @param {string} audioPath - The path to the audio file.
 */
function playSound(audioPath) {
    try {
        let sound = new Audio(audioPath);
        sound.play();
    } catch (error) {
        console.error("Error playing sound:", audioPath, error);
    }
}

/**
 * Temporarily disables user clicks on the game board.
 */
function disableBoardInteraction() {
    gameBody.style.pointerEvents = 'none';
}

/**
 * Re-enables user clicks on the game board.
 */
function enableBoardInteraction() {
    gameBody.style.pointerEvents = 'auto';
}

/**
 * Clears the entire canvas used for the winning line.
 */
function clearCanvas() {
    canvasContext.clearRect(0, 0, winIndicatorCanvas.width, winIndicatorCanvas.height);
}

// -- Win Line Animation --
let animationFrameId = null; // Store the animation frame request ID

/**
 * Initiates the drawing animation for the winning line.
 * @param {number} xStart - Starting X coordinate.
 * @param {number} yStart - Starting Y coordinate.
 * @param {number} xEnd - Ending X coordinate.
 * @param {number} yEnd - Ending Y coordinate.
 */
function startWinAnimation(xStart, yStart, xEnd, yEnd) {
    clearCanvas(); // Clear previous drawings if any
    let currentX = xStart;
    let currentY = yStart;
    const deltaX = (xEnd - xStart) / 10; // Adjust speed/steps here
    const deltaY = (yEnd - yStart) / 10; // Adjust speed/steps here
    let step = 0;

    function drawStep() {
        if (step >= 10) { // Animation complete
             // Draw final full line to ensure it's solid
             canvasContext.beginPath();
             canvasContext.moveTo(xStart, yStart);
             canvasContext.lineTo(xEnd, yEnd);
             canvasContext.lineWidth = 10;
             canvasContext.strokeStyle = 'rgba(70, 255, 33, 0.9)'; // Slightly adjusted color/opacity
             canvasContext.stroke();
            cancelAnimationFrame(animationFrameId);
            return;
        }

        currentX += deltaX;
        currentY += deltaY;

        canvasContext.beginPath();
        canvasContext.moveTo(xStart, yStart);
        canvasContext.lineTo(currentX, currentY);
        canvasContext.lineWidth = 10;
        canvasContext.strokeStyle = 'rgba(70, 255, 33, 0.9)';
        canvasContext.stroke();

        step++;
        animationFrameId = requestAnimationFrame(drawStep);
    }

    // Cancel any previous animation loop before starting a new one
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    animationFrameId = requestAnimationFrame(drawStep);
}


/**
 * Determines the start and end coordinates for drawing the win line based on the winning combination.
 * @param {string[]} winningCombo - Array of the three winning cell IDs (e.g., ['cell-0', 'cell-1', 'cell-2']).
 * @returns {object|null} - Object with {x1, y1, x2, y2} or null if combo is not recognized.
 */
 function getLineCoordinates(winningCombo) {
    const comboStr = winningCombo.sort().join('-'); // Create a consistent key, e.g., "cell-0-cell-1-cell-2"

    // Define coordinates for each winning line (adjust if cell size/padding changes)
    // Cell centers: (100, 100), (304, 100), (508, 100)
    //              (100, 304), (304, 304), (508, 304)
    //              (100, 508), (304, 508), (508, 508)
    // Line start/end points should extend slightly beyond centers for better visuals

    const lineMappings = {
        // Rows
        'cell-0-cell-1-cell-2': { x1: 50, y1: 102, x2: 558, y2: 102 }, // Row 1 (Adjusted Y slightly)
        'cell-3-cell-4-cell-5': { x1: 50, y1: 304, x2: 558, y2: 304 }, // Row 2
        'cell-6-cell-7-cell-8': { x1: 50, y1: 506, x2: 558, y2: 506 }, // Row 3 (Adjusted Y slightly)
        // Columns
        'cell-0-cell-3-cell-6': { x1: 102, y1: 50, x2: 102, y2: 558 }, // Col 1 (Adjusted X slightly)
        'cell-1-cell-4-cell-7': { x1: 304, y1: 50, x2: 304, y2: 558 }, // Col 2
        'cell-2-cell-5-cell-8': { x1: 506, y1: 50, x2: 506, y2: 558 }, // Col 3 (Adjusted X slightly)
        // Diagonals
        'cell-0-cell-4-cell-8': { x1: 80, y1: 80, x2: 528, y2: 528 }, // Diagonal TL-BR (Adjusted coords)
        'cell-2-cell-4-cell-6': { x1: 528, y1: 80, x2: 80, y2: 528 }  // Diagonal TR-BL (Adjusted coords)
    };

    return lineMappings[comboStr] || null; // Return coordinates or null if combo not found
}


// -- Initial Setup -- (Optional: could add initialization logic if needed)
console.log("Tic Tac Toe game initialized.");
enableBoardInteraction(); // Ensure board is interactive on load
