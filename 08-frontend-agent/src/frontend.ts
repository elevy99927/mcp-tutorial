// Auto generated sample file for Frontend Agent

import { add, multiply, divide, subtract, power } from './math.js';

/** User interface for login form */
export interface LoginForm {
  username: string;
  password: string;
}

/** User authentication result */
export interface AuthResult {
  success: boolean;
  message: string;
  user?: {
    username: string;
  };
}

/** greet: pure function */
export function greet(name: string) {
  return `hello, ${name}`;
}

/** capitalize: pure function */
export function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/** validateUsername: username validation function */
export function validateUsername(username: string): boolean {
  return username.length >= 3 && username.length <= 20;
}

/** validatePassword: password validation function */
export function validatePassword(password: string): boolean {
  return password.length >= 6;
}

/** validateLoginForm: basic form validation */
export function validateLoginForm(form: LoginForm): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!validateUsername(form.username)) {
    errors.push('Username must be between 3 and 20 characters');
  }
  
  if (!validatePassword(form.password)) {
    errors.push('Password must be at least 6 characters');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/** authenticateUser: mock authentication function */
export function authenticateUser(form: LoginForm): AuthResult {
  const validation = validateLoginForm(form);
  
  if (!validation.valid) {
    return {
      success: false,
      message: `Validation failed: ${validation.errors.join(', ')}`
    };
  }
  
  // Mock authentication logic
  if (form.username === 'admin' && form.password === 'password123') {
    return {
      success: true,
      message: 'Login successful!',
      user: {
        username: form.username
      }
    };
  }
  
  return {
    success: false,
    message: 'Invalid username or password'
  };
}

// Demo usage
console.log(greet("Frontend Agent"));

// Demo login form
const demoForm: LoginForm = {
  username: "admin",
  password: "password123"
};

console.log("Demo login:", authenticateUser(demoForm));