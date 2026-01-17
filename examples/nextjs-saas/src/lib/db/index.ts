import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// Use a dummy connection string during build if DATABASE_URL is not set
const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/dummy'

// For query purposes
const queryClient = postgres(connectionString, {
  // Disable connection during build
  max: process.env.DATABASE_URL ? undefined : 0,
})
export const db = drizzle(queryClient, { schema })

// Export schema for convenience
export * from './schema'
