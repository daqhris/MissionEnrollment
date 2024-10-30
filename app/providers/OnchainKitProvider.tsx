// This file has been deprecated in favor of the consolidated implementation in app/providers.tsx
// The OnchainKitProvider configuration and implementation has been moved to the main providers file
// to prevent initialization conflicts and ensure consistent provider setup.
// See app/providers.tsx for the current implementation.

import { ReactNode } from 'react';
import { logger } from '../utils/logger';

interface OnchainKitProviderProps {
  children: ReactNode;
}

logger.warn('OnchainKitProvider', 'This file is deprecated. Using app/providers.tsx instead.');

export function OnchainKitProvider({ children }: OnchainKitProviderProps) {
  throw new Error('OnchainKitProvider is deprecated. Use the implementation in app/providers.tsx instead.');
}
