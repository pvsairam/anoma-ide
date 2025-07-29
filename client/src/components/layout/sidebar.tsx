import * as React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileCode, File, FolderOpen, Globe, Wifi, Plus } from "lucide-react";

interface SidebarProps {
  files: Array<{ name: string; active: boolean; type: "juvix" | "file" }>;
  onFileSelect: (filename: string) => void;
  onNewFile?: () => void;
  projectName?: string;
  networkStatus: "connected" | "disconnected";
}

export function Sidebar({ files, onFileSelect, onNewFile, projectName = "Anoma Project", networkStatus }: SidebarProps) {
  return (
    <div className="vscode-sidebar border-r vscode-border h-full">
      <ScrollArea className="h-full">
        {/* File Explorer */}
        <div className="p-2 border-b vscode-border">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold flex items-center vscode-text text-sm">
              <FolderOpen className="mr-1.5 text-orange-500 h-3.5 w-3.5" />
              {projectName}
            </h3>
            {onNewFile && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-gray-700"
                onClick={onNewFile}
                title="Create new Juvix file"
              >
                <Plus className="h-3 w-3 text-gray-400" />
              </Button>
            )}
          </div>
          <div className="text-sm space-y-1">
            {files.map((file) => (
              <Button
                key={file.name}
                variant="ghost"
                size="sm"
                className={`w-full justify-start p-1 h-auto ${
                  file.active ? "vscode-bg" : "hover:bg-gray-700"
                }`}
                onClick={() => onFileSelect(file.name)}
              >
                {file.type === "juvix" ? (
                  <FileCode className="mr-2 text-blue-500 h-4 w-4" />
                ) : (
                  <File className="mr-2 text-gray-400 h-4 w-4" />
                )}
                <span className="vscode-text">{file.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Network Status */}
        <div className="p-2">
          <h3 className="font-semibold mb-1 flex items-center vscode-text text-sm">
            <Globe className="mr-1.5 text-orange-500 h-3.5 w-3.5" />
            Network
          </h3>
          <div className="text-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="vscode-text">Status:</span>
              <div className="flex items-center">
                <Wifi className={`h-3 w-3 mr-1 ${
                  networkStatus === "connected" ? "text-green-500" : "text-red-500"
                }`} />
                <span className={
                  networkStatus === "connected" ? "text-green-500" : "text-red-500"
                }>
                  {networkStatus === "connected" ? "Live" : "Disconnected"}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="vscode-text">Endpoint:</span>
              <span className="text-xs text-gray-400">devnet.anoma.net</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="vscode-text">Local Port:</span>
              <span className="text-xs text-gray-400">5000 (dev)</span>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
