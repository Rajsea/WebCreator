import { ExecutionResult } from '@/types/Execution';

declare global {
  interface Window {
    loadPyodide: any;
    pyodide: any;
  }
}

class PythonExecutor {
  private pyodide: any = null;
  private isLoaded = false;
  private isLoading = false;

  async initialize(): Promise<void> {
    if (this.isLoaded || this.isLoading) return;

    this.isLoading = true;

    try {
      // Load Pyodide from CDN
      const script = await this.loadScript('https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js');

      this.pyodide = await window.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/"
      });

      // Load common packages
      await this.pyodide.loadPackage(['numpy', 'pandas', 'matplotlib']);

      this.isLoaded = true;
    } catch (error) {
      console.error('Failed to load Pyodide:', error);
      throw new Error('Python runtime is not available. Please check your internet connection.');
    } finally {
      this.isLoading = false;
    }
  }

  async execute(code: string, timeout: number = 5000): Promise<ExecutionResult> {
    const startTime = performance.now();

    try {
      if (!this.isLoaded) {
        await this.initialize();
      }

      // Set up stdout capture
      this.pyodide.runPython(`
import sys
from io import StringIO
import contextlib

# Create a string buffer to capture output
sys.stdout = StringIO()
sys.stderr = StringIO()
      `);

      // Execute with timeout
      const executionPromise = this.pyodide.runPythonAsync(code);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Execution timeout')), timeout);
      });

      await Promise.race([executionPromise, timeoutPromise]);

      // Get captured output
      const stdout = this.pyodide.runPython('sys.stdout.getvalue()');
      const stderr = this.pyodide.runPython('sys.stderr.getvalue()');

      const output = stdout + (stderr ? `\nERROR: ${stderr}` : '');
      const executionTime = performance.now() - startTime;

      return {
        output,
        executionTime
      };

    } catch (error) {
      const executionTime = performance.now() - startTime;
      return {
        output: '',
        error: error instanceof Error ? error.message : 'Python execution error',
        executionTime
      };
    }
  }

  private async loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if script is already loaded
      if (window.loadPyodide) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = true;

      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));

      document.head.appendChild(script);
    });
  }

  // Check if Python is available
  isPythonAvailable(): boolean {
    return this.isLoaded || window.loadPyodide !== undefined;
  }

  // Get installed packages
  getInstalledPackages(): string[] {
    if (!this.isLoaded) return [];

    try {
      const packages = this.pyodide.runPython(`
import pkg_resources
[pkg.key for pkg in pkg_resources.working_set]
      `);
      return packages.toJs ? packages.toJs() : packages;
    } catch {
      return ['numpy', 'pandas', 'matplotlib']; // Default packages
    }
  }

  // Reset Python environment
  resetEnvironment(): void {
    if (this.isLoaded && this.pyodide) {
      this.pyodide.runPython(`
import sys
import importlib
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
      `);
    }
  }
}

export const pythonExecutor = new PythonExecutor();