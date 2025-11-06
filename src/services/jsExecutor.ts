import { ExecutionResult } from '@/types/Execution';

class JavaScriptExecutor {
  private output: string = '';

  async execute(code: string, timeout: number = 5000): Promise<ExecutionResult> {
    const startTime = performance.now();
    this.output = '';

    try {
      // Create safe execution context with custom console
      const customConsole = {
        log: (...args: any[]) => {
          this.output += args.map(arg =>
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ') + '\n';
        },
        error: (...args: any[]) => {
          this.output += 'ERROR: ' + args.map(arg =>
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ') + '\n';
        },
        warn: (...args: any[]) => {
          this.output += 'WARNING: ' + args.map(arg =>
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ') + '\n';
        },
        info: (...args: any[]) => {
          this.output += 'INFO: ' + args.map(arg =>
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ') + '\n';
        }
      };

      // Create async function to handle await/async code
      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
      const wrappedCode = `
        try {
          ${this.wrapInAsyncFunction(code)}
        } catch (error) {
          console.error(error.message);
        }
      `;

      // Execute with timeout
      const executionPromise = new AsyncFunction('console', wrappedCode);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Execution timeout')), timeout);
      });

      await Promise.race([executionPromise(customConsole), timeoutPromise]);

      const executionTime = performance.now() - startTime;
      return {
        output: this.output,
        executionTime
      };

    } catch (error) {
      const executionTime = performance.now() - startTime;
      return {
        output: this.output,
        error: error instanceof Error ? error.message : 'Unknown execution error',
        executionTime
      };
    }
  }

  private wrapInAsyncFunction(code: string): string {
    // Check if code already has top-level await or is a function declaration
    if (code.includes('await ') && !code.includes('async')) {
      return `(async () => {\n${code}\n})()`;
    }
    return code;
  }

  // Safety checks
  private validateCode(code: string): boolean {
    const dangerousPatterns = [
      /import\s+.*\s+from/,
      /require\s*\(/,
      /fetch\s*\(/,
      /XMLHttpRequest/,
      /window\./,
      /document\./,
      /localStorage/,
      /sessionStorage/,
      /indexedDB/,
      /navigator\./,
      /location\./,
      /history\./,
      /eval\s*\(/,
      /Function\s*\(/,
      /setTimeout\s*\(/,
      /setInterval\s*\(/,
    ];

    return !dangerousPatterns.some(pattern => pattern.test(code));
  }
}

export const jsExecutor = new JavaScriptExecutor();