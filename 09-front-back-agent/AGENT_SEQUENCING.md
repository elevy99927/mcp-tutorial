# Agent Sequencing Implementation

## Overview
The orchestrator now properly sequences agents based on the execution plan's `executionOrder` array, rather than using hardcoded execution order.

## Key Changes Made

### 1. Dynamic Task Execution
- **Before**: Hardcoded frontend → backend execution
- **After**: Follows `executionPlan.executionOrder` array dynamically

### 2. Agent Factory Pattern
```typescript
private async executeAgent(agentName: string): Promise<void> {
  switch (agentName) {
    case 'frontend-agent': /* ... */
    case 'backend-agent': /* ... */
    case 'mermaid-agent': /* ... */
    // etc.
  }
}
```

### 3. Execution Modes
- `npm run agent` - Planning only
- `npm run agent:full` - Planning + execution
- `npm run agent -- --execute-tasks` - Planning + execution

## Execution Flow

1. **Planning Phase** (`execute()`)
   - Load instructions.md
   - Create execution plan with task dependencies
   - Save plan to `outputs/execution-plan-*.json`
   - Display plan summary

2. **Execution Phase** (`executeTasksFromPlan()`)
   - Load latest execution plan
   - Execute tasks in `executionOrder` sequence
   - Handle agent-specific execution logic

## Current Execution Order
Based on the execution plan: `["T2", "T1", "T3"]`

1. **T2**: Backend Agent (enhance backend API)
2. **T1**: Frontend Agent (enhance frontend UI) 
3. **T3**: Mermaid Agent (generate diagrams)

## Agent Communication
Agents can communicate via the file-based mailbox system described in `Agent2Agent.md`:

- **Requests**: `comms/requests/to-backend/`
- **Events**: `comms/events/from-backend/`
- **Policy enforcement** through orchestrator

## Usage Examples

```bash
# Just create execution plan
npm run agent:plan

# Create plan and execute all tasks
npm run agent:full

# Alternative full execution
npm run agent -- --execute-tasks
```

## Next Steps
- Implement remaining agents (mermaid-agent, smoke-test-agent, readme-agent)
- Add dependency checking before task execution
- Implement mailbox communication between agents
- Add error recovery and rollback mechanisms