import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Simple in-memory storage
interface User {
  id: string;
  username: string;
  password: string;
  createdAt: Date;
}

const users: User[] = [];
const sessions: { [sessionId: string]: string } = {};
let userIdCounter = 1;
let sessionIdCounter = 1;

// POST /api/auth/login - User authentication
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const sessionId = `session_${sessionIdCounter++}`;
  sessions[sessionId] = user.id;

  res.json({
    message: 'Login successful',
    user: { id: user.id, username: user.username, createdAt: user.createdAt },
    sessionId
  });
});

// GET /api/auth/me - Get current user
app.get('/api/auth/me', (req, res) => {
  const sessionId = req.headers.authorization?.replace('Bearer ', '');
  
  if (!sessionId || !sessions[sessionId]) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const userId = sessions[sessionId];
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    user: { id: user.id, username: user.username, createdAt: user.createdAt }
  });
});

// GET /api/users - List all users
app.get('/api/users', (req, res) => {
  const userList = users.map(user => ({
    id: user.id,
    username: user.username,
    password: user.password,
    createdAt: user.createdAt
  }));

  res.json({ users: userList, count: userList.length });
});

// POST /api/users - Create new user
app.post('/api/users', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  if (username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    return res.status(409).json({ error: 'Username already exists' });
  }

  const newUser: User = {
    id: userIdCounter.toString(),
    username,
    password,
    createdAt: new Date()
  };

  users.push(newUser);
  userIdCounter++;

  res.status(201).json({
    message: 'User created successfully',
    user: { id: newUser.id, username: newUser.username, createdAt: newUser.createdAt }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});

export default app;