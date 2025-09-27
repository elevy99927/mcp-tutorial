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
 * Backend Agent V2
 * Follows rules from config/agents.json and execution plan
 * Respects CONSTRAINTS & RULES from instructions
 */
export class BackendAgentV2 {
  private agentConfig: AgentConfig | null = null;
  private executionPlan: ExecutionPlan | null = null;
  private instructions = '';

  constructor() {
    this.loadConfig();
    this.loadExecutionPlan();
    this.loadInstructions();
  }

  async execute(): Promise<void> {
    console.log('⚙️ Backend Agent V2: Starting...');
    console.log('THINK: Backend Agent V2 analyzing requirements...');
    
    try {
      // Validate agent can execute
      this.validateExecution();
      
      // Read source code
      const sourceCode = this.readSourceCode();
      console.log(`THINK: Backend Agent V2 found source code: ${sourceCode.length} characters`);
      
      // Analyze requirements
      const requirements = this.analyzeRequirements();
      console.log(`THINK: Backend Agent V2 identified requirements: ${requirements.join(', ')}`);
      
      // Apply enhancements
      const enhancedCode = this.enhanceBackend(sourceCode, requirements);
      
      // Write output
      this.writeEnhancedBackend(enhancedCode);
      
      console.log('✅ Backend Agent V2: Complete');
      
    } catch (error: any) {
      console.error('❌ Backend Agent V2 error:', error.message);
      throw error;
    }
  }

  private loadConfig(): void {
    try {
      const configData = readFileSync('config/agents.json', 'utf8');
      const config = JSON.parse(configData);
      this.agentConfig = config.agents?.find((a: any) => a.name === 'backend-agent');
      
      if (!this.agentConfig) {
        throw new Error('backend-agent configuration not found in config/agents.json');
      }
      
      console.log('📖 Backend Agent V2: Loaded configuration');
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
      
      console.log(`📖 Backend Agent V2: Loaded execution plan ${this.executionPlan!.planId}`);
    } catch (error: any) {
      throw new Error(`Failed to load execution plan: ${error.message}`);
    }
  }

  private loadInstructions(): void {
    try {
      this.instructions = readFileSync('instructions.md', 'utf8');
      console.log('📖 Backend Agent V2: Loaded instructions');
    } catch (error: any) {
      throw new Error(`Failed to load instructions: ${error.message}`);
    }
  }

  private validateExecution(): void {
    // Check if this agent should execute based on execution plan
    const backendTask = this.executionPlan!.tasks.find(t => t.agent === 'backend-agent');
    if (!backendTask) {
      throw new Error('No backend task found in execution plan');
    }
    
    // Validate write paths
    const writePaths = this.agentConfig!.defaultPolicy.writePaths;
    if (!writePaths.some(path => path.startsWith('outputs/backend'))) {
      throw new Error('Invalid write paths - must write to outputs/backend/**');
    }
    
    console.log('✅ Backend Agent V2: Validation passed');
  }

  private readSourceCode(): string {
    const readPaths = this.agentConfig!.defaultPolicy.readPaths;
    
    for (const readPath of readPaths) {
      const basePath = readPath.replace('/**', '');
      
      if (existsSync(basePath)) {
        const files = this.findSourceFiles(basePath);
        
        if (files.length > 0) {
          const content = readFileSync(files[0], 'utf8');
          console.log(`📖 Backend Agent V2: Read source from ${files[0]}`);
          return content;
        }
      }
    }
    
    throw new Error('No backend source files found in configured read paths');
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
    
    // Look for phone field requirement
    if (keyReqs.some(req => /phone.*field/i.test(req))) {
      requirements.push('add_phone_field');
    }
    
    // Look for API modification requirement
    if (keyReqs.some(req => /update.*backend.*api/i.test(req))) {
      requirements.push('modify_existing_apis');
    }
    
    // Look for authentication requirement
    if (keyReqs.some(req => /authentication/i.test(req))) {
      requirements.push('maintain_authentication');
    }
    
    return requirements;
  }

  private enhanceBackend(sourceCode: string, requirements: string[]): string {
    let enhanced = sourceCode;
    
    // Add agent attribution header (MUST DO rule)
    const timestamp = new Date().toISOString();
    const header = `// Enhanced by backend-agent-v2 ⚙️
// Created: ${timestamp}
// Agent: agent/backend-agent-v2.ts
// Requirements: ${requirements.join(', ')}
// Plan ID: ${this.executionPlan!.planId}

`;
    
    enhanced = header + enhanced;
    
    // Apply phone field enhancement if required
    if (requirements.includes('add_phone_field')) {
      enhanced = this.addPhoneFieldSupport(enhanced);
    }
    
    return enhanced;
  }

  private addPhoneFieldSupport(code: string): string {
    let enhanced = code;
    
    // Add phone to User interface
    enhanced = enhanced.replace(
      /(password: string;)/,
      `$1
  phone?: string;`
    );
    
    // Add phone to destructuring in user registration
    enhanced = enhanced.replace(
      /const \{ username, password \} = req\.body;/,
      'const { username, password, phone } = req.body;'
    );
    
    // Add phone validation after password validation
    enhanced = enhanced.replace(
      /(if \(password\.length < 6\) \{\s*return res\.status\(400\)\.json\(\{ error: 'Password must be at least 6 characters' \}\);\s*\})/,
      `$1

  // Phone validation
  if (phone && !/^[\\+]?[1-9][\\d]{0,15}$/.test(phone.replace(/[\\s\\-\\(\\)]/g, ''))) {
    return res.status(400).json({
      error: 'Invalid phone number format'
    });
  }`
    );
    
    // Add phone to user object creation
    enhanced = enhanced.replace(
      /(const newUser: User = \{[^}]+password,)/,
      `$1
    phone: phone || undefined,`
    );
    
    // Add phone to GET /api/users response
    enhanced = enhanced.replace(
      /(const userList = users\.map\(user => \(\{[^}]+password: user\.password,)/,
      `$1
    phone: user.phone,`
    );
    
    // Add phone to login endpoint
    enhanced = enhanced.replace(
      /(\/\/ POST \/api\/auth\/login[\s\S]*?const \{ username, password \} = req\.body;)/,
      (match) => match.replace('const { username, password }', 'const { username, password, phone }')
    );
    
    return enhanced;
  }

  private writeEnhancedBackend(code: string): void {
    // Ensure output directory exists (following writePaths rule)
    const writePaths = this.agentConfig!.defaultPolicy.writePaths;
    const outputDir = writePaths[0].replace('/**', '');
    
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
      console.log(`📁 Backend Agent V2: Created ${outputDir}/`);
    }
    
    // Write enhanced backend file
    const outputFile = join(outputDir, 'backend.ts');
    writeFileSync(outputFile, code, 'utf8');
    
    console.log(`💾 Backend Agent V2: Enhanced backend saved to ${outputFile}`);
  }
}

// Export for orchestrator use
export default BackendAgentV2;