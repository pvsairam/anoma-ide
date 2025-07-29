import * as React from "react";

interface SimpleEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  theme?: "light" | "dark";
  readOnly?: boolean;
  height?: string | number;
}

export function SimpleEditor({
  value,
  onChange,
  language = "text",
  theme = "light",
  readOnly = false,
  height = "400px",
}: SimpleEditorProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Add basic IDE-like features
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);
      
      // Set cursor position after the inserted tab
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  const getLineNumbers = () => {
    const lines = value.split('\n');
    return lines.map((_, index) => index + 1).join('\n');
  };

  return (
    <div 
      className={`relative border rounded-lg overflow-hidden ${
        theme === 'dark' 
          ? 'bg-gray-900 border-gray-700' 
          : 'bg-white border-gray-300'
      }`}
      style={{ height }}
    >
      <div className="flex h-full">
        {/* Line numbers */}
        <div 
          className={`flex-shrink-0 px-2 py-2 text-right text-sm font-mono select-none ${
            theme === 'dark' 
              ? 'bg-gray-800 text-gray-400 border-gray-700' 
              : 'bg-gray-50 text-gray-500 border-gray-200'
          } border-r`}
          style={{ minWidth: '3rem' }}
        >
          <pre className="whitespace-pre-wrap">{getLineNumbers()}</pre>
        </div>
        
        {/* Editor */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          readOnly={readOnly}
          className={`flex-1 p-2 font-mono text-sm resize-none outline-none ${
            theme === 'dark'
              ? 'bg-gray-900 text-gray-100 placeholder-gray-400'
              : 'bg-white text-gray-900 placeholder-gray-500'
          }`}
          style={{
            lineHeight: '1.5',
            tabSize: 2,
          }}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          placeholder={language === 'juvix' ? 'Write your Juvix code here...' : 'Enter code...'}
        />
      </div>
      
      {/* Language indicator */}
      {language && (
        <div 
          className={`absolute bottom-2 right-2 px-2 py-1 text-xs rounded ${
            theme === 'dark'
              ? 'bg-gray-800 text-gray-300'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {language.toUpperCase()}
        </div>
      )}
    </div>
  );
}