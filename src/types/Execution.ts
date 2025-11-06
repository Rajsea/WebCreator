export interface ExecutionResult {
  output: string;
  error?: string;
  executionTime: number;
}

export interface ExecutionState {
  isRunning: boolean;
  result: ExecutionResult | null;
  error: string | null;
}

export interface ExecutionConfig {
  timeout: number;
  maxOutputSize: number;
}