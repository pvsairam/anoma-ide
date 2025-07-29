import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // Simple routes for client-side IDE (no database needed)
  
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Anoma IDE API is running" });
  });

  const httpServer = createServer(app);
  return httpServer;
}
