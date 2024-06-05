const ROWS = 3; // Number of rows in the slot machine
const COLS = 3; // Number of columns in the slot machine

// Symbols and their respective counts in the slot machine
const SYMBOLS_COUNT = {
    "A": 2,
    "B": 4,
    "C": 6,
    "D": 8
};

// Multiplier values for each symbol
const SYMBOLS_VALUES = {
    "A": 5,
    "B": 4,
    "C": 3,
    "D": 2
};

let balance = 0;
let numberOfLines = 0;
let betAmount = 0;

// Update the balance display
const updateBalance = () => {
    document.getElementById("balance").textContent = "Balance: $" + balance.toString();
};

// Deposit some money
const deposit = () => {
    const depositAmount = parseFloat(document.getElementById("deposit").value);
    if (isNaN(depositAmount) || depositAmount <= 0) {
        alert("Invalid deposit amount, try again.");
    } else {
        balance += depositAmount;
        updateBalance();
        document.getElementById("deposit").value = "";
    }
};

// Determine the number of lines to bet on
const setLines = () => {
    const lines = parseInt(document.getElementById("lines").value);
    if (isNaN(lines) || lines <= 0 || lines > 3) {
        alert("Invalid input, try again.");
    } else {
        numberOfLines = lines;
        document.getElementById("lines").value = "";
    }
};

// Collect the bet amount
const placeBet = () => {
    const bet = parseFloat(document.getElementById("bet").value);
    if (isNaN(bet) || bet <= 0 || bet > balance / numberOfLines) {
        alert("Invalid bet amount, try again.");
    } else {
        betAmount = bet;
        balance -= betAmount * numberOfLines;
        updateBalance();
        document.getElementById("bet").value = "";
        spin();
    }
};

// Spin the slot machine
const spin = () => {
    const symbols = []; // Contains all available symbols
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol); // Add symbols to the array based on their count
        }
    }

    const reels = [];
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length); // Select a random symbol
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol); // Add selected symbol to the reel
            reelSymbols.splice(randomIndex, 1); // Remove selected symbol from the array
        }
    }
    const rows = transpose(reels);
    printRows(rows);
    const winnings = getWinnings(rows);
    balance += winnings;
    updateBalance();
    document.getElementById("result").textContent = winnings > 0 ? "You won, $" + winnings.toString() : "You lost!";
    document.getElementById("play-again").style.display = "block";
};

// Transpose the reels to get rows
const transpose = (reels) => {
    const rows = [];
    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i]); // Transpose the reels to get rows
        }
    }
    return rows;
};

// Print the rows of the slot machine
const printRows = (rows) => {
    for (let i = 0; i < COLS; i++) {
        document.getElementById(`reel-${i + 1}`).textContent = "";
    }
    rows.forEach((row, rowIndex) => {
        row.forEach((symbol, colIndex) => {
            const reel = document.getElementById(`reel-${colIndex + 1}`);
            reel.textContent += symbol + (rowIndex < ROWS - 1 ? "\n" : ""); // Separate symbols with a line break, except the last one
        });
    });
};

// Check if the user won
const getWinnings = (rows) => {
    let winnings = 0;
    for (let row = 0; row < numberOfLines; row++) {
        const symbols = rows[row];
        let allSame = true;
        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                allSame = false;
                break;
            }
        }
        if (allSame) {
            winnings += betAmount * SYMBOLS_VALUES[symbols[0]]; // Calculate winnings based on matched symbols
        }
    }
    return winnings;
};

// Reset the game for playing again
const playAgain = () => {
    document.getElementById("play-again").style.display = "none";
    document.getElementById("result").textContent = "";
    document.getElementById("reel-1").textContent = "";
    document.getElementById("reel-2").textContent = "";
    document.getElementById("reel-3").textContent = "";
};
