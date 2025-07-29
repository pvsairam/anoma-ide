import * as React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Play, CheckCircle, Clock } from "lucide-react";

interface SimulationResult {
  function: string;
  parameters: string[];
  result: any;
  executionTime: number;
  success: boolean;
  error?: string;
}

export function SimulationPanel() {
  const [selectedFunction, setSelectedFunction] = React.useState("getHelloWorldMessage");
  const [resourceId, setResourceId] = React.useState("resource_001");
  const [simulationResult, setSimulationResult] = React.useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = React.useState(false);
  const { toast } = useToast();

  const mockState = {
    resources: [
      {
        id: "resource_001",
        type: "HelloWorldResource",
        data: {
          message: "Hello, Anoma!",
          timestamp: 1704067200,
          owner: "ed25519:A1B2C3D4E5F6...",
        },
      },
      {
        id: "resource_002",
        type: "HelloWorldResource",
        data: {
          message: "Welcome to the future!",
          timestamp: 1704067300,
          owner: "ed25519:F6E5D4C3B2A1...",
        },
      },
    ],
  };

  const availableFunctions = [
    { value: "getHelloWorldMessage", label: "getHelloWorldMessage", params: ["resourceId"] },
    { value: "getAllResources", label: "getAllResources", params: [] },
    { value: "getResourceOwner", label: "getResourceOwner", params: ["resourceId"] },
    { value: "getResourceTimestamp", label: "getResourceTimestamp", params: ["resourceId"] },
  ];

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    
    // Simulate execution delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    try {
      let result: any;
      let success = true;
      let error: string | undefined;

      const resource = mockState.resources.find(r => r.id === resourceId);

      switch (selectedFunction) {
        case "getHelloWorldMessage":
          if (resource) {
            result = resource.data.message;
          } else {
            result = null;
            error = `Resource ${resourceId} not found`;
            success = false;
          }
          break;

        case "getAllResources":
          result = mockState.resources.map(r => ({
            id: r.id,
            type: r.type,
            message: r.data.message,
          }));
          break;

        case "getResourceOwner":
          if (resource) {
            result = resource.data.owner;
          } else {
            result = null;
            error = `Resource ${resourceId} not found`;
            success = false;
          }
          break;

        case "getResourceTimestamp":
          if (resource) {
            result = resource.data.timestamp;
          } else {
            result = null;
            error = `Resource ${resourceId} not found`;
            success = false;
          }
          break;

        default:
          result = null;
          error = "Unknown function";
          success = false;
      }

      const simulationResult: SimulationResult = {
        function: selectedFunction,
        parameters: selectedFunction === "getAllResources" ? [] : [resourceId],
        result,
        executionTime: Math.random() * 0.01, // 0-10ms
        success,
        error,
      };

      setSimulationResult(simulationResult);

      if (success) {
        toast({
          title: "Simulation completed",
          description: `Function ${selectedFunction} executed successfully`,
        });
      } else {
        toast({
          title: "Simulation failed",
          description: error || "Unknown error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Simulation error",
        description: error instanceof Error ? error.message : "Simulation failed",
        variant: "destructive",
      });
    } finally {
      setIsSimulating(false);
    }
  };

  const selectedFunctionData = availableFunctions.find(f => f.value === selectedFunction);

  return (
    <div className="p-3 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold vscode-text">Projection Simulator</h3>
        <Button
          onClick={handleRunSimulation}
          disabled={isSimulating}
          size="sm"
          className="bg-green-600 hover:bg-green-700"
        >
          <Play className="h-3 w-3 mr-1" />
          {isSimulating ? "Running..." : "Run Simulation"}
        </Button>
      </div>

      <div className="space-y-3">
        <div>
          <Label className="text-sm font-medium vscode-text">Function</Label>
          <Select value={selectedFunction} onValueChange={setSelectedFunction}>
            <SelectTrigger className="vscode-bg border-gray-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="vscode-bg border-gray-600">
              {availableFunctions.map((func) => (
                <SelectItem key={func.value} value={func.value}>
                  {func.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedFunctionData?.params.includes("resourceId") && (
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
      </div>

      {/* Mock State Display */}
      <Card className="vscode-bg border-gray-600">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm vscode-text">Mock State</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ScrollArea className="h-24">
            <pre className="text-xs text-gray-300 whitespace-pre-wrap">
              {JSON.stringify(mockState, null, 2)}
            </pre>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Simulation Results */}
      {simulationResult && (
        <Card className="vscode-bg border-gray-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm vscode-text flex items-center">
              {simulationResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              ) : (
                <Clock className="h-4 w-4 text-red-500 mr-2" />
              )}
              Simulation Results
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-blue-400">Function:</span>
                <span className="text-gray-300">{simulationResult.function}</span>
              </div>
              
              {simulationResult.parameters.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-blue-400">Parameters:</span>
                  <span className="text-gray-300">{simulationResult.parameters.join(", ")}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-blue-400">Result:</span>
                <span className={simulationResult.success ? "text-green-400" : "text-red-400"}>
                  {simulationResult.success 
                    ? (typeof simulationResult.result === "object" 
                        ? JSON.stringify(simulationResult.result) 
                        : String(simulationResult.result))
                    : simulationResult.error
                  }
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-blue-400">Execution time:</span>
                <span className="text-gray-400">{simulationResult.executionTime.toFixed(3)}s</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
