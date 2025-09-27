import { readFileSync, writeFileSync, existsSync } from 'fs';

interface AgentConfig {
  name: string;
  capabilities: string[];
  defaultPolicy: {
    readPaths?: string[];
    writePaths?: string[];
    denyPaths?: string[];
  };
}

interface TaskStep {
  id: string;
  agent: string;
  action: string;
  description: string;
  dependencies: string[];
  priority: number;
}

interface ExecutionPlan {
  planId: string;
  createdAt: string;
  instructions: {
    summary: string;
    keyRequirements: string[];
  };
  agents: {
    name: string;
    capabilities: string[];
  }[];
  tasks: TaskStep[];
  executionOrder: string[];
}

/**
 * Planner Agent
 * Reads conf/agents.json and instructions.md
 * Analyzes requirements and creates structured execution plan
 */
export class PlannerAgent {
  private agentsConfig: AgentConfig[] = [];
  private instructions = '';

  async createExecutionPlan(): Promise<ExecutionPlan> {
    console.log('📋 Planner Agent: Starting analysis...');
    
    // Read configuration and instructions
    this.loadAgentsConfig();
    this.loadInstructions();
    
    // Analyze requirements
    const requirements = this.analyzeRequirements();
    console.log(`📝 Identified ${requirements.length} key requirements`);
    
    // Create task steps
    const tasks = this.createTasks(requirements);
    console.log(`🎯 Created ${tasks.length} task steps`);
    
    // Determine execution order
    const executionOrder = this.determineExecutionOrder(tasks);
    console.log(`⚡ Planned execution order: ${executionOrder.join(' → ')}`);
    
    // Create execution plan
    const plan: ExecutionPlan = {
      planId: `PLAN-${Date.now()}`,
      createdAt: new Date().toISOString(),
      instructions: {
        summary: this.extractInstructionsSummary(),
        keyRequirements: requirements
      },
      agents: this.agentsConfig.map(a => ({
        name: a.name,
        capabilities: a.capabilities
      })),
      tasks,
      executionOrder
    };
    
    // Save plan
    this.savePlan(plan);
    
    console.log('✅ Planner Agent: Execution plan created');
    return plan;
  }

  private loadAgentsConfig(): void {
    try {
      const configPath = 'config/agents.json';
      if (!existsSync(configPath)) {
        throw new Error(`Config file not found: ${configPath}`);
      }
      
      const configData = readFileSync(configPath, 'utf8');
      const config = JSON.parse(configData);
      this.agentsConfig = config.agents || [];
      
      console.log(`📖 Loaded ${this.agentsConfig.length} agent configurations`);
    } catch (error: any) {
      console.error('❌ Failed to load agents config:', error.message);
      this.agentsConfig = [];
    }
  }

  private loadInstructions(): void {
    try {
      if (!existsSync('instructions.md')) {
        throw new Error('Instructions file not found: instructions.md');
      }
      
      this.instructions = readFileSync('instructions.md', 'utf8');
      console.log('📖 Loaded instructions.md');
    } catch (error: any) {
      console.error('❌ Failed to load instructions:', error.message);
      this.instructions = '';
    }
  }

  private analyzeRequirements(): string[] {
    const requirements: string[] = [];
    
    // Extract tasks from instructions
    const taskMatches = this.instructions.match(/(?:^|\n)(?:\d+\.|\-|\*)\s*(.+)/g);
    if (taskMatches) {
      taskMatches.forEach(match => {
        const task = match.replace(/^[\n\d\.\-\*\s]+/, '').trim();
        if (task.length > 10) { // Filter out short/empty tasks
          requirements.push(task);
        }
      });
    }
    
    // Look for specific patterns
    const patterns = [
      { regex: /frontend/i, req: 'Frontend development required' },
      { regex: /backend/i, req: 'Backend development required' },
      { regex: /phone/i, req: 'Phone field integration needed' },
      { regex: /test/i, req: 'Testing implementation required' },
      { regex: /api/i, req: 'API development/modification needed' },
      { regex: /ui/i, req: 'UI modifications required' }
    ];
    
    patterns.forEach(pattern => {
      if (pattern.regex.test(this.instructions) && !requirements.includes(pattern.req)) {
        requirements.push(pattern.req);
      }
    });
    
    return requirements;
  }

  private createTasks(requirements: string[]): TaskStep[] {
    const tasks: TaskStep[] = [];
    let taskId = 1;
    
    // Analyze which agents are needed based on requirements
    const neededAgents = this.determineNeededAgents(requirements);
    
    neededAgents.forEach(agentName => {
      const agent = this.agentsConfig.find(a => a.name === agentName);
      if (!agent) return;
      
      // Create tasks based on agent capabilities and requirements
      if (agentName === 'frontend-agent') {
        tasks.push({
          id: `T${taskId++}`,
          agent: agentName,
          action: 'enhance_frontend',
          description: 'Enhance frontend with required modifications',
          dependencies: [],
          priority: 2
        });
      }
      
      if (agentName === 'backend-agent') {
        tasks.push({
          id: `T${taskId++}`,
          agent: agentName,
          action: 'enhance_backend',
          description: 'Enhance backend API with required modifications',
          dependencies: [],
          priority: 1
        });
      }
      
      if (agentName === 'frontend-tests-agent') {
        tasks.push({
          id: `T${taskId++}`,
          agent: agentName,
          action: 'generate_frontend_tests',
          description: 'Generate comprehensive frontend tests',
          dependencies: ['T1'], // Depends on frontend enhancement
          priority: 3
        });
      }
      
      if (agentName === 'backend-tests-agent') {
        tasks.push({
          id: `T${taskId++}`,
          agent: agentName,
          action: 'generate_backend_tests',
          description: 'Generate comprehensive backend tests',
          dependencies: ['T2'], // Depends on backend enhancement
          priority: 3
        });
      }
      
      if (agentName === 'mermaid-agent') {
        tasks.push({
          id: `T${taskId++}`,
          agent: agentName,
          action: 'generate_diagram',
          description: 'Generate system architecture diagram',
          dependencies: [],
          priority: 4
        });
      }
    });
    
    return tasks;
  }

  private determineNeededAgents(requirements: string[]): string[] {
    const agents: string[] = [];
    const reqText = requirements.join(' ').toLowerCase();
    
    // Map requirements to agents
    if (/frontend|ui|form/.test(reqText)) {
      agents.push('frontend-agent');
      agents.push('frontend-tests-agent');
    }
    
    if (/backend|api|server/.test(reqText)) {
      agents.push('backend-agent');
      agents.push('backend-tests-agent');
    }
    
    if (/diagram|mermaid|architecture/.test(reqText)) {
      agents.push('mermaid-agent');
    }
    
    // Always include if available
    const availableAgents = this.agentsConfig.map(a => a.name);
    return agents.filter(agent => availableAgents.includes(agent));
  }

  private determineExecutionOrder(tasks: TaskStep[]): string[] {
    // Sort by priority first, then handle dependencies
    const sortedTasks = [...tasks].sort((a, b) => a.priority - b.priority);
    
    const executed: string[] = [];
    const remaining = [...sortedTasks];
    
    while (remaining.length > 0) {
      const readyTasks = remaining.filter(task => 
        task.dependencies.every(dep => executed.includes(dep))
      );
      
      if (readyTasks.length === 0) {
        // No dependencies blocking, take next by priority
        const nextTask = remaining.shift()!;
        executed.push(nextTask.id);
      } else {
        // Execute ready task with highest priority
        const nextTask = readyTasks[0];
        executed.push(nextTask.id);
        remaining.splice(remaining.indexOf(nextTask), 1);
      }
    }
    
    return executed;
  }

  private extractInstructionsSummary(): string {
    const lines = this.instructions.split('\n');
    const summaryLines = lines.slice(0, 5).filter(line => line.trim().length > 0);
    return summaryLines.join(' ').substring(0, 200) + '...';
  }

  private savePlan(plan: ExecutionPlan): void {
    try {
      const planPath = `outputs/execution-plan-${plan.planId}.json`;
      writeFileSync(planPath, JSON.stringify(plan, null, 2));
      console.log(`💾 Execution plan saved: ${planPath}`);
    } catch (error: any) {
      console.error('❌ Failed to save execution plan:', error.message);
    }
  }
}

// Export for use by orchestrator
export { ExecutionPlan, TaskStep };