import { File, Folder } from '@/types/File';

class FileService {
  private dbName = 'webcreator-files';
  private storeName = 'files';
  private version = 1;

  async initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('name', 'name', { unique: false });
          store.createIndex('language', 'language', { unique: false });
          store.createIndex('createdAt', 'createdAt', { unique: false });
        }
      };
    });
  }

  async createFile(
    name: string,
    language: 'javascript' | 'python' | 'html' | 'css',
    folderId?: string
  ): Promise<File> {
    const file: File = {
      id: this.generateId(),
      name,
      content: this.getDefaultContent(language),
      language,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.add(file);

      request.onsuccess = () => resolve(file);
      request.onerror = () => reject(request.error);
    });
  }

  async createFolder(name: string, parentFolderId?: string): Promise<Folder> {
    const folder: Folder = {
      id: this.generateId(),
      name,
      files: [],
      folders: [],
      createdAt: new Date(),
    };

    // Store folders in localStorage for simplicity
    const folders = this.loadFoldersFromStorage();
    folders.push(folder);
    localStorage.setItem('webcreator-folders', JSON.stringify(folders));

    return folder;
  }

  async updateFile(id: string, content: string): Promise<void> {
    const db = await this.initDB();
    const file = await this.getFile(id);

    if (!file) throw new Error('File not found');

    const updatedFile = { ...file, content, updatedAt: new Date() };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(updatedFile);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getFile(id: string): Promise<File | null> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async loadFiles(): Promise<File[]> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  loadFolders(): Folder[] {
    return this.loadFoldersFromStorage();
  }

  async loadRootFolder(): Promise<Folder> {
    const files = await this.loadFiles();
    const folders = this.loadFolders();

    return {
      id: 'root',
      name: 'Root',
      files,
      folders,
      createdAt: new Date(),
    };
  }

  async deleteFile(id: string): Promise<void> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteFolder(id: string): Promise<void> {
    const folders = this.loadFoldersFromStorage();
    const filteredFolders = folders.filter(f => f.id !== id);
    localStorage.setItem('webcreator-folders', JSON.stringify(filteredFolders));
  }

  async renameFile(id: string, newName: string): Promise<void> {
    const file = await this.getFile(id);
    if (!file) throw new Error('File not found');

    const updatedFile = { ...file, name: newName, updatedAt: new Date() };
    const db = await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(updatedFile);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async renameFolder(id: string, newName: string): Promise<void> {
    const folders = this.loadFoldersFromStorage();
    const updatedFolders = folders.map(folder =>
      folder.id === id ? { ...folder, name: newName } : folder
    );
    localStorage.setItem('webcreator-folders', JSON.stringify(updatedFolders));
  }

  async exportProject(files: File[]): Promise<void> {
    const zip = await this.createZip(files);
    const url = URL.createObjectURL(zip);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async importProject(files: File[]): Promise<void> {
    const db = await this.initDB();

    for (const file of files) {
      file.id = this.generateId();
      file.createdAt = new Date();
      file.updatedAt = new Date();

      await new Promise<void>((resolve, reject) => {
        const transaction = db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.add(file);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
  }

  async updateFoldersWithNewFile(file: File, folders: Folder[]): Promise<Folder[]> {
    // Simple implementation - in a real app, you'd update folder structure
    return folders;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private getDefaultContent(language: string): string {
    switch (language) {
      case 'javascript':
        return '// JavaScript code\nconsole.log("Hello, World!");';
      case 'python':
        return '# Python code\nprint("Hello, World!")';
      case 'html':
        return '<!DOCTYPE html>\n<html>\n<head>\n  <title>My Page</title>\n</head>\n<body>\n  <h1>Hello, World!</h1>\n</body>\n</html>';
      case 'css':
        return '/* CSS styles */\nbody {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 20px;\n}';
      default:
        return '';
    }
  }

  private loadFoldersFromStorage(): Folder[] {
    const stored = localStorage.getItem('webcreator-folders');
    return stored ? JSON.parse(stored) : [];
  }

  private async createZip(files: File[]): Promise<Blob> {
    // Simple zip implementation - in production, use a proper zip library
    const content = files.map(file =>
      `=== ${file.name} (${file.language}) ===\n${file.content}\n\n`
    ).join('');

    return new Blob([content], { type: 'text/plain' });
  }
}

export const fileService = new FileService();