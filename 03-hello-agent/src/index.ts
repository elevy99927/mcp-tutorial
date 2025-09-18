export function hello(name: string) {
  return `hello, ${name}`;
}

export function greet(name: string, greeting = 'Hello'): string {
  if (!name) {
    throw new Error('Name is required');
  }
  return `${greeting}, ${name}!`;
}

export function formatMessage(message: string, author: string): string {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] ${author}: ${message}`;
}

// Demo usage
console.log(hello("KIRO + MCP"));
console.log(greet("Agent", "Hi"));
console.log(formatMessage("Linting agent is ready!", "System"));