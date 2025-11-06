import { useState } from 'react';
import { Terminal, Trash2, Maximize2, Minimize2, Clock } from 'lucide-react';
import { useCodeExecution } from '@/hooks/useCodeExecution';

export const OutputPanel = () => {
  const { result, error, isRunning, clearOutput } = useCodeExecution();
  const [isMaximized, setIsMaximized] = useState(false);

  const hasContent = result || error;

  if (!hasContent && !isRunning) {
    return (
      <div className="h-48 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <Terminal size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">Run your code to see output here</p>
          <p className="text-xs mt-1">Press Ctrl+Enter or click Run</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isMaximized ? 'h-full' : 'h-48'} border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex flex-col`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center space-x-2">
          <Terminal size={16} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Console Output
          </span>
          {isRunning && (
            <div className="flex items-center space-x-1">
              <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-500"></div>
              <span className="text-xs text-blue-600 dark:text-blue-400">Running...</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {result && (
            <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
              <Clock size={12} />
              <span>{result.executionTime.toFixed(2)}ms</span>
            </div>
          )}

          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            title={isMaximized ? 'Minimize' : 'Maximize'}
          >
            {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>

          <button
            onClick={clearOutput}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            title="Clear output"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 font-mono text-sm">
        {error && (
          <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <div className="text-red-700 dark:text-red-400 font-medium mb-1">Error:</div>
            <div className="text-red-600 dark:text-red-300 whitespace-pre-wrap">{error}</div>
          </div>
        )}

        {result && result.output && (
          <div className="space-y-2">
            <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {result.output.split('\n').map((line, index) => (
                <div key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800 px-2 py-0.5 rounded">
                  {line || <span className="text-gray-400">&nbsp;</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {isRunning && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <div className="animate-spin rounded-full h-6 w-6 border-b border-blue-500 mx-auto mb-2"></div>
            <p>Executing code...</p>
          </div>
        )}
      </div>
    </div>
  );
};