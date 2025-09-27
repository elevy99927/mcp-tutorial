#!/usr/bin/env node

import { existsSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';
import { PlannerAgent, ExecutionPlan, TaskStep } from './planner.js';
import BackendAgentV2 from './backend-agent-v2.js';
import FrontendAgentV2 from './frontend-agent-v2.js';

/**
 * Orchestrator V2 Agent
 * Uses planner to create execution plan, then executes tasks in order
 */
class OrchestratorV2 {
  private plannerAgent: PlannerAgent;
  private executionPlan: ExecutionPlan | null = null;

  constructor() {
    this.plannerAgent = new PlannerAgent();
  }

  async execute(): Promise<void> {
    console.log('🚀 Orchestrator V2: Starting...\n');

    try {
      // Ensure outputs directory exists
      this.ensureOutputsDirectory();

      // Step 1: Create execution plan
      console.log('📋 Step 1: Creating execution plan...');
      this.executionPlan = await this.plannerAgent.createExecutionPlan();

      // Display plan summary
      this.displayPlanSummary();

      console.log('\n✅ Step 1 Complete: Execution plan created');
      console.log('📄 Plan saved to outputs/execution-plan-*.json');
      console.log('\n🎯 Ready for Step 2: Task execution');
      console.log('💡 Run: await orchestrator.executeTasksFromPlan()');

    } catch (error: any) {
      console.error('❌ Orchestrator V2 error:', error.message);
    }
  }

  // Run full sequence: planning + execution
  async executeFullSequence(): Promise<void> {
    console.log('🚀 Orchestrator V2: Full sequence starting...\n');
    
    // Step 1: Planning
    await this.execute();
    
    // Step 2: Execution
    await this.executeTasksFromPlan();
    
    console.log('\n🎆 Orchestrator V2: Full sequence completed!');
  }

  private ensureOutputsDirectory(): void {
    if (!existsSync('outputs')) {
      mkdirSync('outputs', { recursive: true });
      console.log('📁 Created outputs/ directory');
    }
  }

  private displayPlanSummary(): void {
    if (!this.executionPlan) return;

    console.log('\n📊 EXECUTION PLAN SUMMARY');
    console.log('='.repeat(50));
    console.log(`Plan ID: ${this.executionPlan.planId}`);
    console.log(`Created: ${this.executionPlan.createdAt}`);

    console.log('\n📝 Instructions Summary:');
    console.log(`  ${this.executionPlan.instructions.summary}`);

    console.log('\n🎯 Key Requirements:');
    this.executionPlan.instructions.keyRequirements.forEach((req, i) => {
      console.log(`  ${i + 1}. ${req}`);
    });

    console.log('\n🤖 Available Agents:');
    this.executionPlan.agents.forEach(agent => {
      console.log(`  • ${agent.name}: [${agent.capabilities.join(', ')}]`);
    });

    console.log('\n📋 Planned Tasks:');
    this.executionPlan.tasks.forEach(task => {
      const deps = task.dependencies.length > 0 ? ` (depends: ${task.dependencies.join(', ')})` : '';
      console.log(`  ${task.id}. ${task.description}${deps}`);
      console.log(`      Agent: ${task.agent} | Priority: ${task.priority}`);
    });

    console.log('\n⚡ Execution Order:');
    console.log(`  ${this.executionPlan.executionOrder.join(' → ')}`);

    console.log('='.repeat(50));
  }

  // Step 2: Execute tasks from plan
  async executeTasksFromPlan(): Promise<void> {
    console.log('\n🎯 Step 2: Executing tasks from plan...');

    try {
      // Load the latest execution plan
      const planFiles = readdirSync('outputs').filter(f => f.startsWith('execution-plan-'));
      if (planFiles.length === 0) {
        throw new Error('No execution plan found. Run Step 1 first.');
      }

      const latestPlan = planFiles.sort().pop()!;
      console.log(`📋 Using execution plan: ${latestPlan}`);
      
      // Load the execution plan
      const { readFileSync } = await import('fs');
      const planData = JSON.parse(readFileSync(`outputs/${latestPlan}`, 'utf8'));
      this.executionPlan = planData;

      // Execute tasks in order
      await this.executeTasks();

      console.log('\n✅ Step 2 Complete: All tasks executed successfully');

    } catch (error: any) {
      console.error('❌ Step 2 execution error:', error.message);
      throw error;
    }
  }

  private async executeTasks(): Promise<void> {
    if (!this.executionPlan) {
      throw new Error('No execution plan loaded');
    }

    console.log('\n🚀 Executing agents in planned order...');
    console.log(`📋 Execution sequence: ${this.executionPlan.executionOrder.join(' → ')}`);

    for (const taskId of this.executionPlan.executionOrder) {
      const task = this.executionPlan.tasks.find(t => t.id === taskId);
      if (!task) {
        console.warn(`⚠️ Task ${taskId} not found in plan, skipping`);
        continue;
      }

      console.log(`\n📋 Executing ${taskId}: ${task.description}`);
      console.log(`🤖 Agent: ${task.agent}`);

      try {
        await this.executeAgent(task.agent);
        console.log(`✅ ${taskId} completed successfully`);
      } catch (error: any) {
        console.error(`❌ ${taskId} failed:`, error.message);
        throw error;
      }
    }

    console.log('\n🎉 All agents executed successfully!');
  }

  private async executeAgent(agentName: string): Promise<void> {
    switch (agentName) {
      case 'frontend-agent':
        const frontendAgent = new FrontendAgentV2();
        await frontendAgent.execute();
        break;
      
      case 'backend-agent':
        const backendAgent = new BackendAgentV2();
        await backendAgent.execute();
        break;
      
      case 'mermaid-agent':
        console.log('📊 Mermaid agent not yet implemented');
        break;
      
      case 'smoke-test-agent':
        console.log('🧪 Smoke test agent not yet implemented');
        break;
      
      case 'readme-agent':
        console.log('📖 README agent not yet implemented');
        break;
      
      default:
        throw new Error(`Unknown agent: ${agentName}`);
    }
  }
}

// Run the orchestrator
async function main() {
  const orchestrator = new OrchestratorV2();
  
  // Check if we should run both steps or just planning
  const args = process.argv.slice(2);
  const runTasks = args.includes('--execute-tasks') || args.includes('--full');
  
  if (runTasks) {
    // Run full sequence: planning + execution
    await orchestrator.executeFullSequence();
  } else {
    // Just run planning step
    await orchestrator.execute();
    console.log('\n💡 To execute tasks, run with --execute-tasks or --full flag');
    console.log('   Example: npm run agent -- --execute-tasks');
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('💥 Orchestrator V2 failed:', error.message);
    process.exit(1);
  });
}

export { OrchestratorV2 };