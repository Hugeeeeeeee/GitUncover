// Example file to demonstrate GitUncover

/**
 * Calculate the factorial of a number
 * @param {number} n - The number to calculate factorial for
 * @returns {number} The factorial of n
 */
function factorial(n) {
  // Base case
  if (n === 0 || n === 1) {
    return 1;
  }
  
  // Recursive case
  return n * factorial(n - 1);
}

/**
 * Calculate the Fibonacci sequence up to n terms
 * @param {number} n - The number of terms to calculate
 * @returns {Array} The Fibonacci sequence
 */
function fibonacci(n) {
  const sequence = [0, 1];
  
  // Calculate up to n terms
  for (let i = 2; i < n; i++) {
    sequence.push(sequence[i - 1] + sequence[i - 2]);
  }
  
  return sequence;
}

// Example usage
console.log('Factorial of 5:', factorial(5));
console.log('Fibonacci sequence (10 terms):', fibonacci(10));

/**
 * This function was added to fix a bug where negative numbers would cause infinite recursion
 * @param {number} n - The number to calculate factorial for
 * @returns {number} The factorial of n, or 1 for negative numbers
 */
function safeFactorial(n) {
  // Handle negative numbers
  if (n < 0) {
    return 1;
  }
  
  // Base case
  if (n === 0 || n === 1) {
    return 1;
  }
  
  // Recursive case
  return n * safeFactorial(n - 1);
}

// Example usage
console.log('Safe factorial of -5:', safeFactorial(-5));
console.log('Safe factorial of 5:', safeFactorial(5));