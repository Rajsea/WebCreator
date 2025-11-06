import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AIMessage } from '@/types/AI';

interface AIAssistantState {
  messages: AIMessage[];
  isProcessing: boolean;
  isOpen: boolean;
  apiKey: string | null;

  // Actions
  sendMessage: (message: string) => Promise<void>;
  clearMessages: () => void;
  setIsOpen: (open: boolean) => void;
  setApiKey: (key: string) => void;
}

const generateMockAIResponse = (userMessage: string): string => {
  // Simple mock responses for demo purposes
  const responses = [
    "That's a great question! Let me help you understand this code better.",
    "I can see what you're trying to accomplish. Here's a suggestion...",
    "This code looks good! Here are a few improvements you could make:",
    "I found a potential issue in your code. Let me explain how to fix it:",
    "Great work! Here's an explanation of what this code does:"
  ];

  // Simple context-based responses
  if (userMessage.toLowerCase().includes('error') || userMessage.toLowerCase().includes('debug')) {
    return "I can help you debug this! The most common issues are syntax errors, undefined variables, or logic errors. Could you share the specific error message you're seeing?";
  }

  if (userMessage.toLowerCase().includes('explain')) {
    return "I'd be happy to explain this code! It appears to be implementing a standard pattern. The code is well-structured and follows good practices.";
  }

  if (userMessage.toLowerCase().includes('improve')) {
    return "Here are some suggestions to improve this code:\n1. Add more descriptive variable names\n2. Include error handling\n3. Add comments to explain complex logic\n4. Consider performance optimizations";
  }

  return responses[Math.floor(Math.random() * responses.length)];
};

export const useAIAssistant = create<AIAssistantState>()(
  persist(
    (set, get) => ({
      messages: [],
      isProcessing: false,
      isOpen: false,
      apiKey: null,

      sendMessage: async (message: string) => {
        set({ isProcessing: true });

        // Add user message
        const userMessage: AIMessage = {
          id: Date.now().toString(),
          type: 'user',
          content: message,
          timestamp: new Date()
        };

        set(state => ({
          messages: [...state.messages, userMessage]
        }));

        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

          // Generate mock response
          const aiResponse = generateMockAIResponse(message);

          const assistantMessage: AIMessage = {
            id: (Date.now() + 1).toString(),
            type: 'assistant',
            content: aiResponse,
            timestamp: new Date()
          };

          set(state => ({
            messages: [...state.messages, assistantMessage]
          }));

        } catch (error) {
          const errorMessage: AIMessage = {
            id: (Date.now() + 1).toString(),
            type: 'assistant',
            content: 'Sorry, I encountered an error while processing your request. Please try again.',
            timestamp: new Date()
          };

          set(state => ({
            messages: [...state.messages, errorMessage]
          }));
        } finally {
          set({ isProcessing: false });
        }
      },

      clearMessages: () => {
        set({ messages: [] });
      },

      setIsOpen: (open: boolean) => {
        set({ isOpen: open });
      },

      setApiKey: (key: string) => {
        set({ apiKey: key });
      }
    }),
    {
      name: 'ai-assistant-storage',
      partialize: (state) => ({
        apiKey: state.apiKey,
        messages: state.messages.slice(-10) // Keep only last 10 messages
      })
    }
  )
);