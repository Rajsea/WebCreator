import { X } from 'lucide-react';
import { useFileManager } from '@/hooks/useFileManager';

export const EditorTabs = () => {
  const { openFiles, activeFileId, closeFile, setActiveFile } = useFileManager();

  if (openFiles.length === 0) {
    return (
      <div className="h-10 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center px-4">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          No open files
        </span>
      </div>
    );
  }

  return (
    <div className="h-10 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center overflow-x-auto">
      {openFiles.map((openFile) => (
        <div
          key={openFile.file.id}
          className={`group flex items-center space-x-2 px-3 py-1.5 border-r border-gray-200 dark:border-gray-700 cursor-pointer transition-colors ${
            activeFileId === openFile.file.id
              ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-t-2 border-t-blue-500'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
          }`}
          onClick={() => setActiveFile(openFile.file.id)}
        >
          <span className="text-sm font-medium truncate max-w-32">
            {openFile.file.name}
          </span>
          {openFile.isUnsaved && (
            <span className="text-blue-500 text-sm">●</span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeFile(openFile.file.id);
            }}
            className={`opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-all ${
              activeFileId === openFile.file.id ? 'opacity-100' : ''
            }`}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};