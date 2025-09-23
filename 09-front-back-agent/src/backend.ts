// Backend API Server
// Express REST API with authentication and user management

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Allow frontend
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== DATA MODELS =====

interface User {
  id: string;
  username: string;
  password: string; // In production, this would be hashed
  createdAt: Date;
}

interface LoginRequest {
  username: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    username: string;
  };
}

// ===== IN-MEMORY DATABASE =====

const users: User[] = [
  {
    id: '1',
    username: 'admin',
    password: '123456', // In production: hash this
    createdAt: new Date()
  }
];

// ===== VALIDATION FUNCTIONS =====

function validateUsername(username: string): boolean {
  return username && username.length >= 3 && username.length <= 20;
}

function validatePassword(password: string): boolean {
  return password && password.length >= 6;
}



// ===== AUTHENTICATION LOGIC =====

function findUser(username: string): User | undefined {
  return users.find(user => user.username === username);
}

function authenticateUser(loginData: LoginRequest): AuthResponse {
  const errors: string[] = [];

  // Validate input
  if (!validateUsername(loginData.username || '')) {
    errors.push('Username must be between 3 and 20 characters');
  }

  if (!validatePassword(loginData.password || '')) {
    errors.push('Password must be at least 6 characters');
  }

  if (errors.length > 0) {
    return {
      success: false,
      message: `Validation failed: ${errors.join(', ')}`
    };
  }

  // Find user
  const user = findUser(loginData.username);
  if (!user || user.password !== loginData.password) {
    return {
      success: false,
      message: 'Invalid username or password'
    };
  }

  return {
    success: true,
    message: 'Login successful',
    user: {
      id: user.id,
      username: user.username
    }
  };
}

// ===== MIDDLEWARE =====

// Simple authentication check (no tokens needed for this tutorial)
function requireAuth(req: any, res: any, next: any) {
  // For this tutorial, we'll skip authentication middleware
  // In production, you would verify JWT tokens here
  next();
}

// ===== API ROUTES =====

// Root endpoint - lists all available endpoints
app.get('/', (req, res) => {
  const endpoints = [
    {
      method: 'GET',
      path: '/',
      description: 'List all available API endpoints'
    },
    {
      method: 'GET',
      path: '/api/health',
      description: 'Health check endpoint'
    },
    {
      method: 'POST',
      path: '/api/auth/login',
      description: 'User authentication',
      body: { username: 'string', password: 'string' }
    },
    {
      method: 'GET',
      path: '/api/users',
      description: 'Get list of all users'
    },
    {
      method: 'POST',
      path: '/api/users',
      description: 'Create new user (registration)',
      body: { username: 'string', password: 'string' }
    }
  ];

  res.json({
    service: 'Backend API Server',
    version: '1.0.0',
    port: PORT,
    timestamp: new Date().toISOString(),
    endpoints: endpoints,
    usage: {
      frontend: 'http://localhost:3000',
      health: `http://localhost:${PORT}/api/health`,
      users: `http://localhost:${PORT}/api/users`
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'backend-api',
    version: '1.0.0'
  });
});

// Authentication endpoint
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  const loginData: LoginRequest = {
    username: username || '',
    password: password || ''
  };

  const result = authenticateUser(loginData);

  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
});

// Get all users (simple route for tutorial)
app.get('/api/users', (req, res) => {
  const userList = users.map(user => ({
    id: user.id,
    username: user.username,
    createdAt: user.createdAt
  }));

  res.json({
    users: userList,
    total: userList.length
  });
});

// Create new user (registration)
app.post('/api/users', (req, res) => {
  const { username, password } = req.body;

  // Validate input
  const errors: string[] = [];

  if (!validateUsername(username || '')) {
    errors.push('Username must be between 3 and 20 characters');
  }

  if (!validatePassword(password || '')) {
    errors.push('Password must be at least 6 characters');
  }

  // Check if user already exists
  if (findUser(username)) {
    errors.push('Username already exists');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Registration failed: ${errors.join(', ')}`
    });
  }

  // Create new user
  const newUser: User = {
    id: (users.length + 1).toString(),
    username,
    password, // In production: hash this
    createdAt: new Date()
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    user: {
      id: newUser.id,
      username: newUser.username
    }
  });
});

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Backend error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend API Server started!`);
  console.log(`API: http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
  console.log(`Available endpoints:`);
  console.log(`  POST /api/auth/login - User authentication`);
  console.log(`  GET  /api/auth/me - Get current user`);
  console.log(`  GET  /api/users - List all users`);
  console.log(`  POST /api/users - Create new user`);
});

// Demo usage
console.log('Backend API initialized');
console.log('Ready to accept requests from frontend on port 3000');