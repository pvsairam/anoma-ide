export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

export class AnomaKeyManager {
  private static readonly ALGORITHM = "Ed25519";
  private static readonly KEY_FORMAT = "raw";

  static async generateKeyPair(): Promise<KeyPair> {
    try {
      const keyPair = await window.crypto.subtle.generateKey(
        {
          name: this.ALGORITHM,
        },
        true,
        ["sign", "verify"]
      ) as CryptoKeyPair;

      const publicKeyBuffer = await window.crypto.subtle.exportKey(
        this.KEY_FORMAT,
        keyPair.publicKey
      );

      const privateKeyBuffer = await window.crypto.subtle.exportKey(
        "pkcs8",
        keyPair.privateKey
      );

      const publicKey = `ed25519:${this.bufferToHex(publicKeyBuffer)}`;
      const privateKey = this.bufferToHex(privateKeyBuffer);

      return { publicKey, privateKey };
    } catch (error) {
      throw new Error(`Failed to generate key pair: ${error}`);
    }
  }

  static async signIntent(intent: any, privateKeyHex: string): Promise<string> {
    try {
      const privateKeyBuffer = this.hexToBuffer(privateKeyHex);
      const privateKey = await window.crypto.subtle.importKey(
        "pkcs8",
        privateKeyBuffer,
        {
          name: this.ALGORITHM,
        },
        false,
        ["sign"]
      );

      const intentString = JSON.stringify(intent);
      const messageBuffer = new TextEncoder().encode(intentString);

      const signature = await window.crypto.subtle.sign(
        this.ALGORITHM,
        privateKey,
        messageBuffer
      );

      return this.bufferToHex(signature);
    } catch (error) {
      throw new Error(`Failed to sign intent: ${error}`);
    }
  }

  static async verifySignature(
    intent: any,
    signature: string,
    publicKey: string
  ): Promise<boolean> {
    try {
      const publicKeyHex = publicKey.replace("ed25519:", "");
      const publicKeyBuffer = this.hexToBuffer(publicKeyHex);
      
      const cryptoPublicKey = await window.crypto.subtle.importKey(
        this.KEY_FORMAT,
        publicKeyBuffer,
        {
          name: this.ALGORITHM,
        },
        false,
        ["verify"]
      );

      const intentString = JSON.stringify(intent);
      const messageBuffer = new TextEncoder().encode(intentString);
      const signatureBuffer = this.hexToBuffer(signature);

      return await window.crypto.subtle.verify(
        this.ALGORITHM,
        cryptoPublicKey,
        signatureBuffer,
        messageBuffer
      );
    } catch (error) {
      console.error("Verification failed:", error);
      return false;
    }
  }

  private static bufferToHex(buffer: ArrayBuffer): string {
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");
  }

  private static hexToBuffer(hex: string): ArrayBuffer {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes.buffer;
  }

  static saveKeyPair(keyPair: KeyPair, filename?: string): void {
    const data = {
      publicKey: keyPair.publicKey,
      privateKey: keyPair.privateKey,
      generated: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || "anoma-keypair.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static copyToClipboard(text: string): Promise<void> {
    return navigator.clipboard.writeText(text);
  }
}
