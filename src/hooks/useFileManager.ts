import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { File, Folder, OpenFile, FileTreeItem } from '@/types/File';
import { fileService } from '@/services/fileService';

interface FileManagerState {
  files: File[];
  folders: Folder[];
  openFiles: OpenFile[];
  activeFileId: string | null;
  selectedFileId: string | null;
  rootFolder: Folder | null;

  // Actions
  createFile: (name: string, language: 'javascript' | 'python' | 'html' | 'css', folderId?: string) => Promise<File>;
  createFolder: (name: string, parentFolderId?: string) => Promise<Folder>;
  updateFile: (id: string, content: string) => Promise<void>;
  deleteFile: (id: string) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
  openFile: (file: File) => void;
  closeFile: (fileId: string) => void;
  setActiveFile: (fileId: string) => void;
  duplicateFile: (fileId: string) => Promise<File>;
  renameFile: (fileId: string, newName: string) => Promise<void>;
  renameFolder: (folderId: string, newName: string) => Promise<void>;
  loadProject: () => Promise<void>;
  exportProject: () => Promise<void>;
  importProject: (files: File[]) => Promise<void>;
}

export const useFileManager = create<FileManagerState>()(
  persist(
    (set, get) => ({
      files: [],
      folders: [],
      openFiles: [],
      activeFileId: null,
      selectedFileId: null,
      rootFolder: null,

      createFile: async (name: string, language: 'javascript' | 'python' | 'html' | 'css', folderId?: string) => {
        const file = await fileService.createFile(name, language, folderId);
        set(state => ({
          files: [...state.files, file],
          folders: await fileService.updateFoldersWithNewFile(file, state.folders)
        }));
        return file;
      },

      createFolder: async (name: string, parentFolderId?: string) => {
        const folder = await fileService.createFolder(name, parentFolderId);
        set(state => ({
          folders: [...state.folders, folder]
        }));
        return folder;
      },

      updateFile: async (id: string, content: string) => {
        await fileService.updateFile(id, content);
        set(state => ({
          files: state.files.map(file =>
            file.id === id
              ? { ...file, content, updatedAt: new Date() }
              : file
          ),
          openFiles: state.openFiles.map(openFile =>
            openFile.file.id === id
              ? { ...openFile, file: { ...openFile.file, content, updatedAt: new Date() }, isUnsaved: true }
              : openFile
          )
        }));
      },

      deleteFile: async (id: string) => {
        await fileService.deleteFile(id);
        set(state => {
          const openFiles = state.openFiles.filter(f => f.file.id !== id);
          const activeFileId = state.activeFileId === id
            ? (openFiles.length > 0 ? openFiles[openFiles.length - 1].file.id : null)
            : state.activeFileId;

          return {
            files: state.files.filter(file => file.id !== id),
            openFiles,
            activeFileId
          };
        });
      },

      deleteFolder: async (id: string) => {
        await fileService.deleteFolder(id);
        set(state => ({
          folders: state.folders.filter(folder => folder.id !== id)
        }));
      },

      openFile: (file: File) => {
        set(state => {
          const existingOpenFile = state.openFiles.find(f => f.file.id === file.id);
          if (existingOpenFile) {
            return { activeFileId: file.id };
          }

          const openFile: OpenFile = { file, isUnsaved: false };
          return {
            openFiles: [...state.openFiles, openFile],
            activeFileId: file.id
          };
        });
      },

      closeFile: (fileId: string) => {
        set(state => {
          const openFiles = state.openFiles.filter(f => f.file.id !== fileId);
          const activeFileId = state.activeFileId === fileId
            ? (openFiles.length > 0 ? openFiles[openFiles.length - 1].file.id : null)
            : state.activeFileId;

          return { openFiles, activeFileId };
        });
      },

      setActiveFile: (fileId: string) => {
        set({ activeFileId: fileId, selectedFileId: fileId });
      },

      duplicateFile: async (fileId: string) => {
        const originalFile = get().files.find(f => f.id === fileId);
        if (!originalFile) throw new Error('File not found');

        const newName = `${originalFile.name.replace(/\.[^/.]+$/, '')}_copy.${originalFile.language}`;
        const newFile = await fileService.createFile(
          newName,
          originalFile.language,
          originalFile.id
        );
        await fileService.updateFile(newFile.id, originalFile.content);

        set(state => ({
          files: [...state.files, { ...newFile, content: originalFile.content, updatedAt: new Date() }]
        }));

        return newFile;
      },

      renameFile: async (fileId: string, newName: string) => {
        await fileService.renameFile(fileId, newName);
        set(state => ({
          files: state.files.map(file =>
            file.id === fileId ? { ...file, name: newName, updatedAt: new Date() } : file
          ),
          openFiles: state.openFiles.map(openFile =>
            openFile.file.id === fileId
              ? { ...openFile, file: { ...openFile.file, name: newName, updatedAt: new Date() } }
              : openFile
          )
        }));
      },

      renameFolder: async (folderId: string, newName: string) => {
        await fileService.renameFolder(folderId, newName);
        set(state => ({
          folders: state.folders.map(folder =>
            folder.id === folderId ? { ...folder, name: newName } : folder
          )
        }));
      },

      loadProject: async () => {
        try {
          const files = await fileService.loadFiles();
          const folders = await fileService.loadFolders();
          const rootFolder = await fileService.loadRootFolder();
          set({ files, folders, rootFolder });
        } catch (error) {
          console.error('Failed to load project:', error);
        }
      },

      exportProject: async () => {
        await fileService.exportProject(get().files);
      },

      importProject: async (files: File[]) => {
        await fileService.importProject(files);
        set({ files });
      },
    }),
    {
      name: 'file-manager-storage',
      partialize: (state) => ({
        files: state.files,
        folders: state.folders,
        openFiles: state.openFiles.map(f => ({
          file: f.file,
          isUnsaved: false
        })),
        activeFileId: state.activeFileId
      })
    }
  )
);