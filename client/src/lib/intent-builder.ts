export interface Intent {
  type: string;
  resource?: string;
  parameters: Record<string, any>;
  nonce: string;
  timestamp: number;
}

export interface SignedIntent {
  intent: Intent;
  signature: string;
  publicKey: string;
}

export class IntentBuilder {
  static createIntent(
    type: string,
    resource: string,
    parameters: Record<string, any>
  ): Intent {
    return {
      type,
      resource,
      parameters,
      nonce: this.generateNonce(),
      timestamp: Date.now(),
    };
  }

  static createHelloWorldIntent(message: string, owner: string): Intent {
    return this.createIntent("CreateResource", "HelloWorldResource", {
      message,
      owner,
    });
  }

  static createUpdateIntent(resourceId: string, message: string): Intent {
    return this.createIntent("UpdateResource", "HelloWorldResource", {
      resourceId,
      message,
    });
  }

  static createTransferIntent(resourceId: string, newOwner: string): Intent {
    return this.createIntent("TransferResource", "HelloWorldResource", {
      resourceId,
      newOwner,
    });
  }

  private static generateNonce(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  static validateIntent(intent: Intent): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!intent.type) {
      errors.push("Intent type is required");
    }

    if (!intent.parameters) {
      errors.push("Intent parameters are required");
    }

    if (intent.type === "CreateResource") {
      if (!intent.parameters.message) {
        errors.push("Message parameter is required for CreateResource");
      }
      if (!intent.parameters.owner) {
        errors.push("Owner parameter is required for CreateResource");
      }
    }

    if (intent.type === "UpdateResource" || intent.type === "TransferResource") {
      if (!intent.parameters.resourceId) {
        errors.push("ResourceId parameter is required for this intent type");
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  static exportIntent(intent: Intent | SignedIntent, filename?: string): void {
    const data = 'signature' in intent ? intent : { intent };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || "intent.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static getIntentTypes(): Array<{ value: string; label: string; description: string }> {
    return [
      {
        value: "CreateResource",
        label: "Create Resource",
        description: "Create a new resource on the Anoma network",
      },
      {
        value: "UpdateResource",
        label: "Update Resource",
        description: "Update an existing resource's properties",
      },
      {
        value: "TransferResource",
        label: "Transfer Resource",
        description: "Transfer ownership of a resource to another party",
      },
      {
        value: "ConsumeResource",
        label: "Consume Resource",
        description: "Consume a resource to release its value",
      },
    ];
  }
}
