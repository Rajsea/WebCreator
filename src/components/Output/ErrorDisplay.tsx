import { AlertCircle, Copy } from 'lucide-react';

interface ErrorDisplayProps {
  error: string;
  onJumpToLine?: (lineNumber: number) => void;
}

export const ErrorDisplay = ({ error, onJumpToLine }: ErrorDisplayProps) => {
  const parseErrorWithLineNumbers = (error: string) => {
    // Common error patterns with line numbers
    const patterns = [
      /at line (\d+)/i,
      /:(\d+):\d+/,
      /line (\d+)/i,
      /(\d+):(\d+):/,
      /Error at line (\d+)/i
    ];

    for (const pattern of patterns) {
      const match = error.match(pattern);
      if (match) {
        const lineNumber = parseInt(match[1], 10);
        return { lineNumber, error };
      }
    }

    return { lineNumber: null, error };
  };

  const { lineNumber } = parseErrorWithLineNumbers(error);

  const handleCopyError = async () => {
    try {
      await navigator.clipboard.writeText(error);
      // You could show a toast notification here
    } catch (err) {
      console.error('Failed to copy error:', err);
    }
  };

  const handleJumpToLine = () => {
    if (lineNumber && onJumpToLine) {
      onJumpToLine(lineNumber);
    }
  };

  return (
    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          <AlertCircle size={20} className="text-red-500" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
              {lineNumber ? `Error at line ${lineNumber}` : 'Execution Error'}
            </h3>

            <div className="flex items-center space-x-2">
              {lineNumber && onJumpToLine && (
                <button
                  onClick={handleJumpToLine}
                  className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded transition-colors"
                >
                  Jump to Line
                </button>
              )}

              <button
                onClick={handleCopyError}
                className="p-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                title="Copy error message"
              >
                <Copy size={14} />
              </button>
            </div>
          </div>

          <div className="text-sm text-red-700 dark:text-red-300">
            <div className="font-mono bg-red-100 dark:bg-red-900/30 p-3 rounded overflow-x-auto">
              <pre className="whitespace-pre-wrap break-words">{error}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};