import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';

/**
 * Generic Frontend Agent
 * Receives instructions to modify frontend forms, add/remove fields, and create tests
 */
export class FrontendAgent {
  private instructions: string = '';
  
  async generateFrontend(): Promise<void> {
    console.log('  🎨 Frontend Agent: Starting frontend enhancement...');
    
    try {
      // Ensure outputs directory exists
      this.ensureOutputDirectories();
      
      // Read instructions to understand what modifications to make
      this.instructions = this.readInstructions();
      
      // Read current frontend.ts
      const currentCode = this.readCurrentCode();
      console.log('  🔍 Analyzed existing frontend code structure');
      
      // Parse instructions for field modifications
      const fieldModifications = this.parseFieldInstructions();
      console.log(`  📝 Parsed ${fieldModifications.length} field modifications`);
      
      // Generate enhanced frontend code
      const enhancedCode = this.enhanceFrontendCode(currentCode, fieldModifications);
      
      // Write enhanced frontend file
      const frontendFile = 'outputs/frontend.ts';
      writeFileSync(frontendFile, enhancedCode);
      console.log(`  ✅ Generated ${frontendFile}`);
      
      // Tests are now handled by frontend-tests-agent
      // await this.generateFrontendTests(fieldModifications);
      
      // Generate HTML demo
      const htmlDemo = this.generateHtmlDemo(fieldModifications);
      const htmlFile = 'outputs/frontend/demo.html';
      writeFileSync(htmlFile, htmlDemo);
      console.log(`  ✅ Generated ${htmlFile}`);
      
    } catch (error: any) {
      console.error('  ❌ Frontend Agent error:', error.message);
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
    if (!existsSync('outputs/frontend')) {
      mkdirSync('outputs/frontend');
      console.log('  📁 Created outputs/frontend/ directory');
    }
    // Tests directory is handled by frontend-tests-agent
    // if (!existsSync('outputs/tests')) {
    //   mkdirSync('outputs/tests');
    //   console.log('  📁 Created outputs/tests/ directory');
    // }
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
   * Read current frontend code
   */
  private readCurrentCode(): string {
    try {
      return readFileSync('src/frontend.ts', 'utf8');
    } catch (error) {
      console.log('  ⚠️  Could not read src/frontend.ts');
      return '';
    }
  }
  
  /**
   * Parse field modification instructions
   */
  private parseFieldInstructions(): FieldModification[] {
    const modifications: FieldModification[] = [];
    
    // Parse "add email field" type instructions
    const addFieldPatterns = [
      /add\s+(\w+)\s+(?:field|input)/gi,
      /include\s+(\w+)\s+(?:field|input)/gi,
      /(\w+)\s+as\s+additional\s+input/gi
    ];
    
    // Parse "remove field" type instructions
    const removeFieldPatterns = [
      /remove\s+(\w+)\s+(?:field|input)/gi,
      /delete\s+(\w+)\s+(?:field|input)/gi
    ];
    
    for (const pattern of addFieldPatterns) {
      let match;
      while ((match = pattern.exec(this.instructions)) !== null) {
        const fieldName = match[1].toLowerCase();
        const fieldType = this.determineFieldType(fieldName);
        modifications.push({
          action: 'add',
          fieldName,
          fieldType,
          required: this.isFieldRequired(fieldName)
        });
      }
    }
    
    for (const pattern of removeFieldPatterns) {
      let match;
      while ((match = pattern.exec(this.instructions)) !== null) {
        const fieldName = match[1].toLowerCase();
        modifications.push({
          action: 'remove',
          fieldName,
          fieldType: 'text',
          required: false
        });
      }
    }
    
    return modifications;
  }
  
  /**
   * Determine field type based on field name
   */
  private determineFieldType(fieldName: string): string {
    const typeMap: { [key: string]: string } = {
      'email': 'email',
      'password': 'password',
      'phone': 'tel',
      'telephone': 'tel',
      'age': 'number',
      'number': 'number',
      'date': 'date',
      'time': 'time',
      'url': 'url',
      'website': 'url'
    };
    
    return typeMap[fieldName] || 'text';
  }
  
  /**
   * Determine if field should be required
   */
  private isFieldRequired(fieldName: string): boolean {
    // Check if instructions specify optional
    const optionalPattern = new RegExp(`${fieldName}.*optional`, 'i');
    if (optionalPattern.test(this.instructions)) {
      return false;
    }
    
    // Default required fields
    const requiredFields = ['username', 'password'];
    return requiredFields.includes(fieldName);
  }
  
  /**
   * Generate validation function for field type
   */
  private generateValidationFunction(fieldName: string, fieldType: string): string {
    switch (fieldType) {
      case 'email':
        return `function validate${this.capitalize(fieldName)}(${fieldName}: string): boolean {
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return emailRegex.test(${fieldName});
}`;
      
      case 'tel':
        return `function validate${this.capitalize(fieldName)}(${fieldName}: string): boolean {
  const phoneRegex = /^[\\+]?[1-9][\\d]{0,15}$/;
  return phoneRegex.test(${fieldName}.replace(/[\\s\\-\\(\\)]/g, ''));
}`;
      
      case 'number':
        return `function validate${this.capitalize(fieldName)}(${fieldName}: string): boolean {
  const num = parseInt(${fieldName});
  return !isNaN(num) && num > 0;
}`;
      
      case 'url':
        return `function validate${this.capitalize(fieldName)}(${fieldName}: string): boolean {
  try {
    new URL(${fieldName});
    return true;
  } catch {
    return false;
  }
}`;
      
      default:
        return `function validate${this.capitalize(fieldName)}(${fieldName}: string): boolean {
  return ${fieldName}.length >= 2 && ${fieldName}.length <= 50;
}`;
    }
  }
  
  /**
   * Enhance frontend code with field modifications
   */
  private enhanceFrontendCode(currentCode: string, modifications: FieldModification[]): string {
    const timestamp = new Date().toISOString();
    let enhancedCode = currentCode;
    
    // Add header comment
    enhancedCode = `// Enhanced by Frontend Agent 🎨
// Created: ${timestamp}
// Agent: agent/frontend-agent.ts
// Enhanced with dynamic field modifications

${enhancedCode}`;
    
    // Process field modifications
    for (const mod of modifications) {
      if (mod.action === 'add') {
        enhancedCode = this.addFieldToCode(enhancedCode, mod);
      } else if (mod.action === 'remove') {
        enhancedCode = this.removeFieldFromCode(enhancedCode, mod);
      }
    }
    
    return enhancedCode;
  }
  
  /**
   * Add field to frontend code
   */
  private addFieldToCode(code: string, field: FieldModification): string {
    let enhancedCode = code;
    
    // Add field to LoginForm interface
    const interfaceRegex = /interface LoginForm \{([^}]*)\}/;
    const interfaceMatch = enhancedCode.match(interfaceRegex);
    if (interfaceMatch) {
      const currentFields = interfaceMatch[1];
      const newField = `  ${field.fieldName}${field.required ? '' : '?'}: string;`;
      const updatedInterface = `interface LoginForm {${currentFields}${newField}\n}`;
      enhancedCode = enhancedCode.replace(interfaceRegex, updatedInterface);
    }
    
    // Add field to AuthResult user object if it doesn't exist
    const userObjectRegex = /user\?: \{([^}]*)\}/;
    const userMatch = enhancedCode.match(userObjectRegex);
    if (userMatch && !userMatch[1].includes(field.fieldName)) {
      const currentUserFields = userMatch[1];
      const newUserField = `    ${field.fieldName}?: string;`;
      const updatedUserObject = `user?: {${currentUserFields}${newUserField}\n  }`;
      enhancedCode = enhancedCode.replace(userObjectRegex, updatedUserObject);
    }
    
    // Add validation function
    const validationFunction = this.generateValidationFunction(field.fieldName, field.fieldType);
    const insertPoint = enhancedCode.indexOf('function authenticateUser');
    if (insertPoint !== -1) {
      enhancedCode = enhancedCode.slice(0, insertPoint) + validationFunction + '\n\n' + enhancedCode.slice(insertPoint);
    }
    
    // Update authenticateUser function to include new field validation
    enhancedCode = this.updateAuthenticateUserFunction(enhancedCode, field);
    
    // Add field to HTML form
    enhancedCode = this.addFieldToHtmlForm(enhancedCode, field);
    
    // Update JavaScript to handle new field
    enhancedCode = this.updateJavaScriptForField(enhancedCode, field);
    
    // Update login endpoint
    enhancedCode = this.updateLoginEndpoint(enhancedCode, field);
    
    return enhancedCode;
  }
  
  /**
   * Remove field from frontend code
   */
  private removeFieldFromCode(code: string, field: FieldModification): string {
    let enhancedCode = code;
    
    // Remove from LoginForm interface
    const fieldRegex = new RegExp(`\\s*${field.fieldName}\\??:\\s*string;`, 'g');
    enhancedCode = enhancedCode.replace(fieldRegex, '');
    
    // Remove validation function
    const validationFuncRegex = new RegExp(`function validate${this.capitalize(field.fieldName)}[^}]*}\\s*`, 'g');
    enhancedCode = enhancedCode.replace(validationFuncRegex, '');
    
    // Remove from HTML form
    const htmlFieldRegex = new RegExp(`\\s*<div class="form-group">\\s*<label for="${field.fieldName}">[^<]*</label>\\s*<input[^>]*id="${field.fieldName}"[^>]*>\\s*</div>`, 'g');
    enhancedCode = enhancedCode.replace(htmlFieldRegex, '');
    
    return enhancedCode;
  }
  
  /**
   * Update authenticateUser function to include field validation
   */
  private updateAuthenticateUserFunction(code: string, field: FieldModification): string {
    const funcRegex = /function authenticateUser\(form: LoginForm\): AuthResult \{([^}]*(?:\{[^}]*\}[^}]*)*)\}/;
    const match = code.match(funcRegex);
    
    if (match) {
      let funcBody = match[1];
      
      // Add validation check
      const validationCheck = `
  if (form.${field.fieldName} && !validate${this.capitalize(field.fieldName)}(form.${field.fieldName})) {
    errors.push('Please enter a valid ${field.fieldName}');
  }`;
      
      // Insert validation check after existing validations
      const insertPoint = funcBody.indexOf('if (errors.length > 0)');
      if (insertPoint !== -1) {
        funcBody = funcBody.slice(0, insertPoint) + validationCheck + '\n\n  ' + funcBody.slice(insertPoint);
      }
      
      // Add field to successful authentication response
      if (funcBody.includes('user: {')) {
        funcBody = funcBody.replace(
          /user: \{([^}]*)\}/,
          `user: {$1,
        ${field.fieldName}: form.${field.fieldName}
      }`
        );
      }
      
      const updatedFunction = `function authenticateUser(form: LoginForm): AuthResult {${funcBody}}`;
      return code.replace(funcRegex, updatedFunction);
    }
    
    return code;
  }
  
  /**
   * Add field to HTML form
   */
  private addFieldToHtmlForm(code: string, field: FieldModification): string {
    const formFieldHtml = `            
            <div class="form-group">
                <label for="${field.fieldName}">${this.capitalize(field.fieldName)}${field.required ? '' : ' (optional)'}:</label>
                <input type="${field.fieldType}" id="${field.fieldName}" name="${field.fieldName}"${field.required ? ' required' : ''}>
            </div>`;
    
    // Insert before the submit button
    const buttonRegex = /(\s*<button type="submit">Login<\/button>)/;
    return code.replace(buttonRegex, formFieldHtml + '$1');
  }
  
  /**
   * Update JavaScript to handle new field
   */
  private updateJavaScriptForField(code: string, field: FieldModification): string {
    // Add field to formData object
    const formDataRegex = /(const formData = \{[^}]*)/;
    const match = code.match(formDataRegex);
    if (match) {
      const updatedFormData = `${match[1]},
                ${field.fieldName}: document.getElementById('${field.fieldName}').value`;
      code = code.replace(formDataRegex, updatedFormData);
    }
    
    // Add field to result display
    const resultDisplayRegex = /(if \(result\.success && result\.user\) \{[^}]*)/;
    const resultMatch = code.match(resultDisplayRegex);
    if (resultMatch) {
      const fieldDisplay = `
                    if (result.user.${field.fieldName}) {
                        resultDiv.innerHTML += '<br>${this.capitalize(field.fieldName)}: ' + result.user.${field.fieldName};
                    }`;
      code = code.replace(resultDisplayRegex, resultMatch[1] + fieldDisplay);
    }
    
    return code;
  }
  
  /**
   * Update login endpoint to handle new field
   */
  private updateLoginEndpoint(code: string, field: FieldModification): string {
    // Add field to destructuring
    const destructureRegex = /(const \{ username, password[^}]*) \} = req\.body;/;
    const match = code.match(destructureRegex);
    if (match) {
      const updatedDestructure = `${match[1]}, ${field.fieldName} } = req.body;`;
      code = code.replace(destructureRegex, updatedDestructure);
    }
    
    // Add field to loginForm object
    const loginFormRegex = /(const loginForm: LoginForm = \{[^}]*)/;
    const formMatch = code.match(loginFormRegex);
    if (formMatch) {
      const updatedLoginForm = `${formMatch[1]},
    ${field.fieldName}: ${field.fieldName} || undefined`;
      code = code.replace(loginFormRegex, updatedLoginForm);
    }
    
    return code;
  }
  
  /**
   * Generate tests for the enhanced frontend
   * NOTE: This method is disabled - tests are now handled by frontend-tests-agent
   */
  private async generateFrontendTests(modifications: FieldModification[]): Promise<void> {
    // Tests are now generated by the dedicated frontend-tests-agent
    // This method is kept for reference but disabled
    console.log('  ℹ️  Test generation skipped - handled by frontend-tests-agent');
  }
  
  /**
   * Generate test value for field type (used for HTML demo)
   */
  private generateTestValue(fieldName: string, fieldType: string): string {
    switch (fieldType) {
      case 'email':
        return 'test@example.com';
      case 'tel':
        return '+1234567890';
      case 'number':
        return '25';
      case 'url':
        return 'https://example.com';
      default:
        return 'testvalue';
    }
  }
  
  /**
   * Generate HTML demo with all fields
   */
  private generateHtmlDemo(modifications: FieldModification[]): string {
    const timestamp = new Date().toISOString();
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enhanced Frontend Agent Demo</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            text-align: center;
            margin-bottom: 30px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #555;
        }
        input[type="text"], input[type="password"], input[type="email"], 
        input[type="tel"], input[type="number"], input[type="url"], input[type="date"] {
            width: 100%;
            padding: 10px;
            border: 2px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
            box-sizing: border-box;
        }
        input:focus {
            border-color: #4CAF50;
            outline: none;
        }
        button {
            background-color: #4CAF50;
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            width: 100%;
        }
        button:hover {
            background-color: #45a049;
        }
        .result {
            margin-top: 20px;
            padding: 15px;
            border-radius: 5px;
            display: none;
        }
        .success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .note {
            background-color: #e2e3e5;
            color: #383d41;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
        }
        .agent-info {
            background-color: #d1ecf1;
            color: #0c5460;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 20px;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="agent-info">
            Generated by Frontend Agent 🎨 | ${timestamp}<br>
            Dynamic form with ${modifications.length} field modifications
        </div>
        
        <h1>Enhanced Login Form</h1>
        <p>This form was dynamically generated based on instructions.</p>
        
        <form id="loginForm">
            <div class="form-group">
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" required>
            </div>
            
            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required>
            </div>
            
            ${modifications.map(field => {
              if (field.action === 'add') {
                return `<div class="form-group">
                <label for="${field.fieldName}">${this.capitalize(field.fieldName)}${field.required ? '' : ' (optional)'}:</label>
                <input type="${field.fieldType}" id="${field.fieldName}" name="${field.fieldName}"${field.required ? ' required' : ''}>
            </div>`;
              }
              return '';
            }).join('\n            ')}
            
            <button type="submit">Login</button>
        </form>
        
        <div id="result" class="result"></div>
        
        <div class="note">
            <strong>Demo Credentials:</strong><br>
            Username: admin<br>
            Password: password123<br>
            ${modifications.map(field => {
              if (field.action === 'add') {
                return `${this.capitalize(field.fieldName)}: ${this.generateTestValue(field.fieldName, field.fieldType)}`;
              }
              return '';
            }).filter(Boolean).join('<br>\n            ')}
        </div>
    </div>

    <script>
        // Validation functions
        ${modifications.map(field => {
          if (field.action === 'add') {
            return this.generateClientSideValidation(field.fieldName, field.fieldType);
          }
          return '';
        }).join('\n        ')}
        
        // Handle form submission
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                username: document.getElementById('username').value,
                password: document.getElementById('password').value${modifications.map(field => {
                  if (field.action === 'add') {
                    return `,
                ${field.fieldName}: document.getElementById('${field.fieldName}').value`;
                  }
                  return '';
                }).join('')}
            };
            
            // Simple client-side validation demo
            const errors = [];
            
            if (formData.username.length < 3) {
                errors.push('Username must be at least 3 characters');
            }
            
            if (formData.password.length < 6) {
                errors.push('Password must be at least 6 characters');
            }
            
            ${modifications.map(field => {
              if (field.action === 'add') {
                return `if (formData.${field.fieldName} && !validate${this.capitalize(field.fieldName)}(formData.${field.fieldName})) {
                errors.push('Please enter a valid ${field.fieldName}');
            }`;
              }
              return '';
            }).join('\n            ')}
            
            const resultDiv = document.getElementById('result');
            resultDiv.style.display = 'block';
            
            if (errors.length > 0) {
                resultDiv.className = 'result error';
                resultDiv.textContent = 'Validation failed: ' + errors.join(', ');
            } else if (formData.username === 'admin' && formData.password === 'password123') {
                resultDiv.className = 'result success';
                resultDiv.innerHTML = 'Login successful!<br><strong>Welcome, ' + formData.username + '!</strong>';
                ${modifications.map(field => {
                  if (field.action === 'add') {
                    return `if (formData.${field.fieldName}) {
                    resultDiv.innerHTML += '<br>${this.capitalize(field.fieldName)}: ' + formData.${field.fieldName};
                }`;
                  }
                  return '';
                }).join('\n                ')}
            } else {
                resultDiv.className = 'result error';
                resultDiv.textContent = 'Invalid username or password';
            }
        });
    </script>
</body>
</html>`;
  }
  
  /**
   * Generate client-side validation function
   */
  private generateClientSideValidation(fieldName: string, fieldType: string): string {
    switch (fieldType) {
      case 'email':
        return `function validate${this.capitalize(fieldName)}(${fieldName}) {
            const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
            return emailRegex.test(${fieldName});
        }`;
      
      case 'tel':
        return `function validate${this.capitalize(fieldName)}(${fieldName}) {
            const phoneRegex = /^[\\+]?[1-9][\\d]{0,15}$/;
            return phoneRegex.test(${fieldName}.replace(/[\\s\\-\\(\\)]/g, ''));
        }`;
      
      case 'number':
        return `function validate${this.capitalize(fieldName)}(${fieldName}) {
            const num = parseInt(${fieldName});
            return !isNaN(num) && num > 0;
        }`;
      
      case 'url':
        return `function validate${this.capitalize(fieldName)}(${fieldName}) {
            try {
                new URL(${fieldName});
                return true;
            } catch {
                return false;
            }
        }`;
      
      default:
        return `function validate${this.capitalize(fieldName)}(${fieldName}) {
            return ${fieldName}.length >= 2 && ${fieldName}.length <= 50;
        }`;
    }
  }
  
  /**
   * Capitalize first letter of string
   */
  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

/**
 * Interface for field modifications
 */
interface FieldModification {
  action: 'add' | 'remove';
  fieldName: string;
  fieldType: string;
  required: boolean;
}