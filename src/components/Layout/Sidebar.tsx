import { useState } from 'react';
import { FilePlus, FolderPlus, Search } from 'lucide-react';
import { FileTree } from '@/components/FileExplorer/FileTree';
import { useFileManager } from '@/hooks/useFileManager';

export const Sidebar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { createFile, createFolder } = useFileManager();

  const handleCreateFile = async () => {
    const name = prompt('Enter file name:');
    if (name) {
      const language = name.endsWith('.py') ? 'python' :
                     name.endsWith('.js') ? 'javascript' :
                     name.endsWith('.html') ? 'html' :
                     name.endsWith('.css') ? 'css' : 'javascript';
      await createFile(name, language);
    }
  };

  const handleCreateFolder = async () => {
    const name = prompt('Enter folder name:');
    if (name) {
      await createFolder(name);
    }
  };

  return (
    <div className="w-64 h-full border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative mb-3">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleCreateFile}
            className="flex-1 flex items-center justify-center space-x-1 px-2 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
          >
            <FilePlus size={14} />
            <span>File</span>
          </button>

          <button
            onClick={handleCreateFolder}
            className="flex-1 flex items-center justify-center space-x-1 px-2 py-1.5 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors"
          >
            <FolderPlus size={14} />
            <span>Folder</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <FileTree searchQuery={searchQuery} />
      </div>
    </div>
  );
};