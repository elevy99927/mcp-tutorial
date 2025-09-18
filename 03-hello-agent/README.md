
# 03 - Hello Agent

In this step, we create our first **agent** - a program that can perform linting tasks autonomously instead of manually running `npm run lint`.

## Project Structure

```
03-hello-agent/
├── src/
│   └── index.ts          # Main application code
├── tools/
│   └── lint-agent.ts     # Linting agent (separate from business logic)
└── package.json
```

## What's New

### 1. Linting Agent (`tools/lint-agent.ts`)
- **Autonomous linting**: The agent runs ESLint programmatically
- **Auto-fixing**: Automatically fixes issues when possible
- **Smart reporting**: Provides detailed analysis and summaries
- **Interactive mode**: Friendly interface that explains what it's doing
- **Separated from main code**: Following best practices by keeping tools separate

### 2. Enhanced Code (`src/index.ts`)
- Added more functions to make linting more interesting
- Better examples for the agent to analyze

### 3. New Script
```json
{
  "scripts": {
    "agent": "tsx tools/lint-agent.ts"
  }
}
```

## Architecture Decision

We're using the **tools/** folder pattern because:
- ✅ **Separation of concerns**: Business logic vs development tools
- ✅ **Clear organization**: Easy to find and maintain agents
- ✅ **Scalable**: Can add more tools without cluttering src/
- ✅ **Best practice**: Industry standard for development tooling

## Usage

### Run the Linting Agent
```bash
npm run agent
```

### Compare with Manual Linting
```bash
# Old way (manual)
npm run lint

# New way (agent)
npm run agent
```

## What the Agent Does

1. **Analyzes** your TypeScript files
2. **Auto-fixes** issues when possible
3. **Reports** remaining issues in a friendly way
4. **Summarizes** the results

## Key Concepts

- **Agent vs Script**: An agent is more autonomous and interactive
- **Programmatic ESLint**: Using ESLint as a library, not just a CLI tool
- **Auto-fixing**: Let the agent fix what it can automatically
- **User Experience**: Agents should be helpful and communicative

## Connecting to Kiro

### Kiro Hooks (The Simplest Way)
This is what's most suitable for the current step:

**How it works:**
- Kiro can run your agent automatically when events occur
- For example: when you save a TypeScript file, Kiro will run the linting agent

**How to set it up:**
1. Open Command Palette in Kiro (`Cmd+Shift+P`)
2. Search for "Open Kiro Hook UI"
3. Create a new Hook:
   - **Trigger**: "On file save"
   - **File pattern**: "*.ts"
   - **Command**: `npm run agent`
   - **Working directory**: `03-hello-agent`

## Next Steps

This foundation prepares us for more sophisticated agents that can:
- Generate tests
- Refactor code
- Integrate with external tools
- Work with MCP protocols