/** add: pure function */
export function add(a: number, b: number) {
  return a + b;
}

/** subtract: pure function */
export function subtract(a: number, b: number) {
  return a - b;
}

/** multiply: pure function */
export function multiply(x: number, y: number) {
  return x * y;
}

/** divide: pure function with zero check */
export function divide(a: number, b: number) {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
}

/** power: pure function */
export function power(base: number, exponent: number) {
  return Math.pow(base, exponent);
}