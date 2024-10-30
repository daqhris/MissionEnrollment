// This file has been deprecated in favor of the consolidated implementation in app/providers.tsx
// The provider configuration and implementation has been moved to the main providers file
// to prevent initialization conflicts and ensure consistent provider setup.
// See app/providers.tsx for the current implementation.

import { ReactNode } from 'react';
import { logger } from '../utils/logger';

interface AppProviderProps {
  children: ReactNode;
}

logger.warn('AppProvider', 'This file is deprecated. Using app/providers.tsx instead.');

export function AppProvider({ children }: AppProviderProps) {
  throw new Error('AppProvider is deprecated. Use the implementation in app/providers.tsx instead.');
}
