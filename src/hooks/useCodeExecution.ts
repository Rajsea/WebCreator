import { create } from 'zustand';
import { ExecutionResult, ExecutionState } from '@/types/Execution';
import { jsExecutor } from '@/services/jsExecutor';
import { pythonExecutor } from '@/services/pythonExecutor';

interface CodeExecutionState extends ExecutionState {
  executeCode: (code: string, language: 'javascript' | 'python') => Promise<void>;
  clearOutput: () => void;
  setRunning: (isRunning: boolean) => void;
}

export const useCodeExecution = create<CodeExecutionState>((set, get) => ({
  isRunning: false,
  result: null,
  error: null,

  executeCode: async (code: string, language: 'javascript' | 'python') => {
    if (!code.trim()) {
      set({ error: 'Please enter some code to execute' });
      return;
    }

    set({ isRunning: true, error: null, result: null });

    try {
      let executionResult: ExecutionResult;

      if (language === 'javascript') {
        executionResult = await jsExecutor.execute(code, 5000);
      } else if (language === 'python') {
        executionResult = await pythonExecutor.execute(code, 10000);
      } else {
        throw new Error(`Unsupported language: ${language}`);
      }

      set({ result: executionResult, error: executionResult.error || null });

    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Execution failed',
        result: null
      });
    } finally {
      set({ isRunning: false });
    }
  },

  clearOutput: () => {
    set({ result: null, error: null });
  },

  setRunning: (isRunning: boolean) => {
    set({ isRunning });
  }
}));