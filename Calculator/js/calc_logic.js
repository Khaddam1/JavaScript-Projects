// --- Calculator State Object ---
const calculatorState = {
    displayValue: '0',        // Value shown on the display
    firstOperand: null,       // Stores the first operand for calculations
    waitingForSecondOperand: false, // True if we expect the next input to be the second operand
    operator: null            // Stores the pending operator (+, -, *, /)
};

// --- DOM Elements ---
const displayElement = document.querySelector('.calc-display-area');
const keypadElement = document.querySelector('.keypad');

// --- Core Functions ---

/**
 * Updates the calculator display with the current value.
 */
function updateDisplay() {
    displayElement.value = calculatorState.displayValue;
}

/**
 * Handles input of digit buttons (0-9).
 * @param {string} digit - The digit pressed.
 */
function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculatorState;

    if (waitingForSecondOperand === true) {
        // Start new display value if waiting for the second operand
        calculatorState.displayValue = digit;
        calculatorState.waitingForSecondOperand = false;
    } else {
        // Overwrite '0' or append digit
        calculatorState.displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
    console.log("State after digit input:", calculatorState); // Debugging log
}

/**
 * Handles input of the decimal point.
 */
function inputDecimal() {
    // If waiting for second operand, start display with "0."
    if (calculatorState.waitingForSecondOperand === true) {
        calculatorState.displayValue = '0.';
        calculatorState.waitingForSecondOperand = false;
        return;
    }

    // Prevent multiple decimal points
    if (!calculatorState.displayValue.includes('.')) {
        calculatorState.displayValue += '.';
    }
    console.log("State after decimal input:", calculatorState); // Debugging log
}

/**
 * Handles operator button clicks (+, -, *, /).
 * @param {string} nextOperator - The operator pressed.
 */
function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator } = calculatorState;
    const inputValue = parseFloat(displayValue); // Convert current display to a number

    // If an operator is already pending and waiting for second operand, just update the operator
    if (operator && calculatorState.waitingForSecondOperand) {
        calculatorState.operator = nextOperator;
        console.log("Operator updated:", calculatorState); // Debugging log
        return;
    }

    // Store the first operand if it's not already set
    if (firstOperand === null && !isNaN(inputValue)) {
        calculatorState.firstOperand = inputValue;
    } else if (operator) {
        // Perform calculation if an operator already exists
        const currentValue = firstOperand || 0; // Use 0 if firstOperand is somehow null
        const result = performCalculation(currentValue, inputValue, operator);

        // Format result (limit decimals, remove trailing zeros)
        const formattedResult = parseFloat(result.toFixed(7)).toString();
        calculatorState.displayValue = formattedResult;
        calculatorState.firstOperand = parseFloat(formattedResult); // Store result as new first operand
    }

    // Prepare for the next operand
    calculatorState.waitingForSecondOperand = true;
    calculatorState.operator = nextOperator;
    console.log("State after operator handling:", calculatorState); // Debugging log
}

/**
 * Performs the calculation based on the operator.
 * @param {number} operand1 - The first operand.
 * @param {number} operand2 - The second operand.
 * @param {string} op - The operator ('+', '-', '*', '/').
 * @returns {number} - The result of the calculation.
 */
function performCalculation(operand1, operand2, op) {
    switch (op) {
        case '+': return operand1 + operand2;
        case '-': return operand1 - operand2;
        case '*': return operand1 * operand2;
        case '/': return operand1 / operand2;
        default: return operand2; // Default for '=' if pressed initially
    }
}

/**
 * Resets the calculator to its initial state.
 */
function resetCalculator() {
    calculatorState.displayValue = '0';
    calculatorState.firstOperand = null;
    calculatorState.waitingForSecondOperand = false;
    calculatorState.operator = null;
    console.log("Calculator reset:", calculatorState); // Debugging log
}

// --- Event Listener ---

keypadElement.addEventListener('click', (event) => {
    const target = event.target; // The clicked element

    // Exit if the click wasn't on a button
    if (!target.matches('button.key')) {
        return;
    }

    const keyValue = target.value; // The value attribute of the button
    const action = target.dataset.action; // Get data-action attribute

    // Determine action based on button class or data-action
    if (target.classList.contains('key-digit')) {
        inputDigit(keyValue);
    } else if (action === 'decimal') {
        inputDecimal();
    } else if (action === 'clear') {
        resetCalculator();
    } else if (target.classList.contains('key-operator')) {
        handleOperator(keyValue);
    }
    /* Removed explicit check for 'calculate' action - '=' operator is handled by handleOperator */

    // Update the display after every button press
    updateDisplay();
});

// --- Initial Setup ---
updateDisplay(); // Initialize display on page load
