import * as React from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

import { Moon, Sun, Box, FileText, Wand2, Key, BookOpen } from "lucide-react";

interface HeaderProps {
  activePanel: string;
  onPanelChange: (panel: string) => void;
}

export function Header({ activePanel, onPanelChange }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="vscode-sidebar border-b vscode-border px-4 py-2 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Box className="text-blue-500 h-5 w-5" />
          <h1 className="text-lg font-semibold vscode-text">Anoma IDE</h1>
          <span className="text-xs bg-green-500 text-black px-2 py-1 rounded">
            Live
          </span>
        </div>
        <nav className="flex items-center space-x-4 text-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPanelChange("files")}
            className={`hover:text-blue-500 transition-colors ${
              activePanel === "files" ? "text-blue-500" : "vscode-text"
            }`}
          >
            <FileText className="h-4 w-4 mr-1" />
            Files
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPanelChange("intents")}
            className={`hover:text-blue-500 transition-colors ${
              activePanel === "intents" ? "text-blue-500" : "vscode-text"
            }`}
          >
            <Wand2 className="h-4 w-4 mr-1" />
            Intents
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPanelChange("keys")}
            className={`hover:text-blue-500 transition-colors ${
              activePanel === "keys" ? "text-blue-500" : "vscode-text"
            }`}
          >
            <Key className="h-4 w-4 mr-1" />
            Keys
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPanelChange("tutorial")}
            className={`hover:text-blue-500 transition-colors ${
              activePanel === "tutorial" ? "text-blue-500" : "vscode-text"
            }`}
          >
            <BookOpen className="h-4 w-4 mr-1" />
            Tutorial
          </Button>
        </nav>
      </div>
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="hover:text-blue-500 transition-colors"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
      </div>
    </header>
  );
}
