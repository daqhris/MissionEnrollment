'use client';

import { ErrorWithDetails, LogDetails } from './types';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogMessage {
  level: LogLevel;
  component: string;
  message: string;
  timestamp: string;
  details?: unknown;
}

class Logger {
  private static instance: Logger;
  private logs: LogMessage[] = [];
  private readonly MAX_LOGS = 100;

  private constructor() {
    // Initialize with a startup message
    this.info('Logger', 'Logger initialized');
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatError(error: unknown): Record<string, unknown> {
    if (error instanceof Error) {
      const errorObj: Record<string, unknown> = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };

      // Handle additional properties for custom error types
      const customError = error as ErrorWithDetails;
      if (customError.code !== undefined) {
        errorObj.code = customError.code;
      }
      if (customError.details !== undefined) {
        errorObj.details = customError.details;
      }

      // Safely add any additional enumerable properties
      const unknownError = error as unknown as Record<string, unknown>;
      Object.getOwnPropertyNames(error).forEach(key => {
        if (!errorObj[key] && unknownError[key] !== undefined) {
          errorObj[key] = unknownError[key];
        }
      });

      return errorObj;
    }
    return { error };
  }

  private log(level: LogLevel, component: string, message: string, details?: unknown) {
    try {
      const formattedDetails = details instanceof Error ? this.formatError(details) : details;

      const logMessage: LogMessage = {
        level,
        component,
        message,
        timestamp: new Date().toISOString(),
        details: formattedDetails,
      };

      // Add to internal logs array with size limit
      this.logs.push(logMessage);
      if (this.logs.length > this.MAX_LOGS) {
        this.logs.shift();
      }

      // Format the console output
      const formattedMessage = `[${logMessage.timestamp}] [${level.toUpperCase()}] [${component}] ${message}`;

      // Log to console with appropriate level
      switch (level) {
        case 'info':
          console.info(formattedMessage, formattedDetails || '');
          break;
        case 'warn':
          console.warn(formattedMessage, formattedDetails || '');
          break;
        case 'error':
          console.error(formattedMessage, formattedDetails || '');
          break;
        case 'debug':
          console.debug(formattedMessage, formattedDetails || '');
          break;
      }
    } catch (err) {
      // Fallback logging if something goes wrong
      console.error('[Logger] Failed to log message:', {
        level,
        component,
        message,
        error: err instanceof Error ? err.message : err
      });
    }
  }

  info(component: string, message: string, details?: unknown) {
    this.log('info', component, message, details);
  }

  warn(component: string, message: string, details?: unknown) {
    this.log('warn', component, message, details);
  }

  error(component: string, message: string, details?: unknown) {
    this.log('error', component, message, details);
  }

  debug(component: string, message: string, details?: unknown) {
    this.log('debug', component, message, details);
  }

  getLogs(): LogMessage[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
    this.info('Logger', 'Logs cleared');
  }
}

// Export a singleton instance
export const logger = Logger.getInstance();
