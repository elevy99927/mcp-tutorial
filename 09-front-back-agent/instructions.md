# Instructions for Full-Stack Agent System

## Project Context
The project demonstrates full-stack agent orchestration with frontend and backend separation. 
The system includes:
- Frontend server (`src/frontend/frontend.ts`) on port 3000 - handles UI and user interaction
- Backend API (`src/backend/backend.ts`) on port 3001 - handles authentication and data
- Agents Configuration locates in config/agents.json 
- every agent MUST add his name to every file it create as comment in the file.
- Frontend-agent will run befor Backend-agent

## Tasks:
0. Generate frontend enhancements
1. add phone field to the frontend registration form UI
2. update the backend API, to support the phone field
3. update the frontend UI Registration forms, to support the phone field. do not change the login form.
4. keep the frontend to backend communication
5. Do not add new API. you can just change existing APIs
6. update all API responses to include the phone field
7. update the GET /api/users endpoint to return phone field in user data



## General Tasks
1. Generate comprehensive tests for both frontend and backend
2. Create system topology diagram showing full-stack architecture
3. Create HTML test reports for both services
4. Provide full-stack system summary

## Agent Communication System:
Frontend agents can request backend changes via file-based mailbox system:
- Frontend writes requests to `comms/requests/to-backend/`
- Backend processes requests and writes events to `comms/events/from-backend/`
- All changes go through orchestrator with policy enforcement
- Example: Frontend can request "add [fieldname] field to login" and Backend will implement it


## Architecture:
- **Frontend (port 3000)**: User interface, form validation, API calls to backend
- **Backend (port 3001)**: REST API, user validation, user data management
- **Communication**: Frontend sends HTTP requests to backend API
- **Authentication**: Username/password validation (no tokens needed for this tutorial)

## Output Requirements:
- All artifacts must go in ./outputs folder or one of it's subfolders according to ./conf/agents.json.
- Include agent attribution in generated files
- Generate both frontend and backend enhanced versions

---

## CONSTRAINTS & RULES

### MUST DO:
- All generated artifacts MUST be placed in the `./outputs` folder
- Frontend agent can ONLY modify frontend-related files
- Backend agent can ONLY modify backend-related files
- Generated files MUST include agent attribution headers
- All validation functions MUST be tested for both services
- System topology MUST show frontend → backend communication

### MUST NOT DO:
- DO NOT modify any files outside the `./outputs` folder
- DO NOT change source files in `./src` directory
- Frontend agent MUST NOT modify backend.ts
- Backend agent MUST NOT modify frontend.ts
- DO NOT modify configuration files (`package.json`, `tsconfig.json`, etc.)
- DO NOT create files in the root directory

