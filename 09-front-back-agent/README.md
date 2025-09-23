# 09-Front-Back-Agent

A full-stack orchestrator with frontend and backend capabilities that reads `config/agents.json` to manage agent capabilities and policies, then dispatches tasks to specialized sub-agents:

- **Frontend Tests Agent** → writes `outputs/tests/frontend.test.ts`
- **Backend Tests Agent** → writes `outputs/tests/backend.test.ts`
- **Mermaid Agent** → writes `outputs/mermaid/system-topology.md` with full-stack diagrams
- **README Agent** → writes `outputs/README.auto.md` with comprehensive documentation
- **Frontend Agent** → writes `outputs/frontend.ts` with enhanced UI
- **Backend Agent** → writes `outputs/backend.ts` with enhanced API

No MCP; runs purely on npm + TypeScript + Vitest with configuration-based agent management and full-stack development.

## System Architecture

```mermaid
User Browser
     ↓
Frontend Server (port 3000)
     ↓ HTTP API calls
Backend API Server (port 3001)
     ↓
In-memory user database
```

## TL;DR

```bash
cd 09-front-back-agent
npm install
npm run agent         # Full-stack orchestrator reads config/agents.json and ./instructions.md
npm test              # Run generated frontend and backend tests
npm run src:frontend  # Start source frontend server: http://localhost:3000
npm run src:backend   # Start source backend API: http://localhost:3001
npm run src:fullstack # Start both source servers simultaneously
npm run gen:fullstack # Start both generated/enhanced servers
# Check outputs/ directory for all generated content
```

## Goals

- Demonstrate full-stack agent orchestration with strict boundaries
- Implement frontend-backend communication via HTTP APIs
- Show agent specialization (frontend vs backend responsibilities)
- Generate comprehensive tests for both services
- Create system topology diagrams showing full architecture
- Validate agent capabilities and enforce security policies
- Build foundation for microservice agent patterns


## Tutorial Instructions

Follow these steps to learn how the full-stack agent system works:

### Step 1: Understand the Full-Stack Architecture
1. **Read the `instructions.md` file** - Open `instructions.md` and review the `## Tasks:` section
2. **Understand the architecture**:
   - Frontend (port 3000): User interface and form validation
   - Backend (port 3001): API endpoints and authentication
   - Communication: Frontend sends HTTP requests to backend
3. **Note the agent boundaries**:
   - Frontend Agent: Only modifies frontend-related files
   - Backend Agent: Only modifies backend-related files


### Step 2: Test the Source Full-Stack System
3. **Start the backend server**:
   ```bash
   npm run src:backend
   ```
4. **In a new terminal, start the frontend server**:
   ```bash
   npm run src:frontend
   ```
   Or start both simultaneously:
   ```bash
   npm run src:fullstack
   ```
5. **Browse to http://localhost:3000**
6. **Test the full-stack authentication**:
   - Username: `admin`
   - Password: `123456`
   - Notice: Frontend validates input, then calls backend API
7. **Check backend API directly**: http://localhost:3001/api/health
8. **Close both servers** (Ctrl+C)

### Step 3: Generate Enhanced Full-Stack System
7. **Run the full-stack agent system**:
   ```bash
   npm run agent
   ```
   This will:
   - Generate enhanced backend API with new endpoints
   - Generate enhanced frontend with additional fields
   - Create comprehensive tests for both services
   - Generate system topology diagrams

8. **Run the generated full-stack system**:
   ```bash
   npm run gen:fullstack
   ```
   This runs both generated/enhanced services from `outputs/`

9. **Browse to http://localhost:3000**
10. **Test the enhanced authentication**:
    - Username: `admin`
    - Password: `123456`
    - Notice: Enhanced features based on agent modifications

11. **Stop both services** (Ctrl+C)

### Step 4: Experiment with Full-Stack Features
12. **Edit `instructions.md`** - Add more requests like:
    - "Add user registration endpoint"
    - "Add email field to user profile"
    - "Create user management API"
    
13. **Run the agents again**:
    ```bash
    npm run agent
    npm run gen:fullstack
    ```

14. **Test the new features**:
    - Frontend: Browse to http://localhost:3000
    - Backend API: Test endpoints at http://localhost:3001/api/

### Key Learning Points:
- **Agent Boundaries** - Frontend and backend agents have strict separation of concerns
- **Full-Stack Communication** - Frontend communicates with backend via HTTP APIs
- **Dynamic Enhancement** - Both services can be enhanced based on instructions
- **Comprehensive Testing** - Tests generated for both frontend and backend
- **System Topology** - Visual diagrams show complete architecture
- **Clean Architecture** - Each run starts fresh and adapts to current instructions


---


## Project Structure

```
09-front-back-agent/
├─ .gitignore               # ignores generated files
├─ package.json
├─ tsconfig.json
├─ instructions.md          # full-stack instructions (HE/EN)
├─ README.md                # this file
├─ config/
│  └─ agents.json          # agent configuration and policies
├─ src/
│  ├─ frontend.ts          # Frontend server (port 3000)
│  └─ backend.ts           # Backend API server (port 3001)
├─ outputs/                 # all generated content (cleaned on each run)
│  ├─ tests/
│  │  ├─ frontend.test.ts     # generated by frontend-tests-agent.ts
│  │  ├─ backend.test.ts      # generated by backend-tests-agent.ts
│  │  └─ test-report.html     # HTML test report
│  ├─ mermaid/
│  │  └─ system-topology.md   # generated by mermaid-agent.ts
│  ├─ frontend/
│  │  └─ demo.html           # interactive demo
│  ├─ frontend.ts            # enhanced frontend code
│  ├─ backend.ts             # enhanced backend API
│  └─ README.auto.md         # generated by readme-agent.ts
└─ agent/
   ├─ orchestrator.ts       # full-stack orchestrator with cleanup
   ├─ frontend-tests.ts     # creates dynamic frontend tests
   ├─ backend-tests.ts      # creates dynamic backend tests
   ├─ mermaid-agent.ts      # creates system topology diagrams
   ├─ readme-agent.ts       # creates comprehensive documentation
   ├─ frontend-agent.ts     # enhances frontend code and UI
   └─ backend-agent.ts      # enhances backend API and endpoints
```



## How it Works
1. **Orchestrator** loads `config/agents.json` and validates agent capabilities
2. **Instructions** are parsed from `instructions.md` for task detection
3. **Validation** ensures requested tasks match agent capabilities
4. **Dispatch** sends tasks to appropriate specialized agents
5. **Agents** operate within their configured security policies


## Key Improvements from Chapter 07
1. **Frontend Agent**: Generates interactive UI components and forms
2. **Login System**: Complete authentication flow with validation
3. **Email Integration**: Additional input field as requested in instructions
4. **Interactive Demo**: HTML demo with working JavaScript validation
5. **Enhanced Code**: Frontend-focused functions and interfaces


## Agent Configuration
The `config/agents.json` file defines:

### Agent Capabilities
- **frontend-tests-agent**: `["tests", "frontend", "validation"]`
- **backend-tests-agent**: `["tests", "backend", "api"]`
- **mermaid-agent**: `["docs", "diagram", "mermaid", "topology"]`  
- **readme-agent**: `["docs", "readme", "documentation"]`
- **frontend-agent**: `["frontend", "ui", "forms", "enhancement"]`
- **backend-agent**: `["backend", "api", "database", "auth"]`

### Security Policies
Each agent has restricted permissions:
- **network**: `false` (no network access)
- **shell**: `false` (no shell commands)
- **fs**: `"restricted"` (limited file system access)
- **writePaths**: Allowed write locations
- **denyPaths**: Forbidden directories

### Agent Boundaries
- **Frontend Agent**: Can only modify `outputs/frontend.ts` and `outputs/frontend/`
- **Backend Agent**: Can only modify `outputs/backend.ts` and backend-related files
- **Cross-Agent Communication**: If frontend needs backend changes, it triggers backend agent
- **Strict Separation**: No agent can modify another agent's domain

## Usage

```bash
# Install dependencies
npm install

# Run the full-stack orchestrator
npm run agent

# Execute generated tests
npm test

# Source servers (original code)
npm run src:frontend     # Source frontend only (port 3000)
npm run src:backend      # Source backend only (port 3001)
npm run src:fullstack    # Both source servers simultaneously

# Generated servers (agent-enhanced versions)
npm run gen:frontend     # Generated frontend
npm run gen:backend      # Generated backend
npm run gen:fullstack    # Both generated servers

# View generated content
cat outputs/README.auto.md              # Auto-generated documentation
cat outputs/mermaid/system-topology.md  # System architecture diagrams
cat outputs/tests/frontend.test.ts      # Frontend test suite
cat outputs/tests/backend.test.ts       # Backend test suite
open outputs/tests/test-report.html     # HTML test report
```

## Key Features

1. **Full-Stack Architecture**: Complete frontend + backend system
2. **Agent Boundaries**: Strict separation between frontend and backend agents
3. **HTTP Communication**: Frontend communicates with backend via REST API
4. **Dynamic Testing**: Tests generated for both services based on actual code
5. **System Topology**: Visual diagrams showing complete architecture
6. **Clean Regeneration**: Each run starts fresh and adapts to instructions

## Authentication Flow

```
1. User enters credentials in frontend form
2. Frontend validates input format
3. Frontend sends POST to http://localhost:3001/api/auth/login
4. Backend validates credentials against user database
5. Backend returns success/failure response
6. Frontend displays result to user
```

## Example Output

The orchestrator will:
1. Clean outputs directory for fresh start
2. Load agent configurations from `config/agents.json`
3. Validate agent capabilities against requested tasks
4. Dispatch to Backend Agent → enhanced API with new endpoints
5. Dispatch to Backend Tests Agent → comprehensive API tests
6. Dispatch to Frontend Agent → enhanced UI with new features
7. Dispatch to Frontend Tests Agent → comprehensive UI tests
8. Dispatch to Mermaid Agent → system topology diagrams
9. Dispatch to README Agent → project documentation
10. Generate summary if requested

All agents operate within their configured security policies and maintain strict boundaries!
