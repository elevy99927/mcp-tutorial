#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * Test Writing Agent
 * This agent analyzes source code and generates Vitest tests
 */
class TestWriterAgent {
  
  /**
   * Analyze source code and generate tests
   */
  async generateTests(): Promise<void> {
    console.log('🤖 Hello! I\'m your Test Writing Agent.');
    console.log('I can analyze your code and generate Vitest tests.');
    console.log('Analyzing source files...\n');
    
    try {
      // Read the main source file
      const sourceFile = 'src/index.ts';
      if (!existsSync(sourceFile)) {
        console.log('❌ No source file found at src/index.ts');
        return;
      }
      
      const sourceCode = readFileSync(sourceFile, 'utf8');
      console.log(`📄 Found source file: ${sourceFile}`);
      
      // Extract exported functions
      const functions = this.extractFunctions(sourceCode);
      console.log(`🔍 Found ${functions.length} exported functions: ${functions.map(f => f.name).join(', ')}`);
      
      // Generate test file
      const testContent = this.generateTestContent(functions);
      const testFile = 'tests/generated.test.ts';
      
      writeFileSync(testFile, testContent);
      console.log(`✅ Generated test file: ${testFile}`);
      
      console.log('\n📊 Test generation complete!');
      console.log('💡 Run `npm test` to execute the generated tests');
      
    } catch (error: any) {
      console.error('❌ Test generation failed:', error.message);
    }
  }
  
  /**
   * Extract exported functions from TypeScript source code
   */
  private extractFunctions(sourceCode: string): Array<{name: string, params: string[]}> {
    const functions: Array<{name: string, params: string[]}> = [];
    
    // Simple regex to find exported functions
    const functionRegex = /export\s+function\s+(\w+)\s*\(([^)]*)\)/g;
    let match;
    
    while ((match = functionRegex.exec(sourceCode)) !== null) {
      const name = match[1];
      const paramsStr = match[2];
      const params = paramsStr.split(',').map(p => p.trim().split(':')[0].trim()).filter(p => p);
      
      functions.push({ name, params });
    }
    
    return functions;
  }
  
  /**
   * Generate test content for the extracted functions
   */
  private generateTestContent(functions: Array<{name: string, params: string[]}>): string {
    const imports = `import { describe, it, expect } from "vitest";
import { ${functions.map(f => f.name).join(', ')} } from "../src/index.js";

`;
    
    const tests = functions.map(func => {
      return `describe("${func.name}", () => {
  it("should work with basic inputs", () => {
    // TODO: Add meaningful test cases for ${func.name}
    expect(${func.name}).toBeDefined();
  });
  
  it("should handle edge cases", () => {
    // TODO: Add edge case tests for ${func.name}
    expect(typeof ${func.name}).toBe('function');
  });
});

`;
    }).join('');
    
    return imports + tests;
  }
  
  /**
   * Show project info
   */
  showProjectInfo(): void {
    try {
      const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
      console.log(`📦 Project: ${packageJson.name} v${packageJson.version}`);
    } catch (error) {
      console.log('📦 Project information not available');
    }
  }
}

// Run the agent
async function main() {
  console.log('🚀 Starting Test Writing Agent...\n');
  
  const agent = new TestWriterAgent();
  agent.showProjectInfo();
  console.log(''); // Empty line
  await agent.generateTests();
}

// Execute the agent
main().catch((error) => {
  console.error('💥 Agent failed:', error.message);
  process.exit(1);
});

export { TestWriterAgent };