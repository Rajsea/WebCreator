export interface AIRequest {
  code: string;
  prompt: string;
  language: string;
}

export interface AIResponse {
  suggestions: string[];
  explanation: string;
  fixedCode?: string;
}

export interface AIMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AIChat {
  messages: AIMessage[];
  isOpen: boolean;
}

export interface CodeSuggestion {
  text: string;
  position: {
    line: number;
    column: number;
  };
  type: 'completion' | 'refactor' | 'fix';
}