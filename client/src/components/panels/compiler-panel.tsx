import * as React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { JuvixCompiler, type CompileResult } from "@/lib/juvix-compiler";
import { Play, CheckCircle, AlertCircle, Info, Download } from "lucide-react";

interface CompilerPanelProps {
  code: string;
  moduleName: string;
  fileName: string;
}

export function CompilerPanel({ code, moduleName, fileName }: CompilerPanelProps) {
  const [compileResult, setCompileResult] = React.useState<CompileResult | null>(null);
  const [isCompiling, setIsCompiling] = React.useState(false);
  const { toast } = useToast();

  const handleCompile = async () => {
    setIsCompiling(true);
    try {
      const actualModuleName = fileName.replace('.juvix', '');
      const result = await JuvixCompiler.compile(code, actualModuleName);
      setCompileResult(result);
      
      if (result.success) {
        toast({
          title: "Compilation successful",
          description: `${fileName} compiled successfully`,
        });
      } else {
        toast({
          title: "Compilation failed", 
          description: `${fileName}: ${result.errors.length} error(s) found`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Compilation error",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsCompiling(false);
    }
  };

  const handleExportNockma = () => {
    if (!compileResult?.nockma) return;
    
    try {
      const exportName = fileName.replace('.juvix', '.nockma');
      JuvixCompiler.exportNockma(compileResult.nockma, exportName);
      toast({
        title: "Nockma exported",
        description: `${exportName} downloaded successfully`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export nockma file",
        variant: "destructive",
      });
    }
  };

  const getFileAnalogy = (fileName: string): string => {
    const fileNameLower = fileName.toLowerCase();
    
    if (fileNameLower.includes('token') || fileNameLower.includes('transfer')) {
      return "You just wrote instructions for a digital bank teller. Your TokenTransfer contract can now securely move digital assets between accounts on the Anoma network.";
    } else if (fileNameLower.includes('marketplace') || fileNameLower.includes('market')) {
      return "You created a digital marketplace blueprint. Your contract can now automatically handle buying and selling between users on the Anoma network.";
    } else if (fileNameLower.includes('defi') || fileNameLower.includes('finance')) {
      return "You built a financial automation tool. Your DeFi contract can now manage loans, investments, or trading automatically on the Anoma network.";
    } else if (fileNameLower.includes('voting') || fileNameLower.includes('governance')) {
      return "You designed a digital voting machine. Your contract can now securely collect and count votes on the Anoma network.";
    } else if (fileNameLower.includes('nft') || fileNameLower.includes('collectible')) {
      return "You created a digital certificate maker. Your NFT contract can now mint and trade unique digital items on the Anoma network.";
    } else if (fileNameLower.includes('auction')) {
      return "You built an automated auctioneer. Your contract can now handle bidding and sales automatically on the Anoma network.";
    } else if (fileNameLower.includes('resource')) {
      return "You designed a resource management system. Your contract can now track and allocate digital resources on the Anoma network.";
    } else if (fileNameLower.includes('hello') || fileNameLower.includes('world')) {
      return "You wrote your first blockchain program! Like 'Hello World' in programming, this contract can now run and respond on the Anoma network.";
    } else {
      return `You created a custom smart contract (${fileName}). The Anoma network can now execute your specific business logic automatically and securely.`;
    }
  };

  const getContractPurpose = (fileName: string): string => {
    const fileNameLower = fileName.toLowerCase();
    
    if (fileNameLower.includes('token') || fileNameLower.includes('transfer')) {
      return "token transfer system";
    } else if (fileNameLower.includes('marketplace') || fileNameLower.includes('market')) {
      return "marketplace platform";
    } else if (fileNameLower.includes('defi') || fileNameLower.includes('finance')) {
      return "financial protocol";
    } else if (fileNameLower.includes('voting') || fileNameLower.includes('governance')) {
      return "voting system";
    } else if (fileNameLower.includes('nft') || fileNameLower.includes('collectible')) {
      return "NFT contract";
    } else if (fileNameLower.includes('auction')) {
      return "auction system";
    } else if (fileNameLower.includes('resource')) {
      return "resource manager";
    } else if (fileNameLower.includes('hello') || fileNameLower.includes('world')) {
      return "first smart contract";
    } else {
      return "custom contract";
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b vscode-border flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold vscode-text">Compiler Output</h3>
            <Badge variant="outline" className="text-xs">
              {fileName}
            </Badge>
          </div>
          <Button
            onClick={handleCompile}
            disabled={isCompiling}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Play className="h-3 w-3 mr-1" />
            {isCompiling ? "Compiling..." : "Compile"}
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {compileResult && (
            <div className="space-y-4">
              {/* Technical Status */}
              <div className="flex items-center space-x-2">
                {compileResult.success ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                <Badge variant={compileResult.success ? "default" : "destructive"}>
                  {compileResult.success ? "Success" : "Failed"}
                </Badge>
                <span className="text-xs text-gray-500">Technical Details</span>
              </div>

          {/* Logs */}
          <Card className="vscode-bg border-gray-600">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm vscode-text">Build Log</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ScrollArea className="h-40 max-h-48">
                <div className="space-y-1 font-mono text-xs pr-3">
                  {compileResult.logs.map((log, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Info className="h-3 w-3 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 leading-relaxed">{log}</span>
                    </div>
                  ))}
                  {compileResult.warnings.map((warning, index) => (
                    <div key={`warn-${index}`} className="flex items-start space-x-2">
                      <AlertCircle className="h-3 w-3 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span className="text-yellow-300 leading-relaxed">{warning}</span>
                    </div>
                  ))}
                  {compileResult.errors.map((error, index) => (
                    <div key={`err-${index}`} className="flex items-start space-x-2">
                      <AlertCircle className="h-3 w-3 text-red-400 mt-0.5 flex-shrink-0" />
                      <span className="text-red-300 leading-relaxed">{error}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>



          {/* Generated Nockma - Technical Details */}
          {compileResult.success && compileResult.nockma && (
            <details className="group">
              <summary className="cursor-pointer text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 flex items-center space-x-2">
                <span>🔧 View Technical Details (Advanced Users)</span>
              </summary>
              <Card className="vscode-bg border-gray-600 mt-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm vscode-text">Generated Nockma Bytecode</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ScrollArea className="h-24">
                    <div className="font-mono text-xs text-gray-300 break-all">
                      {compileResult.nockma}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </details>
          )}

          {/* User-Friendly Summary - For Normal Users */}
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
            <CardContent className="p-4">
              <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-3 flex items-center">
                🎯 What Just Happened? (Simple Explanation)
              </h4>
              {compileResult.success ? (
                <div className="space-y-3">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-purple-100 dark:border-purple-700">
                    <h5 className="font-medium text-green-700 dark:text-green-300 mb-2">✅ Success! Your Code Works</h5>
                    <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <p>Think of this like Google Translate, but for code:</p>
                      <p>• You wrote your <strong>{fileName}</strong> contract in <strong>Juvix</strong> (human-readable)</p>
                      <p>• The compiler translated it to <strong>Nockma</strong> (computer-readable)</p>
                      <p>• Your {getContractPurpose(fileName)} can now run on the Anoma blockchain</p>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-blue-100 dark:border-blue-700">
                    <h5 className="font-medium text-blue-700 dark:text-blue-300 mb-2">🚀 What Can You Do Now?</h5>
                    <div className="text-sm text-gray-700 dark:text-gray-300 space-y-3">
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded border">
                        <p className="font-medium mb-2">🧪 Step 1: Test Your Contract (Safe)</p>
                        <p className="text-xs">Click the <strong>"Simulate"</strong> tab above → Run test scenarios → See what your contract does</p>
                        <p className="text-xs text-blue-600 dark:text-blue-400">No real money involved - completely safe testing</p>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded border">
                        <p className="font-medium mb-2">📝 Step 2: Create Transactions</p>
                        <p className="text-xs">Click the <strong>"Intents"</strong> tab above → Build real transactions → Sign with your keys</p>
                        <p className="text-xs text-blue-600 dark:text-blue-400">Create actual transactions using your contract</p>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded border flex items-center justify-between">
                        <div>
                          <p className="font-medium mb-1">💾 Step 3: Download Contract</p>
                          <p className="text-xs">Get the compiled file for real deployment</p>
                        </div>
                        <Button
                          onClick={handleExportNockma}
                          size="sm"
                          className="h-7 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-700">
                    <p className="text-xs text-yellow-700 dark:text-yellow-300">
                      <strong>Real-world analogy:</strong> {getFileAnalogy(fileName)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-700">
                  <h5 className="font-medium text-red-700 dark:text-red-300 mb-2">❌ Oops! Something Needs Fixing</h5>
                  <div className="text-sm text-red-600 dark:text-red-400 space-y-1">
                    <p>Don't worry - this happens to everyone, even experts!</p>
                    <p>• Found {compileResult.errors.length} issue(s) in your code</p>
                    <p>• Check the "Build Log" above for specific problems</p>
                    <p>• Fix the issues and click "Compile" again</p>
                    <p><strong>Tip:</strong> Look for spelling mistakes, missing semicolons, or incorrect syntax</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
            </div>
          )}
          
          {!compileResult && (
            <div className="text-center text-gray-400 text-sm py-8">
              Click "Compile" to build your Juvix code
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
