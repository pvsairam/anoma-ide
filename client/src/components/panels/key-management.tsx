import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AnomaKeyManager, type KeyPair } from "@/lib/crypto";
import { Key, Copy, Download, Upload, Eye, EyeOff } from "lucide-react";

interface KeyManagementProps {
  currentKeyPair: KeyPair | null;
  onKeyPairChange: (keyPair: KeyPair) => void;
}

export function KeyManagement({ currentKeyPair, onKeyPairChange }: KeyManagementProps) {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [showPrivateKey, setShowPrivateKey] = React.useState(false);
  const { toast } = useToast();

  const handleGenerateKeyPair = async () => {
    setIsGenerating(true);
    try {
      const keyPair = await AnomaKeyManager.generateKeyPair();
      onKeyPairChange(keyPair);
      toast({
        title: "Key pair generated",
        description: "New ed25519 key pair has been generated successfully",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate key pair",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyPublicKey = async () => {
    if (!currentKeyPair) return;
    
    try {
      await AnomaKeyManager.copyToClipboard(currentKeyPair.publicKey);
      toast({
        title: "Copied to clipboard",
        description: "Public key has been copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy public key to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleCopyPrivateKey = async () => {
    if (!currentKeyPair) return;
    
    try {
      await AnomaKeyManager.copyToClipboard(currentKeyPair.privateKey);
      toast({
        title: "Copied to clipboard",
        description: "Private key has been copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy private key to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleDownloadKeyPair = () => {
    if (!currentKeyPair) return;
    
    try {
      AnomaKeyManager.saveKeyPair(currentKeyPair);
      toast({
        title: "Key pair downloaded",
        description: "Key pair has been saved to your device",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to download key pair",
        variant: "destructive",
      });
    }
  };

  const handleImportKeyPair = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (data.publicKey && data.privateKey) {
            onKeyPairChange({ publicKey: data.publicKey, privateKey: data.privateKey });
            toast({
              title: "Key pair imported",
              description: "Key pair has been imported successfully",
            });
          } else {
            throw new Error("Invalid key pair format");
          }
        } catch (error) {
          toast({
            title: "Import failed",
            description: "Invalid key pair file format",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="p-3 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center vscode-text">
          <Key className="mr-2 text-green-500 h-4 w-4" />
          Key Management
        </h3>
      </div>

      {currentKeyPair ? (
        <div className="space-y-4">
          <Card className="vscode-bg border-gray-600">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm vscode-text">Public Key</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center space-x-2">
                <Input
                  value={currentKeyPair.publicKey}
                  readOnly
                  className="font-mono text-xs vscode-bg border-gray-600 text-green-500"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyPublicKey}
                  className="border-gray-600"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="vscode-bg border-gray-600">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm vscode-text flex items-center justify-between">
                Private Key
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowPrivateKey(!showPrivateKey)}
                >
                  {showPrivateKey ? (
                    <EyeOff className="h-3 w-3" />
                  ) : (
                    <Eye className="h-3 w-3" />
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center space-x-2">
                <Input
                  value={showPrivateKey ? currentKeyPair.privateKey : "••••••••••••••••••••••••••••••••"}
                  readOnly
                  type={showPrivateKey ? "text" : "password"}
                  className="font-mono text-xs vscode-bg border-gray-600 text-orange-500"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyPrivateKey}
                  className="border-gray-600"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleDownloadKeyPair}
              className="flex-1 border-gray-600"
            >
              <Download className="h-3 w-3 mr-1" />
              Download
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleGenerateKeyPair}
              disabled={isGenerating}
              className="flex-1 border-gray-600"
            >
              {isGenerating ? "Generating..." : "Generate New"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-400 text-center">
            No key pair available. Generate or import one to get started.
          </p>
          <div className="flex space-x-2">
            <Button
              onClick={handleGenerateKeyPair}
              disabled={isGenerating}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isGenerating ? "Generating..." : "Generate New"}
            </Button>
            <Button
              variant="outline"
              onClick={handleImportKeyPair}
              className="flex-1 border-gray-600"
            >
              <Upload className="h-3 w-3 mr-1" />
              Import
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
