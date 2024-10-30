// This file has been deprecated in favor of the consolidated implementation in app/providers.tsx
// The OnchainKitProvider and related provider configuration has been moved to the main providers file
// to prevent initialization conflicts and ensure consistent provider setup.
// See app/providers.tsx for the current implementation.

import { logger } from '../utils/logger';

logger.warn('OnchainProviders', 'This file is deprecated. Using app/providers.tsx instead.');

export default function OnchainProviders() {
  throw new Error('OnchainProviders is deprecated. Use the implementation in app/providers.tsx instead.');
}
