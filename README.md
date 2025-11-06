# CodeFlow - Free Browser IDE

A modern, browser-based coding platform that allows users to write, edit, and run code instantly without installation. Featuring a professional code editor, multi-language support, and AI assistance.

## Features

### ✨ Core Functionality
- **Professional Code Editor**: Monaco Editor (VS Code's editor engine) with syntax highlighting
- **Multi-Language Support**: JavaScript, Python, HTML, and CSS
- **Instant Code Execution**: Run JavaScript and Python directly in your browser
- **File Management**: Create, edit, delete, and organize multiple files
- **Dark/Light Theme**: Seamless theme switching with system preference detection
- **AI Assistant**: Get help with code explanation, debugging, and improvements

### 🛠️ Technical Features
- **No Installation Required**: Runs entirely in your browser
- **Local Storage**: Your code is saved automatically in your browser
- **Responsive Design**: Works on desktop and mobile devices
- **Keyboard Shortcuts**: Ctrl+S to save, Ctrl+Enter to run code
- **Error Handling**: Clear error messages and debugging assistance

## Quick Start

1. Open the web application in your browser
2. Click "File" in the sidebar to create your first file
3. Write your code in the editor
4. Press Ctrl+Enter or click the Run button to execute
5. View output in the console panel below

## Supported Languages

- **JavaScript**: Native browser execution with console output
- **Python**: Powered by Pyodide (WebAssembly Python runtime)
- **HTML**: For web development (view-only)
- **CSS**: For styling (view-only)

## AI Assistant

Click the AI Assistant button in the bottom-right corner to:
- Get code explanations
- Debug errors
- Receive improvement suggestions
- Ask general coding questions

## Development

### Tech Stack
- **Frontend**: React 18 + TypeScript
- **Editor**: Monaco Editor
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Build Tool**: Vite
- **Python Runtime**: Pyodide

### Getting Started
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Privacy & Security

- **No Server Required**: All code execution happens locally in your browser
- **No Data Collection**: Your code never leaves your device
- **Safe Execution**: Code runs in isolated sandboxes
- **Local Storage Only**: Files are stored only in your browser

## Future Enhancements

- [ ] Additional language support (TypeScript, Rust, Go)
- [ ] Real-time collaboration
- [ ] Project sharing and export
- [ ] Advanced AI features with real API integration
- [ ] Code templates and examples
- [ ] Git integration

## Contributing

This is an open-source project. Contributions are welcome!

## License

MIT License - see LICENSE file for details
