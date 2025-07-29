import * as React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Play, CheckCircle, Clock, Info, Lightbulb } from "lucide-react";

interface SimulationResult {
  function: string;
  parameters: string[];
  result: any;
  executionTime: number;
  success: boolean;
  error?: string;
}

interface ContractFunction {
  name: string;
  description: string;
  parameters: Array<{name: string, type: string, example: string}>;
  whatItDoes: string;
}

interface EnhancedSimulationPanelProps {
  fileName?: string;
}

export function EnhancedSimulationPanel({ fileName = "HelloWorld.juvix" }: EnhancedSimulationPanelProps) {
  const [selectedFunction, setSelectedFunction] = React.useState("");
  const [parameters, setParameters] = React.useState<Record<string, string>>({});
  const [simulationResult, setSimulationResult] = React.useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = React.useState(false);
  const { toast } = useToast();

  const getContractFunctions = (fileName: string): ContractFunction[] => {
    const fileNameLower = fileName.toLowerCase();
    
    if (fileNameLower.includes('token') || fileNameLower.includes('transfer')) {
      return [
        {
          name: "transferTokens",
          description: "Transfer tokens between accounts",
          parameters: [
            {name: "fromAddress", type: "string", example: "anoma1abc123..."},
            {name: "toAddress", type: "string", example: "anoma1def456..."},
            {name: "amount", type: "number", example: "100"}
          ],
          whatItDoes: "Moves tokens from one account to another, checking balances and fees"
        },
        {
          name: "getTokenBalance", 
          description: "Check token balance for an account",
          parameters: [
            {name: "address", type: "string", example: "anoma1abc123..."}
          ],
          whatItDoes: "Returns how many tokens an address owns"
        },
        {
          name: "createToken",
          description: "Create new tokens",
          parameters: [
            {name: "tokenId", type: "string", example: "GOLD"},
            {name: "amount", type: "number", example: "1000"}
          ],
          whatItDoes: "Mints new tokens and assigns them to your account"
        }
      ];
    } else if (fileNameLower.includes('voting')) {
      return [
        {
          name: "createProposal",
          description: "Create a new voting proposal",
          parameters: [
            {name: "title", type: "string", example: "Budget Approval 2024"},
            {name: "description", type: "string", example: "Approve $1M budget"},
            {name: "options", type: "string", example: "Yes,No,Abstain"}
          ],
          whatItDoes: "Creates a new proposal that people can vote on"
        },
        {
          name: "castVote",
          description: "Vote on a proposal",
          parameters: [
            {name: "proposalId", type: "number", example: "1"},
            {name: "optionIndex", type: "number", example: "0"}
          ],
          whatItDoes: "Records your vote choice for a specific proposal"
        },
        {
          name: "getVotingResults",
          description: "See voting results",
          parameters: [
            {name: "proposalId", type: "number", example: "1"}
          ],
          whatItDoes: "Shows vote counts and winner for a completed proposal"
        }
      ];
    } else if (fileNameLower.includes('marketplace') || fileNameLower.includes('market')) {
      return [
        {
          name: "createListing",
          description: "Create a new marketplace listing",
          parameters: [
            {name: "itemName", type: "string", example: "Vintage Guitar"},
            {name: "price", type: "number", example: "500"},
            {name: "description", type: "string", example: "Rare 1960s guitar"}
          ],
          whatItDoes: "Lists an item for sale in the marketplace"
        },
        {
          name: "buyItem",
          description: "Purchase an item from marketplace",
          parameters: [
            {name: "listingId", type: "string", example: "listing_123"},
            {name: "buyerAddress", type: "string", example: "anoma1buyer..."}
          ],
          whatItDoes: "Buys an item and transfers ownership"
        },
        {
          name: "getListings",
          description: "View all marketplace listings",
          parameters: [],
          whatItDoes: "Shows all items available for purchase"
        }
      ];
    } else if (fileNameLower.includes('defi') || fileNameLower.includes('protocol')) {
      return [
        {
          name: "deposit",
          description: "Deposit tokens into protocol",
          parameters: [
            {name: "amount", type: "number", example: "1000"},
            {name: "tokenType", type: "string", example: "USDC"}
          ],
          whatItDoes: "Deposits tokens to earn interest or rewards"
        },
        {
          name: "withdraw",
          description: "Withdraw tokens from protocol",
          parameters: [
            {name: "amount", type: "number", example: "500"}
          ],
          whatItDoes: "Withdraws your deposited tokens plus any earned rewards"
        },
        {
          name: "getBalance",
          description: "Check your protocol balance",
          parameters: [
            {name: "userAddress", type: "string", example: "anoma1user..."}
          ],
          whatItDoes: "Shows your current deposits and earned rewards"
        }
      ];
    } else {
      return [
        {
          name: "getMessage",
          description: "Get the contract's message",
          parameters: [
            {name: "resourceId", type: "string", example: "resource_001"}
          ],
          whatItDoes: "Returns the stored message from your contract"
        },
        {
          name: "updateMessage",
          description: "Change the contract's message",
          parameters: [
            {name: "newMessage", type: "string", example: "Hello, Anoma!"}
          ],
          whatItDoes: "Updates the message stored in your contract"
        },
        {
          name: "createResource",
          description: "Create a new resource",
          parameters: [
            {name: "resourceType", type: "string", example: "UserData"},
            {name: "initialValue", type: "string", example: "Initial content"}
          ],
          whatItDoes: "Creates a new resource on the blockchain"
        },
        {
          name: "validateResource",
          description: "Check if resource is valid",
          parameters: [
            {name: "resourceId", type: "string", example: "resource_001"}
          ],
          whatItDoes: "Validates the resource follows all rules and constraints"
        }
      ];
    }
  };

  const contractFunctions = getContractFunctions(fileName);

  React.useEffect(() => {
    if (contractFunctions.length > 0 && !selectedFunction) {
      setSelectedFunction(contractFunctions[0].name);
    }
  }, [contractFunctions, selectedFunction]);

  const currentFunction = contractFunctions.find(f => f.name === selectedFunction);

  const handleParameterChange = (paramName: string, value: string) => {
    setParameters(prev => ({
      ...prev,
      [paramName]: value
    }));
  };

  const getMockResult = (functionName: string, params: Record<string, string>) => {
    // Generate realistic mock results based on function
    switch (functionName) {
      case "transferTokens":
        return {
          success: true,
          transactionId: "tx_" + Math.random().toString(36).substr(2, 9),
          fromBalance: "900 GOLD",
          toBalance: "1100 GOLD",
          fee: "5 GOLD"
        };
      case "getTokenBalance":
        return {
          address: params.address,
          balance: Math.floor(Math.random() * 1000) + " GOLD",
          lastUpdate: new Date().toISOString()
        };
      case "createToken":
        return {
          tokenId: params.tokenId,
          amount: params.amount,
          owner: "anoma1your_address...",
          created: new Date().toISOString()
        };
      case "createProposal":
        return {
          proposalId: Math.floor(Math.random() * 100) + 1,
          title: params.title,
          status: "active",
          votingEnds: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        };
      case "castVote":
        return {
          proposalId: params.proposalId,
          voterChoice: params.optionIndex === "0" ? "Yes" : params.optionIndex === "1" ? "No" : "Abstain",
          voteWeight: 1,
          timestamp: new Date().toISOString()
        };
      case "getVotingResults":
        return {
          proposalId: params.proposalId,
          totalVotes: 247,
          results: { "Yes": 156, "No": 73, "Abstain": 18 },
          winner: "Yes",
          status: "completed"
        };
      case "createResource":
        return {
          resourceId: "resource_" + Math.random().toString(36).substr(2, 9),
          resourceType: params.resourceType || "UserData",
          initialValue: params.initialValue || "Default content",
          created: new Date().toISOString(),
          contract: fileName,
          status: "created"
        };
      default:
        return {
          message: params.newMessage || params.initialValue || "Hello, Anoma Network!",
          timestamp: new Date().toISOString(),
          contract: fileName,
          userInput: params
        };
    }
  };

  const handleRunSimulation = async () => {
    if (!currentFunction) return;
    
    setIsSimulating(true);
    
    // Simulate execution delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

    try {
      const result = getMockResult(selectedFunction, parameters);
      
      setSimulationResult({
        function: selectedFunction,
        parameters: Object.values(parameters),
        result,
        executionTime: Math.floor(Math.random() * 500) + 100,
        success: true
      });

      toast({
        title: "Simulation complete",
        description: `${selectedFunction} executed successfully`,
      });
    } catch (error) {
      setSimulationResult({
        function: selectedFunction,
        parameters: Object.values(parameters),
        result: null,
        executionTime: 0,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      });

      toast({
        title: "Simulation failed",
        description: "Check your parameters and try again",
        variant: "destructive",
      });
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="p-3 space-y-4">
      {/* Explanation */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">🧪 Safe Testing Environment</h4>
              <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <p>Test your <strong>{fileName}</strong> contract without any risk:</p>
                <p>• Choose a function → Fill in test values → See what happens</p>
                <p>• No real money or blockchain interaction - just safe testing</p>
                <p>• Perfect for understanding how your contract works</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Function Selection */}
      <div className="space-y-3">
        <Label>1. Choose what to test</Label>
        <Select value={selectedFunction} onValueChange={setSelectedFunction}>
          <SelectTrigger>
            <SelectValue placeholder="Select a function to test" />
          </SelectTrigger>
          <SelectContent>
            {contractFunctions.map((func) => (
              <SelectItem key={func.name} value={func.name}>
                {func.name} - {func.description}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {currentFunction && (
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border">
            <p className="text-sm font-medium mb-1">What this does:</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{currentFunction.whatItDoes}</p>
          </div>
        )}
      </div>

      {/* Parameters */}
      {currentFunction && currentFunction.parameters.length > 0 && (
        <div className="space-y-3">
          <Label>2. Fill in test values</Label>
          {currentFunction.parameters.map((param) => (
            <div key={param.name} className="space-y-1">
              <Label className="text-sm">
                {param.name} ({param.type})
              </Label>
              <Input
                placeholder={`Example: ${param.example}`}
                value={parameters[param.name] || ""}
                onChange={(e) => handleParameterChange(param.name, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Run Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleRunSimulation}
          disabled={isSimulating}
          size="lg"
          className="bg-green-600 hover:bg-green-700"
        >
          <Play className="h-4 w-4 mr-2" />
          {isSimulating ? "Testing..." : "3. Run Test"}
        </Button>
      </div>

      {/* Results */}
      {simulationResult && (
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              {simulationResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <Clock className="h-5 w-5 text-red-500 mr-2" />
              )}
              Test Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {simulationResult.success ? (
              <div className="space-y-3">
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                  <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">
                    ✅ {simulationResult.function} worked perfectly!
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    Execution time: {simulationResult.executionTime}ms
                  </p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">What your contract returned:</Label>
                  <ScrollArea className="h-32 mt-2">
                    <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded whitespace-pre-wrap">
                      {JSON.stringify(simulationResult.result, null, 2)}
                    </pre>
                  </ScrollArea>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded">
                <p className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">
                  ❌ Test failed
                </p>
                <p className="text-xs text-red-600 dark:text-red-400">
                  {simulationResult.error}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!simulationResult && (
        <div className="text-center text-gray-400 text-sm py-8">
          <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
          Choose a function and click "Run Test" to see your contract in action
        </div>
      )}
    </div>
  );
}