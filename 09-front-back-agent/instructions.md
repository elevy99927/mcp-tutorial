# Instructions for Full-Stack Agent System

## Project Context
This is step 09 of a tutorial for learning Agents and MCP integration. The project demonstrates full-stack agent orchestration with frontend and backend separation. The system includes:
- Frontend server (`src/frontend.ts`) on port 3000 - handles UI and user interaction
- Backend API (`src/backend.ts`) on port 3001 - handles authentication and data

## Tasks:
1. Create backend API with authentication endpoints
2. Connect frontend to backend for user authentication  
3. Generate comprehensive tests for both frontend and backend
4. Create system topology diagram showing full-stack architecture
5. Generate project README documentation
6. Add email field to user registration
7. Create HTML test reports for both services
8. Provide full-stack system summary

## Architecture:
- **Frontend (port 3000)**: User interface, form validation, API calls to backend
- **Backend (port 3001)**: REST API, authentication, user data management
- **Communication**: Frontend sends HTTP requests to backend API
- **Authentication**: Username/password validation (no tokens needed for this tutorial)
- **Credentials**: admin/123456

## Output Requirements:
- All artifacts must go in ./outputs folder
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

