// Simplified schema for client-side IDE
// No database tables needed - everything runs in browser
import { z } from "zod";

// Basic types for type safety, but no actual database usage
export type User = {
  id: string;
  username: string;
};

export type InsertUser = Omit<User, 'id'>;
