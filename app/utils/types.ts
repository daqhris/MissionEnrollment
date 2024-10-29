// Define common types for error handling
export interface ErrorWithDetails extends Error {
  code?: string | number;
  details?: unknown;
  [key: string]: unknown;
}

export interface LogDetails {
  error?: string;
  stack?: string;
  componentStack?: string;
  timestamp: string;
  [key: string]: unknown;
}
