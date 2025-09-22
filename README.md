# Agents and MCP Tutorial

A progressive 20-step tutorial for learning Agents and MCP (Model Context Protocol) integration with Kiro IDE.
Start ultra-simple with basic TypeScript tooling, then gradually build sophisticated agents that can integrate with Kiro's ecosystem.

## Tutorial Overview

This tutorial teaches agent development through hands-on examples, progressing from simple scripts to sophisticated MCP-integrated tools.

### Current Progress

**Step 01** - Hello World: Basic TypeScript project setup  
**Step 02** - Hello Lint: ESLint configuration and tooling  
**Step 03** - Hello Agent: First autonomous linting agent with Kiro Hooks integration  
**Step 04** - Smoke Test: Minimal testing framework with Vitest integration  
**Step 05** - Simple Instruction: Natural language instruction processing agent  
**Step 06** - Orchestrated Agent: Multi-agent orchestration with smoke tests and Mermaid diagrams  
**Step 07** - Config Driven Agent: Configuration-based agent management with security policies  
**Step 08** - Frontend Agent: UI component generation with interactive forms and validation  
**Step 09-20** - Coming soon: Advanced MCP integration, external tool integration, and production patterns

## Goals

✅ **Project-level agents**: Each project contains its own specialized agents  
✅ **Kiro integration**: Seamless a connection with Kiro IDE through Hooks and MCP  
✅ **Progressive complexity**: Start simple, add sophistication gradually  
✅ **Real-world applicable**: Patterns you can use in production projects  
✅ **Educational**: Clear examples with detailed explanations

## Getting Started

Each step is a self-contained project in its own folder:

```
01-hello-world/         # Basic TypeScript setup
02-hello-lint/          # ESLint configuration and linting tools
03-hello-agent/         # First autonomous linting agent with Kiro integration
04-smoke-test/          # Testing framework with Vitest and automated test generation
05-simple-instruction/  # Natural language instruction processing
06-orchestrated-agent/  # Multi-agent orchestration with specialized sub-agents
07-config-driven-agent/ # Configuration-based agent management with security policies
08-frontend-agent/      # UI component generation with forms and validation
09-*/                   # Future steps...
```

Navigate to any step folder and follow its README for specific instructions.

### Quick Start for Any Step

```bash
cd [step-folder]
npm install
npm run agent    # Run the agent (steps 3+)
npm test         # Run tests (steps 4+)
```

## Step-by-Step Learning Path

### Foundation Steps (01-03)
- **01-hello-world**: Basic TypeScript project setup with npm and development workflow
- **02-hello-lint**: ESLint integration, configuration, and automated code quality checks
- **03-hello-agent**: First autonomous agent that performs linting tasks with Kiro Hooks integration

### Testing and Instructions (04-05)
- **04-smoke-test**: Minimal testing framework using Vitest with automated test generation
- **05-simple-instruction**: Natural language instruction processing that reads markdown files and generates appropriate tests

### Advanced Orchestration (06-08)
- **06-orchestrated-agent**: Multi-agent system with orchestrator dispatching tasks to specialized sub-agents (smoke tests, Mermaid diagrams)
- **07-config-driven-agent**: Configuration-based agent management with security policies, capabilities validation, and README generation
- **08-frontend-agent**: UI component generation with interactive login forms, validation, and HTML demos

### Key Learning Progression

**Complexity Evolution:**
- Simple scripts → Autonomous agents → Multi-agent orchestration → Config-driven systems
- Manual tasks → Automated workflows → Intelligent task routing → Policy-based execution
- Basic tooling → Testing integration → Documentation generation → Frontend development

**Agent Capabilities:**
- Code analysis and fixing (linting)
- Test generation and execution
- Documentation creation (README, Mermaid diagrams)
- UI component generation with validation
- Natural language instruction processing
- Multi-agent coordination and orchestration

## Architecture Philosophy

- **Project-scoped agents**: Agents live within projects, not globally
- **Version controlled**: Agents evolve with the codebase they serve
- **Team shareable**: Clone the project, get the agents
- **Kiro integrated**: Seamless IDE integration through Hooks and MCP
- **Incremental learning**: Each step builds on the previous ones
- **Security-first**: Configuration-based permissions and restricted file system access
- **Specialized agents**: Each agent has specific capabilities and responsibilities
## 
Agent Types and Capabilities

### Core Agent Types
- **Linting Agent**: Autonomous code quality analysis and fixing
- **Test Agent**: Automated test generation and smoke test creation
- **Documentation Agent**: README and Mermaid diagram generation
- **Frontend Agent**: UI component and form generation with validation
- **Orchestrator Agent**: Multi-agent coordination and task routing

### Agent Features by Step
- **Steps 01-02**: Manual tooling setup (TypeScript, ESLint)
- **Step 03**: First autonomous agent with IDE integration
- **Step 04**: Testing framework integration
- **Step 05**: Natural language instruction processing
- **Step 06**: Multi-agent orchestration with specialized sub-agents
- **Step 07**: Configuration-driven management with security policies
- **Step 08**: Frontend generation with interactive components

## Integration with Kiro IDE

### Kiro Hooks Integration
Starting from Step 03, agents can integrate with Kiro IDE through Hooks:

1. Open Command Palette in Kiro (`Cmd+Shift+P`)
2. Search for "Open Kiro Hook UI"
3. Create hooks for automatic agent execution:
   - **On file save**: Trigger linting agents
   - **On project open**: Run smoke tests
   - **On code changes**: Generate documentation

### Project-Level Agent Benefits
- **Contextual**: Agents understand your specific project structure
- **Customizable**: Each project can have tailored agent configurations
- **Shareable**: Team members get the same agent setup when cloning
- **Versioned**: Agent configurations evolve with your codebase

## Technical Stack

- **Runtime**: Node.js 18+ with TypeScript
- **Testing**: Vitest for fast unit testing
- **Code Quality**: ESLint with TypeScript integration
- **Documentation**: Mermaid for diagrams, auto-generated README files
- **Frontend**: Vanilla TypeScript with HTML5 validation
- **Configuration**: JSON-based agent policies and capabilities

## Future Roadmap (Steps 09-20)

- **MCP Integration**: Model Context Protocol for external tool integration
- **Database Agents**: Automated schema generation and migration tools
- **API Agents**: REST/GraphQL endpoint generation and testing
- **Deployment Agents**: CI/CD pipeline automation
- **Monitoring Agents**: Performance analysis and error tracking
- **Refactoring Agents**: Intelligent code transformation and optimization