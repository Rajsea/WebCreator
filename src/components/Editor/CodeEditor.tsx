import { useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useTheme } from '@/hooks/useTheme';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: 'javascript' | 'python' | 'html' | 'css';
  readOnly?: boolean;
  height?: string;
}

export const CodeEditor = ({
  value,
  onChange,
  language,
  readOnly = false,
  height = '100%'
}: CodeEditorProps) => {
  const editorRef = useRef<any>(null);
  const { isDark } = useTheme();

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    // Configure editor options
    editor.updateOptions({
      fontSize: 14,
      lineNumbers: 'on',
      minimap: { enabled: false },
      wordWrap: 'on',
      tabSize: 2,
      insertSpaces: true,
      automaticLayout: true,
      scrollBeyondLastLine: false,
      renderWhitespace: 'selection',
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        indentation: true
      }
    });

    // Add keyboard shortcuts
    editor.addAction({
      id: 'save',
      label: 'Save',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
      run: () => {
        // Save logic will be handled by parent component
        console.log('Save shortcut triggered');
      }
    });

    editor.addAction({
      id: 'run',
      label: 'Run Code',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
      run: () => {
        // Run logic will be handled by parent component
        console.log('Run shortcut triggered');
      }
    });
  };

  const handleEditorChange = (value: string | undefined) => {
    onChange(value || '');
  };

  return (
    <Editor
      height={height}
      language={language}
      value={value}
      theme={isDark ? 'vs-dark' : 'vs-light'}
      onChange={handleEditorChange}
      onMount={handleEditorDidMount}
      options={{
        readOnly,
        selectOnLineNumbers: true,
        smoothScrolling: true,
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on'
      }}
      loading={
        <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-800">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Loading editor...</p>
          </div>
        </div>
      }
    />
  );
};