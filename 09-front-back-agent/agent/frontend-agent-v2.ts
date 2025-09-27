import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

interface AgentConfig {
  name: string;
  capabilities: string[];
  defaultPolicy: {
    network: boolean;
    shell: boolean;
    fs: string;
    writePaths: string[];
    denyPaths: string[];
    readPaths: string[];
  };
}

interface ExecutionPlan {
  planId: string;
  instructions: {
    keyRequirements: string[];
  };
  tasks: Array<{
    id: string;
    agent: string;
    action: string;
    description: string;
  }>;
}

/**
 * Frontend Agent V2
 * Follows rules from config/agents.json and execution plan
 * Respects CONSTRAINTS & RULES from instructions
 */
export class FrontendAgentV2 {
  private agentConfig: AgentConfig | null = null;
  private executionPlan: ExecutionPlan | null = null;
  private instructions = '';

  constructor() {
    this.loadConfig();
    this.loadExecutionPlan();
    this.loadInstructions();
  }

  async execute(): Promise<void> {
    console.log('🎨 Frontend Agent V2: Starting...');
    console.log('THINK: Frontend Agent V2 analyzing requirements...');
    
    try {
      // Validate agent can execute
      this.validateExecution();
      
      // Read source code
      const sourceCode = this.readSourceCode();
      console.log(`THINK: Frontend Agent V2 found source code: ${sourceCode.length} characters`);
      
      // Analyze requirements
      const requirements = this.analyzeRequirements();
      console.log(`THINK: Frontend Agent V2 identified requirements: ${requirements.join(', ')}`);
      
      // Apply enhancements
      const enhancedCode = this.enhanceFrontend(sourceCode, requirements);
      
      // Write output
      this.writeEnhancedFrontend(enhancedCode);
      
      console.log('✅ Frontend Agent V2: Complete');
      
    } catch (error: any) {
      console.error('❌ Frontend Agent V2 error:', error.message);
      throw error;
    }
  }

  private loadConfig(): void {
    try {
      const configData = readFileSync('config/agents.json', 'utf8');
      const config = JSON.parse(configData);
      this.agentConfig = config.agents?.find((a: any) => a.name === 'frontend-agent');
      
      if (!this.agentConfig) {
        throw new Error('frontend-agent configuration not found in config/agents.json');
      }
      
      console.log('📖 Frontend Agent V2: Loaded configuration');
    } catch (error: any) {
      throw new Error(`Failed to load config: ${error.message}`);
    }
  }

  private loadExecutionPlan(): void {
    try {
      // Find the latest execution plan
      const files = readdirSync('outputs').filter(f => f.startsWith('execution-plan-'));
      if (files.length === 0) {
        throw new Error('No execution plan found in outputs/');
      }
      
      const latestPlan = files.sort().pop()!;
      const planData = readFileSync(join('outputs', latestPlan), 'utf8');
      this.executionPlan = JSON.parse(planData);
      
      console.log(`📖 Frontend Agent V2: Loaded execution plan ${this.executionPlan!.planId}`);
    } catch (error: any) {
      throw new Error(`Failed to load execution plan: ${error.message}`);
    }
  }

  private loadInstructions(): void {
    try {
      this.instructions = readFileSync('instructions.md', 'utf8');
      console.log('📖 Frontend Agent V2: Loaded instructions');
    } catch (error: any) {
      throw new Error(`Failed to load instructions: ${error.message}`);
    }
  }

  private validateExecution(): void {
    // Check if this agent should execute based on execution plan
    const frontendTask = this.executionPlan!.tasks.find(t => t.agent === 'frontend-agent');
    if (!frontendTask) {
      throw new Error('No frontend task found in execution plan');
    }
    
    // Validate write paths
    const writePaths = this.agentConfig!.defaultPolicy.writePaths;
    if (!writePaths.some(path => path.startsWith('outputs/frontend'))) {
      throw new Error('Invalid write paths - must write to outputs/frontend/**');
    }
    
    console.log('✅ Frontend Agent V2: Validation passed');
  }

  private readSourceCode(): string {
    const readPaths = this.agentConfig!.defaultPolicy.readPaths;
    
    for (const readPath of readPaths) {
      const basePath = readPath.replace('/**', '');
      
      if (existsSync(basePath)) {
        const files = this.findSourceFiles(basePath);
        
        if (files.length > 0) {
          const content = readFileSync(files[0], 'utf8');
          console.log(`📖 Frontend Agent V2: Read source from ${files[0]}`);
          return content;
        }
      }
    }
    
    throw new Error('No frontend source files found in configured read paths');
  }

  private findSourceFiles(dirPath: string): string[] {
    const files: string[] = [];
    
    try {
      if (statSync(dirPath).isDirectory()) {
        const entries = readdirSync(dirPath);
        for (const entry of entries) {
          const fullPath = join(dirPath, entry);
          const stat = statSync(fullPath);
          
          if (stat.isFile() && ['.ts', '.js'].includes(extname(entry))) {
            files.push(fullPath);
          } else if (stat.isDirectory()) {
            files.push(...this.findSourceFiles(fullPath));
          }
        }
      }
    } catch (error) {
      // Directory doesn't exist or can't be read
    }
    
    return files;
  }

  private analyzeRequirements(): string[] {
    const requirements: string[] = [];
    const keyReqs = this.executionPlan!.instructions.keyRequirements;
    
    // Look for add field requirements with type
    keyReqs.forEach(req => {
      const fieldMatch = req.match(/add (\w+) (radio|dropdown|select|field)/i);
      if (fieldMatch) {
        const fieldName = fieldMatch[1].toLowerCase();
        const fieldType = fieldMatch[2].toLowerCase() === 'field' ? 'input' : fieldMatch[2].toLowerCase();
        requirements.push(`add_${fieldName}_${fieldType}`);
      }
    });
    
    return requirements;
  }

  private enhanceFrontend(sourceCode: string, requirements: string[]): string {
    let enhanced = sourceCode;
    
    // Add agent attribution header (MUST DO rule)
    const timestamp = new Date().toISOString();
    const header = `// Enhanced by frontend-agent-v2 🎨
// Created: ${timestamp}
// Agent: agent/frontend-agent-v2.ts
// Requirements: ${requirements.join(', ')}
// Plan ID: ${this.executionPlan!.planId}

`;
    
    enhanced = header + enhanced;
    
    // Apply field enhancements
    requirements.forEach(req => {
      const fieldMatch = req.match(/add_(\w+)_(input|radio|dropdown|select)/);
      if (fieldMatch) {
        enhanced = this.addFieldToUI(enhanced, fieldMatch[1], fieldMatch[2]);
      }
    });
    
    return enhanced;
  }

  private addFieldToUI(code: string, fieldName: string, fieldType: string = 'input'): string {
    let enhanced = code;
    const inputType = fieldName === 'email' ? 'email' : fieldName === 'phone' ? 'tel' : 'text';
    const fieldLabel = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
    
    // Add field to registration form
    enhanced = enhanced.replace(
      /(<input type="password" id="regPassword"[^>]*>)/,
      `$1
            </div>
            <div class="form-group">
                <label for="reg${fieldLabel}">${fieldLabel}:</label>
                <input type="${inputType}" id="reg${fieldLabel}" placeholder="Enter ${fieldName} (optional)">`
    );
    
    // Add field to login form
    enhanced = enhanced.replace(
      /(<input type="password" id="loginPassword"[^>]*>)/,
      `$1
            </div>
            <div class="form-group">
                <label for="login${fieldLabel}">${fieldLabel}:</label>
                <input type="${inputType}" id="login${fieldLabel}" placeholder="Enter ${fieldName} (optional)">`
    );
    
    // Add to register function
    enhanced = enhanced.replace(
      /(const username = document\.getElementById\('regUsername'\)\.value;\s*const password = document\.getElementById\('regPassword'\)\.value;)/,
      `$1
            const ${fieldName} = document.getElementById('reg${fieldLabel}').value;`
    );
    
    enhanced = enhanced.replace(
      /(body: JSON\.stringify\(\{ username, password)/,
      `body: JSON.stringify({ username, password, ${fieldName}`
    );
    
    // Add to login function
    enhanced = enhanced.replace(
      /(const username = document\.getElementById\('loginUsername'\)\.value;\s*const password = document\.getElementById\('loginPassword'\)\.value;)/,
      `$1
            const ${fieldName} = document.getElementById('login${fieldLabel}').value;`
    );
    
    enhanced = enhanced.replace(
      /(body: JSON\.stringify\(\{ username, password)/g,
      `body: JSON.stringify({ username, password, ${fieldName}`
    );
    
    return enhanced;
  }

  private writeEnhancedFrontend(code: string): void {
    // Ensure output directory exists (following writePaths rule)
    const writePaths = this.agentConfig!.defaultPolicy.writePaths;
    const outputDir = writePaths[0].replace('/**', '');
    
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
      console.log(`📁 Frontend Agent V2: Created ${outputDir}/`);
    }
    
    // Write enhanced frontend file
    const outputFile = join(outputDir, 'frontend.ts');
    writeFileSync(outputFile, code, 'utf8');
    
    console.log(`💾 Frontend Agent V2: Enhanced frontend saved to ${outputFile}`);
  }
}

// Export for orchestrator use
export default FrontendAgentV2;