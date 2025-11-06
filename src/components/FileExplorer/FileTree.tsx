import React, { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from 'lucide-react';
import { useFileManager } from '@/hooks/useFileManager';

interface FileTreeProps {
  searchQuery?: string;
}

interface FileTreeItemProps {
  item: any;
  level: number;
  searchQuery?: string;
}

const getFileIcon = (language: string) => {
  switch (language) {
    case 'javascript':
      return <File size={16} className="text-yellow-500" />;
    case 'python':
      return <File size={16} className="text-blue-500" />;
    case 'html':
      return <File size={16} className="text-orange-500" />;
    case 'css':
      return <File size={16} className="text-purple-500" />;
    default:
      return <File size={16} className="text-gray-500" />;
  }
};

const FileTreeItem = ({ item, level, searchQuery }: FileTreeItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { openFile, deleteFile, selectedFileId, setActiveFile } = useFileManager();

  const handleClick = () => {
    if (item.type === 'file') {
      openFile(item);
      setActiveFile(item.id);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (item.type === 'file') {
      const action = confirm(`Delete "${item.name}"?`);
      if (action) {
        deleteFile(item.id);
      }
    }
  };

  const paddingLeft = `${level * 16}px`;

  return (
    <div>
      <div
        className={`flex items-center space-x-1 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer group ${
          selectedFileId === item.id ? 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500' : ''
        }`}
        style={{ paddingLeft }}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      >
        {item.type === 'folder' ? (
          <>
            {isExpanded ? (
              <ChevronDown size={14} className="text-gray-500" />
            ) : (
              <ChevronRight size={14} className="text-gray-500" />
            )}
            {isExpanded ? (
              <FolderOpen size={16} className="text-yellow-600" />
            ) : (
              <Folder size={16} className="text-yellow-600" />
            )}
          </>
        ) : (
          <>
            <div className="w-4" />
            {getFileIcon(item.language)}
          </>
        )}

        <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
          {item.name}
        </span>
      </div>

      {item.type === 'folder' && isExpanded && item.children && (
        <div>
          {item.children.map((child: any) => (
            <FileTreeItem
              key={child.id}
              item={child}
              level={level + 1}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const FileTree = ({ searchQuery = '' }: FileTreeProps) => {
  const { files, folders, loadProject } = useFileManager();
  const [isLoaded, setIsLoaded] = useState(false);

  React.useEffect(() => {
    if (!isLoaded) {
      loadProject();
      setIsLoaded(true);
    }
  }, [isLoaded, loadProject]);

  // Convert files and folders to tree structure
  const treeItems = [
    ...folders.map(folder => ({
      ...folder,
      type: 'folder' as const,
      children: [] // In a real app, you'd build the full tree structure
    })),
    ...files.map(file => ({
      ...file,
      type: 'file' as const
    }))
  ];

  const filteredItems = treeItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-2">
      {filteredItems.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <File size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">No files yet</p>
          <p className="text-xs mt-1">Create your first file to get started</p>
        </div>
      ) : (
        filteredItems.map((item) => (
          <FileTreeItem
            key={item.id}
            item={item}
            level={0}
            searchQuery={searchQuery}
          />
        ))
      )}
    </div>
  );
};