/** add: pure function */
export function add(a: number, b: number) {
  return a + b;
}

/** sum: pure function (alias for add) */
export function sum(x: number, y: number) {
  return x + y;
}

/** multiply: pure function */
export function multiply(x: number, y: number) {
  return x * y;
}

/** subtract: pure function */
export function subtract(a: number, b: number) {
  return a - b;
}

/** divide: pure function with zero check */
export function divide(a: number, b: number) {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
}

/** greet: pure function */
export function greet(name: string) {
  return `hello, ${name}`;
}

/** capitalize: pure function */
export function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

// Manual execution during development (doesn't affect tests)
console.log(greet("Hello Test"));
console.log(`sum(2, 3) = ${sum(2, 3)}`);
console.log(`multiply(4, 5) = ${multiply(4, 5)}`);