#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs';
import { SmokeAgent } from './smoke-agent.js';
import { MermaidAgent } from './mermaid-agent.js';

/**
 * Orchestrator Agent
 * Reads instructions.md and dispatches tasks to specialized sub-agents
 */
class OrchestratorAgent {
  private smokeAgent: SmokeAgent;
  private mermaidAgent: MermaidAgent;

  constructor() {
    this.smokeAgent = new SmokeAgent();
    this.mermaidAgent = new MermaidAgent();
  }

  async processInstructions(): Promise<void> {
    console.log('🎭 Orchestrator Agent: Reading instructions.md...');
    
    try {
      // Read instructions file
      if (!existsSync('instructions.md')) {
        console.log('❌ No instructions.md file found');
        return;
      }
      
      const instructions = readFileSync('instructions.md', 'utf8');
      console.log('📄 Found instructions.md');
      console.log('🔍 Analyzing instructions for tasks...\n');
      
      // Detect intents and dispatch to sub-agents
      const intents = this.detectIntents(instructions);
      
      if (intents.length === 0) {
        console.log('ℹ️  No actionable instructions found');
        console.log('💡 Try adding: "smoke tests", "mermaid diagram", or "flow chart"');
        return;
      }
      
      console.log(`🎯 Detected ${intents.length} tasks: ${intents.join(', ')}\n`);
      
      // Execute tasks
      for (const intent of intents) {
        await this.executeTask(intent);
      }
      
      console.log('\n✅ All tasks completed!');
      console.log('💡 Run `npm test` to execute generated tests');
      console.log('💡 Check `outputs/mermaid/mermaid.md` for generated diagrams');
      
    } catch (error: any) {
      console.error('❌ Orchestrator error:', error.message);
    }
  }
  
  /**
   * Detect intents from instruction text
   */
  private detectIntents(instructions: string): string[] {
    const intents: string[] = [];
    
    // Smoke test patterns (English + Hebrew)
    const smokePatterns = [
      /smoke\s+tests?/i,
      /בדיקות\s+עשן/i,
      /create.*test/i,
      /generate.*test/i
    ];
    
    // Mermaid/Flow patterns (English + Hebrew)
    const flowPatterns = [
      /mermaid/i,
      /flow\s*(chart|diagram)/i,
      /diagram/i,
      /תרשים/i,
      /זרימה/i
    ];
    
    // Summary patterns
    const summaryPatterns = [
      /summary/i,
      /סיכום/i,
      /overview/i
    ];
    
    if (smokePatterns.some(pattern => pattern.test(instructions))) {
      intents.push('SMOKE');
    }
    
    if (flowPatterns.some(pattern => pattern.test(instructions))) {
      intents.push('FLOW');
    }
    
    if (summaryPatterns.some(pattern => pattern.test(instructions))) {
      intents.push('SUMMARY');
    }
    
    return intents;
  }
  
  /**
   * Execute a specific task by delegating to the appropriate sub-agent
   */
  private async executeTask(intent: string): Promise<void> {
    switch (intent) {
      case 'SMOKE':
        console.log('🔥 Dispatching to Smoke-Test Agent...');
        await this.smokeAgent.generateSmokeTests();
        break;
        
      case 'FLOW':
        console.log('📊 Dispatching to Mermaid Agent...');
        await this.mermaidAgent.generateMermaidDiagram();
        break;
        
      case 'SUMMARY':
        console.log('📋 Generating project summary...');
        this.generateSummary();
        break;
        
      default:
        console.log(`⚠️  Unknown task: ${intent}`);
    }
  }
  
  /**
   * Generate a simple project summary
   */
  private generateSummary(): void {
    try {
      const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
      console.log(`📦 Project: ${packageJson.name} v${packageJson.version}`);
      console.log('🎭 Orchestrator with specialized sub-agents');
      console.log('🔥 Smoke-Test Agent: Generates comprehensive test suites');
      console.log('📊 Mermaid Agent: Creates visual flow diagrams');
    } catch (error) {
      console.log('📦 Project summary not available');
    }
  }
}

// Run the orchestrator
async function main() {
  console.log('🚀 Starting Orchestrator Agent...\n');
  
  const orchestrator = new OrchestratorAgent();
  await orchestrator.processInstructions();
}

// Execute the orchestrator
main().catch((error) => {
  console.error('💥 Orchestrator failed:', error.message);
  process.exit(1);
});

export { OrchestratorAgent };