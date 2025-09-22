// Frontend Agent - Complete Login Server
// Single file that runs as Node.js server on port 3000

import express from 'express';

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== BUSINESS LOGIC =====

interface LoginForm {
  username: string;
  password: string;
}

interface AuthResult {
  success: boolean;
  message: string;
  user?: {
    username: string;
  };
}

function validateUsername(username: string): boolean {
  return username.length >= 3 && username.length <= 20;
}

function validatePassword(password: string): boolean {
  return password.length >= 6;
}


function authenticateUser(form: LoginForm): AuthResult {
  const errors: string[] = [];
  
  if (!validateUsername(form.username)) {
    errors.push('Username must be between 3 and 20 characters');
  }
  
  if (!validatePassword(form.password)) {
    errors.push('Password must be at least 6 characters');
  }
  

  
  if (errors.length > 0) {
    return {
      success: false,
      message: `Validation failed: ${errors.join(', ')}`
    };
  }
  
  // Mock authentication
  if (form.username === 'admin' && form.password === '123456') {
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

// ===== WEB SERVER =====

// Main login page
app.get('/', (req, res) => {
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Frontend Agent - Login</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            text-align: center;
            margin-bottom: 30px;
        }
        .server-info {
            background-color: #d1ecf1;
            color: #0c5460;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            text-align: center;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #555;
        }
        input:focus {
            border-color: #4CAF50;
            outline: none;
        }
        button {
            background-color: #4CAF50;
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            width: 100%;
        }
        button:hover {
            background-color: #45a049;
        }
        .result {
            margin-top: 20px;
            padding: 15px;
            border-radius: 5px;
            display: none;
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
        .note {
            background-color: #e2e3e5;
            color: #383d41;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="server-info">
            <strong>Frontend Agent Server</strong><br>
            Single file Node.js server on port 3000
        </div>
        
        <h1>Login Form</h1>
        
        <form id="loginForm">
            <div class="form-group">
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" required>
            </div>
            
            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required>
            </div>
            
            <button type="submit">Login</button>
        </form>
        
        <div id="result" class="result"></div>
        
        <div class="note">
            <strong>Demo Credentials:</strong><br>
            Username: admin<br>
            Password: 123456<br>
        </div>
        <div class="github-link">
            <strong>Source Code:</strong> 
            <a href="https://github.com/elevy99927/mcp-tutorial" target="_blank">
                GitHub Repository - MCP Tutorial
            </a>
        </div>
    </div>

    <script>
        document.getElementById('loginForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                username: document.getElementById('username').value,
                password: document.getElementById('password').value
            };
            
            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
                
                const result = await response.json();
                const resultDiv = document.getElementById('result');
                
                resultDiv.style.display = 'block';
                resultDiv.className = 'result ' + (result.success ? 'success' : 'error');
                resultDiv.textContent = result.message;
                
                if (result.success && result.user) {
                    resultDiv.innerHTML += '<br><strong>Welcome, ' + result.user.username + '!</strong>';
                }
            } catch (error) {
                const resultDiv = document.getElementById('result');
                resultDiv.style.display = 'block';
                resultDiv.className = 'result error';
                resultDiv.textContent = 'Error: ' + error.message;
            }
        });
    </script>
</body>
</html>`;
  
  res.send(htmlContent);
});

// Login API endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  const loginForm: LoginForm = {
    username: username || '',
    password: password || ''
  };
  
  const result = authenticateUser(loginForm);
  res.json(result);
});

// Start server
app.listen(PORT, () => {
  console.log(`Frontend Agent Server started!`);
  console.log(`Open: http://localhost:${PORT}`);
  console.log(`Single file architecture - frontend.ts`);
});

// Demo usage
console.log('Frontend Agent initialized');
console.log('Server will start on port 3000');