export interface File {
  id: string;
  name: string;
  content: string;
  language: 'javascript' | 'python' | 'html' | 'css';
  createdAt: Date;
  updatedAt: Date;
}

export interface Folder {
  id: string;
  name: string;
  files: File[];
  folders: Folder[];
  createdAt: Date;
}

export interface OpenFile {
  file: File;
  isUnsaved: boolean;
}

export interface FileTreeItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  language?: 'javascript' | 'python' | 'html' | 'css';
  children?: FileTreeItem[];
  parent?: string;
}