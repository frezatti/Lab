const num1Input = document.getElementById('num1');
const num2Input = document.getElementById('num2');
const arithmeticOperator = document.getElementById('opAritmetico');
const arithmeticResult = document.getElementById('resultado');

const logicInput1 = document.getElementById("op1");
const logicInput2 = document.getElementById("op2");
const logicOperator = document.getElementById("opLogico");
const logicResult = document.getElementById("resultadoLog");

/**
 * @param {string} operator - The arithmetic operator (+, -, *, /)
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number|string} The calculation result or error message
 */
function performArithmeticCalculation(operator, a, b) {
    // Check if inputs are valid numbers
    if (isNaN(a) || isNaN(b)) {
        return 'Please enter valid numbers';
    }

    switch (operator) {
        case '+':
            return a + b;
        case '-':
            return a - b;
        case '*':
            return a * b;
        case '/':
            return b === 0 ? 'Cannot divide by zero' : a / b;
        default:
            return 'Invalid operation';
    }
}

function updateArithmeticResult() {
    const value1 = Number(num1Input.value);
    const value2 = Number(num2Input.value);
    const operator = arithmeticOperator.value;

    arithmeticResult.textContent = performArithmeticCalculation(operator, value1, value2);
}
num1Input.addEventListener('input', updateArithmeticResult);
num2Input.addEventListener('input', updateArithmeticResult);
arithmeticOperator.addEventListener('change', updateArithmeticResult);

/**
 * Performs logical (bitwise) calculations
 * @param {string} operator - The logical operator (& or |)
 * @param {number} a - First operand
 * @param {number} b - Second operand
 * @returns {number|string} The calculation result or error message
 */
function performLogicalCalculation(operator, a, b) {
    a = parseInt(a) || 0;
    b = parseInt(b) || 0;

    switch (operator) {
        case '&':
            return a & b;
        case '|':
            return a | b;
        default:
            return 'Invalid operation';
    }
}

function updateLogicalResult() {
    const value1 = logicInput1.value;
    const value2 = logicInput2.value;
    const operator = logicOperator.value;

    logicResult.textContent = performLogicalCalculation(operator, value1, value2);
}

logicInput1.addEventListener('input', updateLogicalResult);
logicInput2.addEventListener('input', updateLogicalResult);
logicOperator.addEventListener('change', updateLogicalResult);

updateArithmeticResult();
updateLogicalResult();
