import * as React from "react";
import * as monaco from "monaco-editor";
import { juvixLanguageConfig, juvixTokensProvider, juvixLanguageConfiguration } from "./juvix-language";

// Configure Monaco environment for Replit without web workers
if (typeof window !== 'undefined') {
  (window as any).MonacoEnvironment = {
    getWorker: function (workerId: string, label: string) {
      return {
        postMessage: () => {},
        terminate: () => {},
        addEventListener: () => {},
        removeEventListener: () => {}
      };
    }
  };
}

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  theme?: string;
  height?: string;
  readOnly?: boolean;
}

export function MonacoEditor({
  value,
  onChange,
  language = "juvix",
  theme = "vs-dark",
  height = "100%",
  readOnly = false,
}: MonacoEditorProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const editorRef = React.useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  React.useEffect(() => {
    if (!containerRef.current) return;

    try {
      // Register Juvix language
      if (!monaco.languages.getLanguages().some(lang => lang.id === 'juvix')) {
        monaco.languages.register(juvixLanguageConfig);
        monaco.languages.setMonarchTokensProvider('juvix', juvixTokensProvider as any);
        monaco.languages.setLanguageConfiguration('juvix', juvixLanguageConfiguration as any);
      }

      // Create editor
      const editor = monaco.editor.create(containerRef.current, {
      value,
      language,
      theme,
      readOnly,
      automaticLayout: true,
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      fontSize: 14,
      fontFamily: "'Fira Code', 'Consolas', monospace",
      fontLigatures: true,
      wordWrap: "on",
      lineNumbers: "on",
      renderLineHighlight: "line",
      selectOnLineNumbers: true,
      roundedSelection: false,
      cursorStyle: "line",
      cursorBlinking: "blink",
      folding: true,
      showFoldingControls: "always",
      foldingStrategy: "indentation",
    });

    editorRef.current = editor;

    // Handle content changes
    const disposable = editor.onDidChangeModelContent(() => {
      const newValue = editor.getValue();
      onChange(newValue);
    });

      return () => {
        disposable.dispose();
        editor.dispose();
      };
    } catch (error) {
      console.error('Monaco Editor initialization failed:', error);
    }
  }, []);

  React.useEffect(() => {
    try {
      if (editorRef.current && editorRef.current.getValue() !== value) {
        editorRef.current.setValue(value);
      }
    } catch (error) {
      console.error('Failed to update editor value:', error);
    }
  }, [value]);

  React.useEffect(() => {
    try {
      if (editorRef.current) {
        const currentTheme = theme === "light" ? "vs" : "vs-dark";
        monaco.editor.setTheme(currentTheme);
      }
    } catch (error) {
      console.error('Failed to update editor theme:', error);
    }
  }, [theme]);

  return (
    <div
      ref={containerRef}
      className="monaco-container"
      style={{ height }}
    />
  );
}
