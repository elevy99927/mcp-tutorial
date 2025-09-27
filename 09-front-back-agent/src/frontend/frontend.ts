import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files
app.use(express.static(__dirname));

// Serve the main HTML page
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MCP Tutorial - Frontend Backend Communication</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            text-align: center;
            margin-bottom: 30px;
        }
        .form-section {
            margin-bottom: 30px;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        .form-section h2 {
            margin-top: 0;
            color: #555;
        }
        .form-group {
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        input[type="text"], input[type="password"] {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        button {
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            margin-right: 10px;
        }
        button:hover {
            background-color: #0056b3;
        }
        .message {
            padding: 10px;
            margin: 10px 0;
            border-radius: 4px;
        }
        .success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .users-list {
            margin-top: 20px;
        }
        .user-item {
            padding: 10px;
            margin: 5px 0;
            background-color: #f8f9fa;
            border-radius: 4px;
            border-left: 4px solid #007bff;
        }
        .current-user {
            background-color: #e7f3ff;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>MCP Tutorial - Chapter 09: Frontend ↔ Backend Communication</h1>
        
        <!-- Current User Display -->
        <div id="currentUser" class="current-user" style="display: none;">
            <h3>Current User</h3>
            <div id="userInfo"></div>
            <button onclick="logout()">Logout</button>
        </div>

        <!-- Registration Form -->
        <div class="form-section">
            <h2>User Registration</h2>
            <div class="form-group">
                <label for="regUsername">Username:</label>
                <input type="text" id="regUsername" placeholder="Enter username (min 3 chars)">
            </div>
            <div class="form-group">
                <label for="regPassword">Password:</label>
                <input type="password" id="regPassword" placeholder="Enter password (min 6 chars)">
            </div>
            <button onclick="register()">Register</button>
            <div id="registerMessage"></div>
        </div>

        <!-- Login Form -->
        <div class="form-section">
            <h2>User Login</h2>
            <div class="form-group">
                <label for="loginUsername">Username:</label>
                <input type="text" id="loginUsername" placeholder="Enter username">
            </div>
            <div class="form-group">
                <label for="loginPassword">Password:</label>
                <input type="password" id="loginPassword" placeholder="Enter password">
            </div>
            <button onclick="login()">Login</button>
            <div id="loginMessage"></div>
        </div>

        <!-- Users List -->
        <div class="form-section">
            <h2>All Users</h2>
            <button onclick="loadUsers()">Load Users</button>
            <button onclick="getCurrentUser()">Get Current User</button>
            <div id="usersList" class="users-list"></div>
        </div>
    </div>

    <script>
        const API_BASE = 'http://localhost:3001';
        let currentSessionId = null;

        function showMessage(elementId, message, isError = false) {
            const element = document.getElementById(elementId);
            element.innerHTML = \`<div class="message \${isError ? 'error' : 'success'}">\${message}</div>\`;
            setTimeout(() => element.innerHTML = '', 5000);
        }

        async function register() {
            const username = document.getElementById('regUsername').value;
            const password = document.getElementById('regPassword').value;

            if (!username || !password) {
                showMessage('registerMessage', 'Please fill in all fields', true);
                return;
            }

            try {
                const response = await fetch(\`\${API_BASE}/api/users\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (response.ok) {
                    showMessage('registerMessage', \`User \${data.user.username} created successfully!\`);
                    document.getElementById('regUsername').value = '';
                    document.getElementById('regPassword').value = '';
                } else {
                    showMessage('registerMessage', data.error, true);
                }
            } catch (error) {
                showMessage('registerMessage', 'Network error: ' + error.message, true);
            }
        }

        async function login() {
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;

            if (!username || !password) {
                showMessage('loginMessage', 'Please fill in all fields', true);
                return;
            }

            try {
                const response = await fetch(\`\${API_BASE}/api/auth/login\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (response.ok) {
                    currentSessionId = data.sessionId;
                    showMessage('loginMessage', \`Welcome \${data.user.username}!\`);
                    document.getElementById('loginUsername').value = '';
                    document.getElementById('loginPassword').value = '';
                    
                    // Show current user info
                    document.getElementById('currentUser').style.display = 'block';
                    document.getElementById('userInfo').innerHTML = \`
                        <strong>Username:</strong> \${data.user.username}<br>
                        <strong>ID:</strong> \${data.user.id}<br>
                        <strong>Created:</strong> \${new Date(data.user.createdAt).toLocaleString()}
                    \`;
                } else {
                    showMessage('loginMessage', data.error, true);
                }
            } catch (error) {
                showMessage('loginMessage', 'Network error: ' + error.message, true);
            }
        }

        async function getCurrentUser() {
            if (!currentSessionId) {
                showMessage('usersList', 'Please login first', true);
                return;
            }

            try {
                const response = await fetch(\`\${API_BASE}/api/auth/me\`, {
                    headers: { 'Authorization': \`Bearer \${currentSessionId}\` }
                });

                const data = await response.json();

                if (response.ok) {
                    document.getElementById('usersList').innerHTML = \`
                        <h3>Current User Info:</h3>
                        <div class="user-item">
                            <strong>\${data.user.username}</strong> (ID: \${data.user.id})<br>
                            Created: \${new Date(data.user.createdAt).toLocaleString()}
                        </div>
                    \`;
                } else {
                    showMessage('usersList', data.error, true);
                }
            } catch (error) {
                showMessage('usersList', 'Network error: ' + error.message, true);
            }
        }

        async function loadUsers() {
            try {
                const response = await fetch(\`\${API_BASE}/api/users\`);
                const data = await response.json();

                if (response.ok) {
                    let html = \`<h3>All Users (\${data.count}):</h3>\`;
                    if (data.users.length === 0) {
                        html += '<p>No users found. Register some users first!</p>';
                    } else {
                        data.users.forEach(user => {
                            html += \`
                                <div class="user-item">
                                    <strong>\${user.username}</strong> (ID: \${user.id})<br>
                                    Password: \${user.password}<br>
                                    Created: \${new Date(user.createdAt).toLocaleString()}
                                </div>
                            \`;
                        });
                    }
                    document.getElementById('usersList').innerHTML = html;
                } else {
                    showMessage('usersList', 'Failed to load users', true);
                }
            } catch (error) {
                showMessage('usersList', 'Network error: ' + error.message, true);
            }
        }

        function logout() {
            currentSessionId = null;
            document.getElementById('currentUser').style.display = 'none';
            document.getElementById('userInfo').innerHTML = '';
            showMessage('loginMessage', 'Logged out successfully');
        }
    </script>
</body>
</html>
  `);
});

app.listen(PORT, () => {
  console.log(`🚀 Frontend server running on http://localhost:${PORT}`);
});

export default app;