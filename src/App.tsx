import { useEffect, useState } from 'react';
import { Play, Square } from 'lucide-react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { EditorTabs } from '@/components/Editor/EditorTabs';
import { CodeEditor } from '@/components/Editor/CodeEditor';
import { LanguageSelector } from '@/components/Editor/LanguageSelector';
import { OutputPanel } from '@/components/Output/OutputPanel';
import { AIChat } from '@/components/AIAssistant/AIChat';
import { useFileManager } from '@/hooks/useFileManager';
import { useCodeExecution } from '@/hooks/useCodeExecution';

function App() {
  const { files, activeFileId, updateFile } = useFileManager();
  const { executeCode, isRunning } = useCodeExecution();
  const [editorValue, setEditorValue] = useState('');

  const activeFile = files.find(f => f.id === activeFileId);

  useEffect(() => {
    if (activeFile) {
      setEditorValue(activeFile.content);
    }
  }, [activeFile]);

  const handleEditorChange = (value: string) => {
    setEditorValue(value);
    if (activeFileId) {
      updateFile(activeFileId, value);
    }
  };

  const handleRunCode = async () => {
    if (!activeFile) {
      alert('Please select a file to run');
      return;
    }

    if (activeFile.language === 'html' || activeFile.language === 'css') {
      alert('HTML and CSS files cannot be executed directly. Try running JavaScript or Python files instead.');
      return;
    }

    await executeCode(editorValue, activeFile.language);
  };

  const handleStopExecution = () => {
    // In a real implementation, you'd add logic to stop execution
    console.log('Stop execution requested');
  };

  return (
    <MainLayout>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Editor Container */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Editor Tabs */}
          <EditorTabs />

          {/* Main Editor Area */}
          <div className="flex-1 flex overflow-hidden">
            {activeFile ? (
              <>
                {/* Code Editor */}
                <div className="flex-1 flex flex-col">
                  <CodeEditor
                    value={editorValue}
                    onChange={handleEditorChange}
                    language={activeFile.language}
                    height="100%"
                  />
                  <LanguageSelector />
                </div>

                {/* Run Controls Sidebar */}
                <div className="w-16 border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4 flex flex-col items-center space-y-4">
                  <button
                    onClick={isRunning ? handleStopExecution : handleRunCode}
                    disabled={!activeFile || (!editorValue.trim() && !isRunning)}
                    className={`p-3 rounded-lg transition-all transform hover:scale-105 ${
                      isRunning
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none'
                    }`}
                    title={isRunning ? 'Stop execution' : 'Run code (Ctrl+Enter)'}
                  >
                    {isRunning ? <Square size={20} /> : <Play size={20} />}
                  </button>

                  <div className="flex-1" />

                  {/* Keyboard shortcut hint */}
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    <div>Ctrl+</div>
                    <div>Enter</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <Play size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No file selected</h3>
                  <p className="text-sm mb-4">Create or open a file to start coding</p>
                  <div className="space-y-2 text-xs text-gray-400">
                    <p>• Click "File" to create a new file</p>
                    <p>• Use the file explorer to navigate</p>
                    <p>• Press Ctrl+Enter to run your code</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Output Panel */}
        <OutputPanel />
      </div>

      {/* AI Assistant */}
      <AIChat />
    </MainLayout>
  );
}

export default App;