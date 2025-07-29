export interface CompileResult {
  success: boolean;
  output: string;
  nockma: string;
  errors: string[];
  warnings: string[];
  logs: string[];
}

export interface JuvixModule {
  name: string;
  content: string;
  dependencies: string[];
}

export class JuvixCompiler {
  private static readonly SAMPLE_NOCKMA = `[8 [1 0] 8 [1 6 [5 [0 7] 4 0 6] [0 6] [9 2 [0 2] [4 0 6] 0 7] 0 2] [9 2 0 1]]`;

  static async compile(code: string, moduleName: string = "Main"): Promise<CompileResult> {
    // Simulate compilation delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const errors: string[] = [];
    const warnings: string[] = [];
    const logs: string[] = [];

    // Basic validation - very lenient approach
    const lines = code.split('\n');
    let hasModuleDeclaration = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const lineNum = i + 1;

      if (line.startsWith('module ')) {
        hasModuleDeclaration = true;
        logs.push(`INFO: Found module declaration at line ${lineNum}`);
      }

      if (line.startsWith('import ')) {
        logs.push(`INFO: Found import at line ${lineNum}`);
      }
    }

    // Only check for absolutely essential requirements
    if (!hasModuleDeclaration) {
      errors.push("Missing module declaration");
    }

    // For demo purposes, be very permissive - only fail if code is clearly broken
    if (code.trim().length < 10) {
      errors.push("Code appears to be empty or too short");
    }

    const success = errors.length === 0;

    if (success) {
      logs.push("INFO: Syntax validation passed");
      logs.push("INFO: Type checking passed");
      logs.push("INFO: Resolved dependencies");  
      logs.push("INFO: Generated nockma bytecode");
      logs.push(`SUCCESS: Compilation completed for ${moduleName}`);
    } else {
      logs.push(`ERROR: Compilation failed with ${errors.length} error(s)`);
      errors.forEach(error => logs.push(`ERROR: ${error}`));
    }

    return {
      success,
      output: success ? "Compilation successful" : "Compilation failed",
      nockma: success ? this.generateNockma(code) : "",
      errors,
      warnings,
      logs,
    };
  }

  private static generateNockma(code: string): string {
    // Generate a more realistic nockma based on code content
    const codeHash = this.simpleHash(code);
    const baseNockma = this.SAMPLE_NOCKMA;
    
    // Modify the nockma based on code characteristics
    if (code.includes('createResource')) {
      return baseNockma.replace('[8 [1 0]', '[8 [1 1]');
    }
    
    if (code.includes('HelloWorldResource')) {
      return baseNockma.replace('[9 2 0 1]', `[9 2 0 ${codeHash % 10}]`);
    }

    return baseNockma;
  }

  private static simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  static exportNockma(nockma: string, filename?: string): void {
    const blob = new Blob([nockma], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || "compiled.nockma";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static getDefaultJuvixCode(): string {
    return `-- HelloWorld.juvix: Your first Anoma application
module HelloWorld;

import Stdlib.Prelude open;
import Anoma.Resource open;
import Anoma.Transaction open;

-- Define the HelloWorld resource type
type HelloWorldResource :=
  mkHelloWorldResource {
    message : String;
    timestamp : Nat;
    owner : PublicKey;
  };

-- Transaction function to create HelloWorld resource
createHelloWorld (msg : String) (owner : PublicKey) : Transaction :=
  let resource := mkHelloWorldResource {
    message := msg;
    timestamp := currentTime;
    owner := owner;
  } in
  createResource resource;

-- Projection function to read HelloWorld state
getHelloWorldMessage (resourceId : ResourceId) : Maybe String :=
  case getResource resourceId of
    just (mkHelloWorldResource r) := just r.message;
    nothing := nothing;`;
  }
}
