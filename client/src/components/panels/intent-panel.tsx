import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { IntentBuilder, type Intent, type SignedIntent } from "@/lib/intent-builder";
import { AnomaKeyManager, type KeyPair } from "@/lib/crypto";
import { Wand2, FileDown, PenTool } from "lucide-react";

interface IntentPanelProps {
  keyPair: KeyPair | null;
}

export function IntentPanel({ keyPair }: IntentPanelProps) {
  const [intentType, setIntentType] = React.useState("CreateResource");
  const [message, setMessage] = React.useState("Hello, Anoma!");
  const [resourceId, setResourceId] = React.useState("");
  const [newOwner, setNewOwner] = React.useState("");
  const [jsonIntent, setJsonIntent] = React.useState("");
  const [generatedIntent, setGeneratedIntent] = React.useState<Intent | null>(null);
  const [signedIntent, setSignedIntent] = React.useState<SignedIntent | null>(null);
  const [isJsonMode, setIsJsonMode] = React.useState(false);
  const [isSigning, setIsSigning] = React.useState(false);
  const [showInstructions, setShowInstructions] = React.useState(true);
  const { toast } = useToast();

  const intentTypes = IntentBuilder.getIntentTypes();

  const handleGenerateIntent = () => {
    try {
      let intent: Intent;

      if (isJsonMode) {
        if (!jsonIntent.trim()) {
          toast({
            title: "JSON required",
            description: "Please enter intent JSON",
            variant: "destructive",
          });
          return;
        }
        
        const parsed = JSON.parse(jsonIntent);
        intent = parsed;
      } else {
        if (intentType === "CreateResource") {
          if (!message) {
            toast({
              title: "Message required",
              description: "Please enter a message for the resource",
              variant: "destructive",
            });
            return;
          }
          
          intent = IntentBuilder.createHelloWorldIntent(
            message,
            keyPair?.publicKey || "ed25519:unknown"
          );
        } else if (intentType === "UpdateResource") {
          if (!resourceId || !message) {
            toast({
              title: "Fields required",
              description: "Please enter both resource ID and message",
              variant: "destructive",
            });
            return;
          }
          
          intent = IntentBuilder.createUpdateIntent(resourceId, message);
        } else if (intentType === "TransferResource") {
          if (!resourceId || !newOwner) {
            toast({
              title: "Fields required",
              description: "Please enter both resource ID and new owner",
              variant: "destructive",
            });
            return;
          }
          
          intent = IntentBuilder.createTransferIntent(resourceId, newOwner);
        } else {
          intent = IntentBuilder.createIntent(intentType, "HelloWorldResource", {
            message,
            resourceId,
            newOwner,
          });
        }
      }

      const validation = IntentBuilder.validateIntent(intent);
      if (!validation.valid) {
        toast({
          title: "Invalid intent",
          description: validation.errors[0],
          variant: "destructive",
        });
        return;
      }

      setGeneratedIntent(intent);
      setSignedIntent(null); // Reset signed intent when generating new one
      
      toast({
        title: "Intent generated",
        description: "Intent has been created successfully",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate intent",
        variant: "destructive",
      });
    }
  };

  const handleSignIntent = async () => {
    if (!generatedIntent || !keyPair) {
      toast({
        title: "Cannot sign",
        description: !generatedIntent ? "No intent to sign" : "No key pair available",
        variant: "destructive",
      });
      return;
    }

    setIsSigning(true);
    try {
      const signature = await AnomaKeyManager.signIntent(generatedIntent, keyPair.privateKey);
      
      const signed: SignedIntent = {
        intent: generatedIntent,
        signature,
        publicKey: keyPair.publicKey,
      };

      setSignedIntent(signed);
      
      toast({
        title: "Intent signed",
        description: "Intent has been signed with your private key",
      });
    } catch (error) {
      toast({
        title: "Signing failed",
        description: error instanceof Error ? error.message : "Failed to sign intent",
        variant: "destructive",
      });
    } finally {
      setIsSigning(false);
    }
  };

  const handleExportIntent = () => {
    if (!generatedIntent) return;
    
    try {
      const dataToExport = signedIntent || generatedIntent;
      const filename = signedIntent ? "signed-intent.json" : "intent.json";
      IntentBuilder.exportIntent(dataToExport, filename);
      
      toast({
        title: "Intent exported",
        description: "Intent has been downloaded to your device",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export intent",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-3 space-y-4">
      {/* Quick Instructions */}
      {showInstructions && (
        <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <PenTool className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">📝 Create Real Transactions</h4>
                  <div className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
                    <p><strong>Step 1:</strong> Choose what you want to do (Create, Update, or Transfer)</p>
                    <p><strong>Step 2:</strong> Fill in the details (message, addresses, etc.)</p>
                    <p><strong>Step 3:</strong> Click "Generate Intent" to create the transaction</p>
                    <p><strong>Step 4:</strong> Click "Sign Intent" to authorize it with your key</p>
                    <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">This creates real blockchain transactions using your compiled contract!</p>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowInstructions(false)}
                className="text-purple-600 hover:text-purple-800"
              >
                ×
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <h3 className="font-semibold vscode-text">Intent Builder</h3>
        <div className="flex space-x-1">
          <Button
            size="sm"
            variant={!isJsonMode ? "default" : "outline"}
            onClick={() => setIsJsonMode(false)}
            className="text-xs"
          >
            Form
          </Button>
          <Button
            size="sm"
            variant={isJsonMode ? "default" : "outline"}
            onClick={() => setIsJsonMode(true)}
            className="text-xs"
          >
            JSON
          </Button>
        </div>
      </div>

      <Tabs value={isJsonMode ? "json" : "form"} className="w-full">
        <TabsContent value="form" className="space-y-4">
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium vscode-text">Intent Type</Label>
              <Select value={intentType} onValueChange={setIntentType}>
                <SelectTrigger className="vscode-bg border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="vscode-bg border-gray-600">
                  {intentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(intentType === "CreateResource" || intentType === "UpdateResource") && (
              <div>
                <Label className="text-sm font-medium vscode-text">Message</Label>
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hello, Anoma!"
                  className="vscode-bg border-gray-600"
                />
              </div>
            )}

            {(intentType === "UpdateResource" || intentType === "TransferResource") && (
              <div>
                <Label className="text-sm font-medium vscode-text">Resource ID</Label>
                <Input
                  value={resourceId}
                  onChange={(e) => setResourceId(e.target.value)}
                  placeholder="resource_001"
                  className="vscode-bg border-gray-600"
                />
              </div>
            )}

            {intentType === "TransferResource" && (
              <div>
                <Label className="text-sm font-medium vscode-text">New Owner Public Key</Label>
                <Input
                  value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value)}
                  placeholder="ed25519:..."
                  className="vscode-bg border-gray-600"
                />
              </div>
            )}

            <Button
              onClick={handleGenerateIntent}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Wand2 className="h-4 w-4 mr-1" />
              Generate Intent
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="json" className="space-y-4">
          <div>
            <Label className="text-sm font-medium vscode-text">Intent JSON</Label>
            <Textarea
              value={jsonIntent}
              onChange={(e) => setJsonIntent(e.target.value)}
              placeholder="Enter intent JSON..."
              className="vscode-bg border-gray-600 font-mono text-xs h-32"
            />
          </div>
          <Button
            onClick={handleGenerateIntent}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <Wand2 className="h-4 w-4 mr-1" />
            Parse Intent
          </Button>
        </TabsContent>
      </Tabs>

      {/* Generated Intent */}
      {generatedIntent && (
        <Card className="vscode-bg border-gray-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm vscode-text">Generated Intent</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ScrollArea className="h-32">
              <pre className="text-xs text-gray-300 whitespace-pre-wrap">
                {JSON.stringify(generatedIntent, null, 2)}
              </pre>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Signing Section */}
      {generatedIntent && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm vscode-text">Signing</h4>
            <Button
              onClick={handleSignIntent}
              disabled={!keyPair || isSigning}
              size="sm"
              className="bg-orange-600 hover:bg-orange-700"
            >
              <PenTool className="h-3 w-3 mr-1" />
              {isSigning ? "Signing..." : "Sign Intent"}
            </Button>
          </div>

          {!keyPair && (
            <p className="text-xs text-gray-400">
              Generate or import a key pair to sign intents
            </p>
          )}

          {signedIntent && (
            <Card className="vscode-bg border-gray-600">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm vscode-text">Signature</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="font-mono text-xs text-green-400 break-all">
                  {signedIntent.signature}
                </div>
              </CardContent>
            </Card>
          )}

          {generatedIntent && (
            <Button
              onClick={handleExportIntent}
              variant="outline"
              size="sm"
              className="w-full border-gray-600"
            >
              <FileDown className="h-3 w-3 mr-1" />
              Export {signedIntent ? "Signed Intent" : "Intent"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
