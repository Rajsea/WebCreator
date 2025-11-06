import { Code2 } from 'lucide-react';
import { useFileManager } from '@/hooks/useFileManager';

const languages = [
  { value: 'javascript', label: 'JavaScript', extension: 'js' },
  { value: 'python', label: 'Python', extension: 'py' },
  { value: 'html', label: 'HTML', extension: 'html' },
  { value: 'css', label: 'CSS', extension: 'css' }
];

export const LanguageSelector = () => {
  const { files, activeFileId, updateFile } = useFileManager();
  const activeFile = files.find(f => f.id === activeFileId);

  const handleLanguageChange = (newLanguage: string) => {
    if (!activeFile) return;

    // Update file extension based on language
    const language = languages.find(l => l.value === newLanguage);
    if (language) {
      const baseName = activeFile.name.replace(/\.[^/.]+$/, '');
      const newName = `${baseName}.${language.extension}`;

      // In a real implementation, you'd update the file name and language
      // For now, we'll just update the content to indicate the change
      const newContent = `// Language changed to ${language.label}\n${activeFile.content}`;
      updateFile(activeFile.id, newContent);
    }
  };

  if (!activeFile) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
        <Code2 size={16} />
        <span>No file selected</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 px-3 py-2 border-t border-gray-200 dark:border-gray-700">
      <Code2 size={16} className="text-gray-500" />
      <select
        value={activeFile.language}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="flex-1 text-sm bg-transparent border-none text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-0"
      >
        {languages.map((language) => (
          <option key={language.value} value={language.value}>
            {language.label}
          </option>
        ))}
      </select>
    </div>
  );
};