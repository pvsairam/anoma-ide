import * as React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, BookOpen, Code, Zap, Settings, Terminal, ExternalLink } from "lucide-react";

interface TutorialSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TutorialSidebar({ isOpen, onClose }: TutorialSidebarProps) {
  if (!isOpen) return null;

  return (
    <div className="vscode-sidebar border-l vscode-border w-80">
      <div className="panel-content p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold vscode-text">Anoma Tutorial</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="hover:text-red-400"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="h-full">
          <div className="space-y-4 text-sm">
            {/* What is Juvix */}
            <Card className="vscode-bg border-gray-600">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-blue-400 flex items-center">
                  <Code className="h-4 w-4 mr-2" />
                  What is Juvix?
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-300 leading-relaxed">
                  Juvix is Anoma's programming language for intent-centric and declarative 
                  decentralized applications. It focuses on user outcomes rather than 
                  transaction mechanics, allowing developers to express what should happen 
                  instead of how it should happen.
                </p>
              </CardContent>
            </Card>

            {/* What is an Intent */}
            <Card className="vscode-bg border-gray-600">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-green-500 flex items-center">
                  <Zap className="h-4 w-4 mr-2" />
                  What is an Intent?
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-300 leading-relaxed">
                  An intent expresses what a user wants to achieve, abstracting away 
                  the technical complexity of how transactions are executed on the 
                  blockchain. Users specify their goals, and Anoma's solver network 
                  finds the optimal path to achieve them.
                </p>
              </CardContent>
            </Card>

            {/* Resource Logic Lifecycle */}
            <Card className="vscode-bg border-gray-600">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-orange-500 flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Resource Logic Lifecycle
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-blue-600 rounded-full mr-3 text-xs flex items-center justify-center text-white font-semibold">
                      1
                    </span>
                    <span className="text-gray-300">Write Juvix code</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-blue-600 rounded-full mr-3 text-xs flex items-center justify-center text-white font-semibold">
                      2
                    </span>
                    <span className="text-gray-300">Compile to .nockma</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-blue-600 rounded-full mr-3 text-xs flex items-center justify-center text-white font-semibold">
                      3
                    </span>
                    <span className="text-gray-300">Generate intent</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-blue-600 rounded-full mr-3 text-xs flex items-center justify-center text-white font-semibold">
                      4
                    </span>
                    <span className="text-gray-300">Sign with ed25519</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-blue-600 rounded-full mr-3 text-xs flex items-center justify-center text-white font-semibold">
                      5
                    </span>
                    <span className="text-gray-300">Submit to network</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Using Anoma CLI */}
            <Card className="vscode-bg border-gray-600">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-300 flex items-center">
                  <Terminal className="h-4 w-4 mr-2" />
                  Using Anoma CLI
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <p className="text-gray-300 text-xs">
                    Once you've signed your intent, you can submit it using the Anoma CLI:
                  </p>
                  <div className="vscode-bg p-2 rounded font-mono text-xs border border-gray-600">
                    <div className="text-gray-400 mb-1"># Submit signed intent</div>
                    <div className="text-green-400">anoma client submit-intent signed_intent.json</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Features */}
            <Card className="vscode-bg border-gray-600">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-purple-400 flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Key Features
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-xs">
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-400">•</span>
                    <span className="text-gray-300">Monaco Editor with Juvix syntax highlighting</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-400">•</span>
                    <span className="text-gray-300">In-browser ed25519 key generation</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-400">•</span>
                    <span className="text-gray-300">Intent builder with form and JSON modes</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-400">•</span>
                    <span className="text-gray-300">Projection function simulator</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-400">•</span>
                    <span className="text-gray-300">Export capabilities for all artifacts</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Learn More */}
            <Card className="vscode-bg border-gray-600">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-blue-400 flex items-center">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Learn More
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-xs">
                  <a 
                    href="https://docs.anoma.net/build/getting-started" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 block"
                  >
                    📘 Anoma Build Docs - Getting Started
                  </a>
                  <a 
                    href="https://docs.anoma.net/build/your-first-anoma-application" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 block"
                  >
                    📘 Your First Anoma Application
                  </a>
                  <a 
                    href="https://juvix.org/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 block"
                  >
                    📘 Juvix Language Documentation
                  </a>
                  <a 
                    href="https://github.com/anoma/anoma" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 block"
                  >
                    📘 Anoma GitHub Repository
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
