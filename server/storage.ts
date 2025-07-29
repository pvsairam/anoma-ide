// Simplified storage for client-side IDE
// No database needed - everything runs in browser

export interface IStorage {
  // Placeholder for future server-side features if needed
}

export class MemStorage implements IStorage {
  constructor() {
    // No server-side storage needed for this client-side IDE
  }
}

export const storage = new MemStorage();
