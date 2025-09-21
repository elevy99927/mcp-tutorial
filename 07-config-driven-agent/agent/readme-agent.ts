import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs';

/**
 * README Agent
 * Specialized agent for generating comprehensive README documentation
 */
export class ReadmeAgent {
  
  async generateReadme(): Promise<void> {
    console.log('  📖 README Agent: Analyzing project structure...');
    
    try {
      // Analyze project structure
      const projectInfo = this.analyzeProject();
      console.log(`  🔍 Found ${projectInfo.sourceFiles.length} source files, ${projectInfo.agents.length} agents`);
      
      // Generate README content
      const readmeContent = this.generateReadmeContent(projectInfo);
      
      // Ensure outputs directory exists
      if (!existsSync('outputs')) {
        mkdirSync('outputs');
        console.log('  📁 Created outputs/ directory');
      }
      
      // Write the README file
      const readmeFile = 'outputs/README.auto.md';
      writeFileSync(readmeFile, readmeContent);
      console.log(`  ✅ Generated ${readmeFile}`);
      
    } catch (error: any) {
      console.error('  ❌ README Agent error:', error.message);
    }
  }
  
  /**
   * Analyze project structure and extract information
   */
  private analyzeProject(): {
    name: string,
    version: string,
    sourceFiles: string[],
    agents: string[],
    hasTests: boolean,
    hasMermaid: boolean,
    functions: Array<{file: string, functions: string[]}>
  } {
    // Read package.json
    let packageInfo = { name: 'unknown', version: '0.0.0' };
    try {
      const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
      packageInfo = { name: packageJson.name, version: packageJson.version };
    } catch (error) {
      console.log('  ⚠️  Could not read package.json');
    }
    
    // Scan source files
    const sourceFiles = this.scanDirectory('src');
    
    // Scan agent files
    const agents = this.scanDirectory('agent');
    
    // Check for generated content
    const hasTests = existsSync('outputs/tests/smoke.auto.test.ts');
    const hasMermaid = existsSync('outputs/mermaid/mermaid.md');
    
    // Extract functions from source files
    const functions = this.extractAllFunctions(sourceFiles);
    
    return {
      name: packageInfo.name,
      version: packageInfo.version,
      sourceFiles,
      agents,
      hasTests,
      hasMermaid,
      functions
    };
  }
  
  /**
   * Scan directory for TypeScript files
   */
  private scanDirectory(dir: string): string[] {
    try {
      return readdirSync(dir)
        .filter(file => file.endsWith('.ts'))
        .map(file => file.replace('.ts', ''));
    } catch (error) {
      return [];
    }
  }
  
  /**
   * Extract functions from all source files
   */
  private extractAllFunctions(sourceFiles: string[]): Array<{file: string, functions: string[]}> {
    const result: Array<{file: string, functions: string[]}> = [];
    
    for (const file of sourceFiles) {
      try {
        const sourceCode = readFileSync(`src/${file}.ts`, 'utf8');
        const functions = this.extractFunctions(sourceCode);
        if (functions.length > 0) {
          result.push({ file, functions });
        }
      } catch (error) {
        // Skip files that can't be read
      }
    }
    
    return result;
  }
  
  /**
   * Extract function names from source code
   */
  private extractFunctions(sourceCode: string): string[] {
    const functions: string[] = [];
    const functionRegex = /export\s+function\s+(\w+)/g;
    let match;
    
    while ((match = functionRegex.exec(sourceCode)) !== null) {
      functions.push(match[1]);
    }
    
    return functions;
  }
  
  /**
   * Generate comprehensive README content
   */
  private generateReadmeContent(projectInfo: any): string {
    const timestamp = new Date().toISOString();
    
    let content = `# ${projectInfo.name}

> Auto-generated README by README Agent 📖  
> Created: ${timestamp}  
> Agent: agent/readme-agent.ts

## Overview

${projectInfo.name} is a config-driven agent system that demonstrates orchestrated automation with specialized sub-agents.

## Quick Start

\`\`\`bash
cd ${projectInfo.name}
npm install
npm run agent    # Run config-driven orchestrator
npm test         # Execute generated tests
\`\`\`

## Project Structure

\`\`\`
${projectInfo.name}/
├── config/
│   └── agents.json         # Agent configuration and policies
├── src/                    # Source code (${projectInfo.sourceFiles.length} files)
${projectInfo.sourceFiles.map(f => `│   ├── ${f}.ts`).join('\n')}
├── agent/                  # Agent implementations (${projectInfo.agents.length} agents)
${projectInfo.agents.map(a => `│   ├── ${a}.ts`).join('\n')}
├── outputs/                # Generated content directory
${projectInfo.hasTests ? '│   ├── tests/\n│   │   └── smoke.auto.test.ts   # Generated tests' : '│   ├── tests/                   # (no tests generated yet)'}
${projectInfo.hasMermaid ? '│   ├── mermaid/\n│   │   └── mermaid.md          # Generated diagrams' : '│   ├── mermaid/                 # (no diagrams generated yet)'}
│   └── README.auto.md      # This file (auto-generated)
└── agent/
\`\`\`

## Available Functions

`;

    // Add function documentation
    for (const { file, functions } of projectInfo.functions) {
      content += `### ${file}.ts

${functions.map(f => `- \`${f}()\``).join('\n')}

`;
    }

    content += `## Agents

This project uses a config-driven agent system with the following specialized agents:

### 🔥 Smoke Test Agent
- **Capabilities**: tests, smoke
- **Purpose**: Generates comprehensive test suites
- **Output**: \`tests/smoke.auto.test.ts\`

### 📊 Mermaid Agent  
- **Capabilities**: docs, diagram, mermaid, flow
- **Purpose**: Creates visual flow diagrams
- **Output**: \`mermaid/mermaid.md\`

### 📖 README Agent
- **Capabilities**: docs, readme, documentation
- **Purpose**: Generates project documentation
- **Output**: \`README.auto.md\` (this file)

## Configuration

Agent behavior is controlled by \`config/agents.json\`:

- **Capabilities**: What each agent can do
- **Policies**: Security restrictions (file access, network, shell)
- **Write Paths**: Where agents can create files
- **Deny Paths**: Forbidden directories

## Usage Examples

\`\`\`bash
# Generate all documentation and tests
npm run agent

# Run specific tasks via instructions.md
echo "Create smoke tests and mermaid diagram" > instructions.md
npm run agent

# Execute generated tests
npm test
\`\`\`

## Generated Content

${projectInfo.hasTests ? '✅ **Tests**: Comprehensive smoke tests generated' : '❌ **Tests**: No tests generated yet'}
${projectInfo.hasMermaid ? '✅ **Diagrams**: Mermaid flow diagrams generated' : '❌ **Diagrams**: No diagrams generated yet'}
✅ **Documentation**: This README auto-generated

## Next Steps

1. Modify \`instructions.md\` to request specific tasks
2. Run \`npm run agent\` to execute the orchestrator
3. Check generated files in \`tests/\`, \`mermaid/\`, and root directory
4. Customize agent behavior in \`config/agents.json\`

---

*This README was automatically generated by the README Agent. To regenerate, run \`npm run agent\` with appropriate instructions.*
`;

    return content;
  }
}