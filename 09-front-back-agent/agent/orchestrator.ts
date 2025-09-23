#!/usr/bin/env node

import { readFileSync, existsSync, rmSync } from 'fs';
import { FrontendTestsAgent } from './frontend-tests.js';
import { BackendTestsAgent } from './backend-tests.js';
import { MermaidAgent } from './mermaid-agent.js';
import { ReadmeAgent } from './readme-agent.js';
import { FrontendAgent } from './frontend-agent.js';
import { BackendAgent } from './backend-agent.js';

/**
 * Full-Stack Orchestrator Agent
 * Reads config/agents.json and instructions.md to dispatch tasks to specialized sub-agents
 * Supports both frontend and backend development with agent boundaries
 */
class OrchestratorAgent {
  private frontendTestsAgent: FrontendTestsAgent;
  private backendTestsAgent: BackendTestsAgent;
  private mermaidAgent: MermaidAgent;
  private readmeAgent: ReadmeAgent;
  private frontendAgent: FrontendAgent;
  private backendAgent: BackendAgent;
  private agentConfig: any;

  constructor() {
    this.frontendTestsAgent = new FrontendTestsAgent();
    this.backendTestsAgent = new BackendTestsAgent();
    this.mermaidAgent = new MermaidAgent();
    this.readmeAgent = new ReadmeAgent();
    this.frontendAgent = new FrontendAgent();
    this.backendAgent = new BackendAgent();
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
      console.log('   🧪 outputs/tests/backend.test.ts - Dynamic backend tests');
      console.log('   📊 outputs/tests/test-report.html - HTML test report');
      console.log('   📈 outputs/mermaid/system-topology.md - System architecture');
      console.log('   🎨 outputs/frontend.ts - Enhanced frontend code');
      console.log('   ⚙️ outputs/backend.ts - Enhanced backend API');
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

    // Backend patterns
    const backendPatterns = [
      /backend/i,
      /api/i,
      /server/i,
      /database/i,
      /authentication/i,
      /jwt/i,
      /endpoint/i
    ];

    // Full-stack patterns
    const fullstackPatterns = [
      /full.?stack/i,
      /fullstack/i,
      /complete.?system/i,
      /end.?to.?end/i
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

    if (backendPatterns.some(pattern => pattern.test(instructions))) {
      intents.push('BACKEND');
    }

    if (fullstackPatterns.some(pattern => pattern.test(instructions))) {
      intents.push('FULLSTACK');
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
      'FRONTEND': 'frontend-agent',
      'BACKEND': 'backend-agent',
      'FULLSTACK': 'fullstack-system'
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

      case 'BACKEND':
        console.log('⚙️ Dispatching to Backend Agent...');
        await this.backendAgent.generateBackend();
        console.log('🧪 Dispatching to Backend Tests Agent...');
        await this.backendTestsAgent.generateBackendTests();
        break;

      case 'FULLSTACK':
        console.log('🌐 Dispatching Full-Stack System...');
        console.log('⚙️ Backend first...');
        await this.backendAgent.generateBackend();
        await this.backendTestsAgent.generateBackendTests();
        console.log('🎨 Frontend second...');
        await this.frontendAgent.generateFrontend();
        await this.frontendTestsAgent.generateFrontendTests();
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
      console.log('🎭 Full-Stack Orchestrator with specialized sub-agents');
      console.log('🧪 Frontend Tests Agent: Generates dynamic frontend test suites');
      console.log('🧪 Backend Tests Agent: Generates dynamic backend API tests');
      console.log('📊 Mermaid Agent: Creates system topology diagrams');
      console.log('🎨 Frontend Agent: Enhances UI and forms');
      console.log('⚙️ Backend Agent: Enhances API and database features');
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