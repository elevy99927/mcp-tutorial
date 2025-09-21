// Auto generated sample file for Orchestrated Agent

import { add, multiply, divide, subtract, power } from './math.js';

/** greet: pure function */
export function greet(name: string) {
  return `hello, ${name}`;
}

/** capitalize: pure function */
export function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/** formatMessage: combines greeting and capitalization */
export function formatMessage(name: string, message: string) {
  const greeting = greet(name);
  const formattedMessage = capitalize(message);
  return `${greeting}! ${formattedMessage}`;
}

/** processData: uses multiple math functions */
export function processData(x: number, y: number) {
  const sum = add(x, y);
  const product = multiply(x, y);
  const difference = subtract(x, y);
  const ratio = divide(product, sum);
  return { sum, product, difference, ratio };
}

/** calculateStats: advanced data processing */
export function calculateStats(numbers: number[]) {
  if (numbers.length === 0) return null;

  const sum = numbers.reduce((acc, num) => add(acc, num), 0);
  const average = divide(sum, numbers.length);
  const squares = numbers.map(num => power(num, 2));
  const sumOfSquares = squares.reduce((acc, square) => add(acc, square), 0);

  return {
    count: numbers.length,
    sum,
    average,
    sumOfSquares
  };
}

/** validateAndProcess: combines validation with processing */
export function validateAndProcess(data: { name: string; values: number[] }) {
  if (!data.name || data.name.trim().length === 0) {
    throw new Error('Name is required');
  }

  if (!data.values || data.values.length === 0) {
    throw new Error('Values array cannot be empty');
  }

  const greeting = formatMessage(data.name, 'welcome to data processing');
  const stats = calculateStats(data.values);

  return {
    greeting,
    stats,
    processed: true
  };
}

// Demo usage
console.log(greet("Orchestrated Agent"));
console.log(formatMessage("user", "data processing complete"));
console.log(calculateStats([1, 2, 3, 4, 5]));
console.log(validateAndProcess({
  name: "TestUser",
  values: [10, 20, 30]
}));