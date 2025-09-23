import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';

/**
 * Backend Agent
 * Specialized agent for backend API development and enhancement
 */
export class BackendAgent {
  private instructions: string = '';
  
  async generateBackend(): Promise<void> {
    console.log('  ⚙️ Backend Agent: Starting backend enhancement...');
    
    try {
      // Ensure outputs directory exists
      this.ensureOutputDirectories();
      
      // Read instructions to understand what modifications to make
      this.instructions = this.readInstructions();
      
      // Read current backend.ts
      const currentCode = this.readCurrentCode();
      console.log('  🔍 Analyzed existing backend code structure');
      
      // Parse instructions for backend modifications
      const modifications = this.parseBackendInstructions();
      console.log(`  📝 Parsed ${modifications.length} backend modifications`);
      
      // Generate enhanced backend code
      const enhancedCode = this.enhanceBackendCode(currentCode, modifications);
      
      // Write enhanced backend file
      const backendFile = 'outputs/backend.ts';
      writeFileSync(backendFile, enhancedCode);
      console.log(`  ✅ Generated ${backendFile}`);
      
    } catch (error: any) {
      console.error('  ❌ Backend Agent error:', error.message);
    }
  }
  
  /**
   * Ensure output directories exist
   */
  private ensureOutputDirectories(): void {
    if (!existsSync('outputs')) {
      mkdirSync('outputs');
      console.log('  📁 Created outputs/ directory');
    }
  }
  
  /**
   * Read instructions from instructions.md
   */
  private readInstructions(): string {
    try {
      return readFileSync('instructions.md', 'utf8');
    } catch (error) {
      console.log('  ⚠️  Could not read instructions.md');
      return '';
    }
  }
  
  /**
   * Read current backend code
   */
  private readCurrentCode(): string {
    try {
      return readFileSync('src/backend.ts', 'utf8');
    } catch (error) {
      console.log('  ⚠️  Could not read src/backend.ts');
      return '';
    }
  }  

  /**
   * Parse backend modification instructions
   */
  private parseBackendInstructions(): BackendModification[] {
    const modifications: BackendModification[] = [];
    
    // Parse "add endpoint" instructions
    const endpointPatterns = [
      /add\s+(\w+)\s+endpoint/gi,
      /create\s+(\w+)\s+api/gi,
      /(\w+)\s+endpoint/gi
    ];
    
    // Parse "add authentication" instructions
    const authPatterns = [
      /add\s+authentication/gi,
      /implement\s+auth/gi,
      /jwt\s+token/gi
    ];
    
    // Parse "add database" instructions
    const dbPatterns = [
      /add\s+database/gi,
      /implement\s+storage/gi,
      /data\s+persistence/gi
    ];
    
    for (const pattern of endpointPatterns) {
      let match;
      while ((match = pattern.exec(this.instructions)) !== null) {
        const endpointName = match[1].toLowerCase();
        modifications.push({
          type: 'endpoint',
          name: endpointName,
          action: 'add'
        });
      }
    }
    
    if (authPatterns.some(pattern => pattern.test(this.instructions))) {
      modifications.push({
        type: 'authentication',
        name: 'jwt',
        action: 'add'
      });
    }
    
    if (dbPatterns.some(pattern => pattern.test(this.instructions))) {
      modifications.push({
        type: 'database',
        name: 'storage',
        action: 'add'
      });
    }
    
    return modifications;
  }
  
  /**
   * Enhance backend code with modifications
   */
  private enhanceBackendCode(currentCode: string, modifications: BackendModification[]): string {
    const timestamp = new Date().toISOString();
    let enhancedCode = currentCode;
    
    // Add header comment
    enhancedCode = `// Enhanced by Backend Agent ⚙️
// Created: ${timestamp}
// Agent: agent/backend-agent.ts
// Enhanced with backend modifications

${enhancedCode}`;
    
    // Process modifications
    for (const mod of modifications) {
      if (mod.action === 'add') {
        enhancedCode = this.addBackendFeature(enhancedCode, mod);
      }
    }
    
    return enhancedCode;
  }
  
  /**
   * Add backend feature based on modification
   */
  private addBackendFeature(code: string, modification: BackendModification): string {
    switch (modification.type) {
      case 'endpoint':
        return this.addApiEndpoint(code, modification.name);
      case 'authentication':
        return this.enhanceAuthentication(code);
      case 'database':
        return this.addDatabaseFeatures(code);
      default:
        return code;
    }
  }
  
  /**
   * Add new API endpoint
   */
  private addApiEndpoint(code: string, endpointName: string): string {
    const endpoint = `
// ${this.capitalize(endpointName)} endpoint
app.get('/api/${endpointName}', authenticateToken, (req, res) => {
  res.json({
    message: '${this.capitalize(endpointName)} endpoint',
    timestamp: new Date().toISOString(),
    data: []
  });
});

app.post('/api/${endpointName}', authenticateToken, (req, res) => {
  const data = req.body;
  res.status(201).json({
    message: '${this.capitalize(endpointName)} created',
    data: data
  });
});`;
    
    // Insert before error handling middleware
    const insertPoint = code.indexOf('// Error handling middleware');
    if (insertPoint !== -1) {
      return code.slice(0, insertPoint) + endpoint + '\n\n' + code.slice(insertPoint);
    }
    
    return code;
  }
  
  /**
   * Enhance authentication features
   */
  private enhanceAuthentication(code: string): string {
    // Add password hashing if not present
    if (!code.includes('bcrypt')) {
      const bcryptImport = "import bcrypt from 'bcrypt';\n";
      code = code.replace("import jwt from 'jsonwebtoken';", 
        "import jwt from 'jsonwebtoken';\n" + bcryptImport);
    }
    
    return code;
  }
  
  /**
   * Add database features
   */
  private addDatabaseFeatures(code: string): string {
    // Add database connection logic
    const dbFeatures = `
// Enhanced database features
const DATABASE_URL = process.env.DATABASE_URL || 'memory://localhost';

function initializeDatabase() {
  console.log('Database initialized:', DATABASE_URL);
  // In production: connect to real database
}

initializeDatabase();`;
    
    // Insert after imports
    const insertPoint = code.indexOf('const app = express();');
    if (insertPoint !== -1) {
      return code.slice(0, insertPoint) + dbFeatures + '\n\n' + code.slice(insertPoint);
    }
    
    return code;
  }
  
  /**
   * Capitalize first letter of string
   */
  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

/**
 * Interface for backend modifications
 */
interface BackendModification {
  type: 'endpoint' | 'authentication' | 'database';
  name: string;
  action: 'add' | 'remove' | 'modify';
}