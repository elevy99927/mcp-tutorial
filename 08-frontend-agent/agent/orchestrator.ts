#!/usr/bin/env node

import { readFileSync, existsSync, rmSync } from 'fs';
import { FrontendTestsAgent } from './frontend-tests.js';
import { MermaidAgent } from './mermaid-agent.js';
import { ReadmeAgent } from './readme-agent.js';
import { FrontendAgent } from './frontend-agent.js';

/**
 * Config-Driven Orchestrator Agent
 * Reads config/agents.json and instructions.md to dispatch tasks to specialized sub-agents
 */
class OrchestratorAgent {
  private frontendTestsAgent: FrontendTestsAgent;
  private mermaidAgent: MermaidAgent;
  private readmeAgent: ReadmeAgent;
  private frontendAgent: FrontendAgent;
  private agentConfig: any;

  constructor() {
    this.frontendTestsAgent = new FrontendTestsAgent();
    this.mermaidAgent = new MermaidAgent();
    this.readmeAgent = new ReadmeAgent();
    this.frontendAgent = new FrontendAgent();
    this.agentConfig = this.loadAgentConfig();
  }

  /**
   * Load agent configuration from config/agents.json
   */
  private loadAgentConfig(): any {
    try {
      const configData = readFileSync('config/agents.json', 'utf8');
      return JSON.parse(configData);
    } catch (error) {
      console.log('⚠️  Could not load config/agents.json, using defaults');
      return { version: '0.1', agents: [] };
    }
  }

  /**
   * Clean outputs directory before starting
   */
  private cleanOutputsDirectory(): void {
    try {
      if (existsSync('outputs')) {
        rmSync('outputs', { recursive: true, force: true });
        console.log('🧹 Cleaned outputs/ directory');
      }
    } catch (error: any) {
      console.log('⚠️  Could not clean outputs directory:', error.message);
    }
  }

  async processInstructions(): Promise<void> {
    console.log('🎭 Config-Driven Orchestrator: Loading configuration...');
    console.log(`📋 Loaded ${this.agentConfig.agents?.length || 0} agent configurations`);

    // Clean outputs directory before starting
    this.cleanOutputsDirectory();

    try {
      // Read instructions file
      if (!existsSync('instructions.md')) {
        console.log('❌ No instructions.md file found');
        return;
      }

      const instructions = readFileSync('instructions.md', 'utf8');
      console.log('� Founyd instructions.md');
      console.log('🔍 Analyzing instructions for tasks...\n');

      // Detect intents and dispatch to sub-agents
      const intents = this.detectIntents(instructions);

      if (intents.length === 0) {
        console.log('ℹ️  No actionable instructions found');
        console.log('💡 Try adding: "generate tests", "mermaid diagram", "readme", or "documentation"');
        return;
      }

      console.log(`🎯 Detected ${intents.length} tasks: ${intents.join(', ')}\n`);

      // Validate agents against config
      this.validateAgentCapabilities(intents);

      // Execute tasks
      for (const intent of intents) {
        await this.executeTask(intent);
      }

      console.log('\n✅ All tasks completed!');
      console.log('💡 All generated content is in the outputs/ directory:');
      console.log('   📄 outputs/README.auto.md - Generated documentation');
      console.log('   🧪 outputs/tests/frontend.test.ts - Dynamic frontend tests');
      console.log('   📊 outputs/tests/test-report.html - HTML test report');
      console.log('   📈 outputs/mermaid/mermaid.md - Generated diagrams');
      console.log('   🎨 outputs/frontend.ts - Enhanced frontend code');
      console.log('   🌐 outputs/frontend/demo.html - Interactive demo');

    } catch (error: any) {
      console.error('❌ Orchestrator error:', error.message);
    }
  }

  /**
   * Detect intents from instruction text
   */
  private detectIntents(instructions: string): string[] {
    const intents: string[] = [];

    // Frontend test patterns (English + Hebrew)
    const testPatterns = [
      /smoke\s+tests?/i,
      /בדיקות\s+עשן/i,
      /create.*test/i,
      /generate.*test/i,
      /frontend.*test/i,
      /test.*frontend/i
    ];

    // Mermaid/Flow patterns (English + Hebrew)
    const flowPatterns = [
      /mermaid/i,
      /flow\s*(chart|diagram)/i,
      /diagram/i,
      /תרשים/i,
      /זרימה/i
    ];

    // README/Documentation patterns
    const readmePatterns = [
      /readme/i,
      /documentation/i,
      /docs/i,
      /תיעוד/i
    ];
    
    // Frontend patterns
    const frontendPatterns = [
      /frontend/i,
      /ui/i,
      /form/i,
      /login/i,
      /email/i,
      /input/i,
      /ממשק/i,
      /טופס/i
    ];

    // Summary patterns
    const summaryPatterns = [
      /summary/i,
      /סיכום/i,
      /overview/i
    ];

    if (testPatterns.some(pattern => pattern.test(instructions))) {
      intents.push('TESTS');
    }

    if (flowPatterns.some(pattern => pattern.test(instructions))) {
      intents.push('FLOW');
    }

    if (readmePatterns.some(pattern => pattern.test(instructions))) {
      intents.push('README');
    }

    if (frontendPatterns.some(pattern => pattern.test(instructions))) {
      intents.push('FRONTEND');
    }

    if (summaryPatterns.some(pattern => pattern.test(instructions))) {
      intents.push('SUMMARY');
    }

    return intents;
  }

  /**
   * Validate that requested agents have the required capabilities
   */
  private validateAgentCapabilities(intents: string[]): void {
    const intentToAgent = {
      'TESTS': 'frontend-tests-agent',
      'FLOW': 'mermaid-agent',
      'README': 'readme-agent',
      'FRONTEND': 'frontend-agent'
    };

    for (const intent of intents) {
      const agentName = intentToAgent[intent as keyof typeof intentToAgent];
      if (agentName) {
        const agentConfig = this.agentConfig.agents?.find((a: any) => a.name === agentName);
        if (agentConfig) {
          console.log(`✅ ${agentName}: Validated capabilities [${agentConfig.capabilities.join(', ')}]`);
        } else {
          console.log(`⚠️  ${agentName}: No configuration found`);
        }
      }
    }
    console.log('');
  }

  /**
   * Execute a specific task by delegating to the appropriate sub-agent
   */
  private async executeTask(intent: string): Promise<void> {
    switch (intent) {
      case 'TESTS':
        console.log('🧪 Dispatching to Frontend Tests Agent...');
        await this.frontendTestsAgent.generateFrontendTests();
        break;

      case 'FLOW':
        console.log('📊 Dispatching to Mermaid Agent...');
        await this.mermaidAgent.generateMermaidDiagram();
        break;

      case 'README':
        console.log('📖 Dispatching to README Agent...');
        await this.readmeAgent.generateReadme();
        break;

      case 'FRONTEND':
        console.log('🎨 Dispatching to Frontend Agent...');
        await this.frontendAgent.generateFrontend();
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
      console.log('🧪 Frontend Tests Agent: Generates dynamic test suites based on actual code');
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