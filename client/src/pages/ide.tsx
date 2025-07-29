import * as React from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/use-theme";

import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { SimpleEditor } from "@/components/editor/simple-editor";
import { CompilerPanel } from "@/components/panels/compiler-panel";
import { IntentPanel } from "@/components/panels/intent-panel";
import { SimulationPanel } from "@/components/panels/simulation-panel";
import { EnhancedSimulationPanel } from "@/components/panels/simulation-panel-enhanced";
import { KeyManagement } from "@/components/panels/key-management";
import { TutorialSidebar } from "@/components/panels/tutorial-sidebar";

import { JuvixCompiler } from "@/lib/juvix-compiler";
import { IntentBuilder } from "@/lib/intent-builder";
import { AnomaKeyManager, type KeyPair } from "@/lib/crypto";

export default function IDE() {
  const [activePanel, setActivePanel] = React.useState("files");
  const [activeTab, setActiveTab] = React.useState("compiler");
  const [showTutorial, setShowTutorial] = React.useState(false);
  const [code, setCode] = React.useState(JuvixCompiler.getDefaultJuvixCode());
  const [keyPair, setKeyPair] = React.useState<KeyPair | null>(null);
  const [currentFile, setCurrentFile] = React.useState("HelloWorld.juvix");
  const [projectName, setProjectName] = React.useState("Anoma Project");
  const [projectFiles, setProjectFiles] = React.useState([
    { name: "HelloWorld.juvix", active: false, type: "juvix" as const },
    { name: "Package.juvix", active: false, type: "file" as const },
    { name: "Resource.juvix", active: false, type: "file" as const },
    { name: "Transaction.juvix", active: false, type: "file" as const },
  ]);
  
  const { theme } = useTheme();
  const { toast } = useToast();

  const files = projectFiles.map(file => ({
    ...file,
    active: currentFile === file.name
  }));

  React.useEffect(() => {
    // Initialize with a default key pair for demo purposes
    const initializeKeyPair = async () => {
      try {
        const storedKeyPair = localStorage.getItem("anoma-keypair");
        if (storedKeyPair) {
          const parsed = JSON.parse(storedKeyPair);
          setKeyPair(parsed);
        }
      } catch (error) {
        console.warn("Failed to load stored key pair:", error);
      }
    };

    initializeKeyPair();
  }, []);

  React.useEffect(() => {
    if (keyPair) {
      localStorage.setItem("anoma-keypair", JSON.stringify(keyPair));
    }
  }, [keyPair]);

  React.useEffect(() => {
    if (activePanel === "tutorial") {
      setShowTutorial(true);
    } else {
      setShowTutorial(false);
    }
  }, [activePanel]);

  const handlePanelChange = (panel: string) => {
    setActivePanel(panel);
    
    if (panel === "intents") {
      setActiveTab("intents");
    } else if (panel === "keys") {
      setActiveTab("compiler"); // Show key management in sidebar
    }
  };

  const handleFileSelect = (filename: string) => {
    setCurrentFile(filename);
    
    if (filename === "HelloWorld.juvix") {
      setCode(JuvixCompiler.getDefaultJuvixCode());
    } else {
      // For other files, show placeholder content
      setCode(`-- ${filename}\n-- This file is part of the HelloWorld project\n-- Add your ${filename.replace('.juvix', '')} logic here`);
    }
    
    toast({
      title: "File opened",
      description: `Switched to ${filename}`,
    });
  };

  const handleNewFile = () => {
    const fileName = prompt("Enter new file name (e.g., MyResource.juvix):");
    if (fileName && fileName.trim()) {
      const cleanName = fileName.trim();
      const isJuvixFile = cleanName.endsWith('.juvix');
      
      // Check if file already exists
      if (projectFiles.some(f => f.name === cleanName)) {
        toast({
          title: "File already exists",
          description: `A file named ${cleanName} already exists`,
          variant: "destructive",
        });
        return;
      }

      // Add new file to project
      setProjectFiles(prev => [...prev, {
        name: cleanName,
        active: false,
        type: isJuvixFile ? "juvix" : "file"
      }]);

      // Switch to new file
      setCurrentFile(cleanName);
      setCode(isJuvixFile ? 
        `-- ${cleanName}: New Juvix module\nmodule ${cleanName.replace('.juvix', '')};\n\nimport Stdlib.Prelude open;\nimport Anoma.Resource open;\n\n-- Add your code here\n` :
        `-- ${cleanName}\n-- New project file\n-- Add your content here\n`
      );

      toast({
        title: "File created",
        description: `Created ${cleanName}`,
      });
    }
  };



  return (
    <div className="h-screen flex flex-col vscode-bg">
      <Header
        activePanel={activePanel}
        onPanelChange={handlePanelChange}
      />

      <div className="flex-1 flex overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="min-h-0">
          {/* Left Sidebar */}
          <ResizablePanel defaultSize={18} minSize={12} maxSize={30}>
            <div className="h-full flex flex-col">
              <Sidebar
                files={files}
                onFileSelect={handleFileSelect}
                onNewFile={handleNewFile}
                projectName={projectName}
                networkStatus="connected"
              />
              {activePanel === "keys" && (
                <div className="border-t vscode-border">
                  <KeyManagement
                    currentKeyPair={keyPair}
                    onKeyPairChange={setKeyPair}
                  />
                </div>
              )}
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Main Content */}
          <ResizablePanel defaultSize={52} minSize={35}>
            <div className="h-full flex flex-col">
              {/* Editor Tabs */}
              <div className="vscode-sidebar border-b vscode-border flex">
                <div className="vscode-bg px-3 py-1.5 text-sm flex items-center">
                  <span className="vscode-text">{currentFile}</span>
                </div>
              </div>

              {/* Code Editor */}
              <div className="flex-1">
                <SimpleEditor
                  value={code}
                  onChange={setCode}
                  language="juvix"
                  theme={theme}
                  height="100%"
                />
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right Panel */}
          <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
            <div className="h-full vscode-sidebar">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
                <TabsList className="w-full vscode-sidebar border-b vscode-border rounded-none">
                  <TabsTrigger value="compiler" className="flex-1">
                    Compiler
                  </TabsTrigger>
                  <TabsTrigger value="intents" className="flex-1">
                    Intents
                  </TabsTrigger>
                  <TabsTrigger value="simulation" className="flex-1">
                    Simulate
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="compiler" className="h-full m-0">
                  <CompilerPanel code={code} moduleName={currentFile.replace('.juvix', '')} fileName={currentFile} />
                </TabsContent>

                <TabsContent value="intents" className="h-full m-0">
                  <IntentPanel keyPair={keyPair} />
                </TabsContent>

                <TabsContent value="simulation" className="h-full m-0">
                  <EnhancedSimulationPanel fileName={currentFile} />
                </TabsContent>
              </Tabs>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>

        {/* Tutorial Sidebar */}
        <TutorialSidebar
          isOpen={showTutorial}
          onClose={() => {
            setShowTutorial(false);
            setActivePanel("files");
          }}
        />
      </div>
    </div>
  );
}
