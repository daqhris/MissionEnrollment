# OnchainKit Migration Plan for Mission Enrollment

## Overview
This document outlines the step-by-step plan for integrating OnchainKit and migrating to Base blockchain, with a focus on leveraging the Coinbase Developer Platform SDK.

## Phase 1: Environment Setup
1. Create new development branch from stable-build
```bash
git checkout -b feature/onchainkit-integration
```

2. Update dependencies in package.json
```json
{
  "dependencies": {
    "@coinbase/onchainkit": "latest",
    // Remove conflicting dependencies
    "wagmi": "remove",
    "viem": "remove",
    "@rainbow-me/rainbowkit": "remove"
  }
}
```

3. Configure environment variables
```env
NEXT_PUBLIC_ONCHAINKIT_API_KEY=${NEXT_PUBLIC_CDP_API_KEY}
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=${NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID}
```

## Phase 2: Provider Migration
1. Create new provider configuration (app/providers.tsx)
```typescript
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function Providers({ children }) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <OnchainKitProvider>
        {children}
      </OnchainKitProvider>
    </QueryClientProvider>
  );
}
```

2. Update chain configuration to prioritize Base
```typescript
// config/chains.ts
import { base, baseSepolia } from '@coinbase/onchainkit/chains';

export const supportedChains = [
  base,        // Base Mainnet (8453)
  baseSepolia  // Base Sepolia (84532)
];
```

## Phase 3: Contract Integration Updates
1. Update AttestationService contract deployment
- Migrate to Base Sepolia for testing
- Update to Base Mainnet for production
- Implement OnchainKit contract deployment patterns

2. Modify contract interaction hooks
```typescript
// hooks/useAttestationService.ts
import { useContract } from '@coinbase/onchainkit';

export function useAttestationService() {
  return useContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    chain: base,
    // Additional OnchainKit configuration
  });
}
```

## Phase 4: Component Updates
1. Update core components:
- AttestationCard.tsx
- OnchainAttestation.tsx
- WalletConnect.tsx
- IdentityVerification.tsx

2. Implement Base-specific features:
- Base account abstraction
- Optimized gas handling
- Enhanced transaction monitoring

## Phase 5: Testing and Verification
1. Update test environment
```typescript
// test/setup.ts
import { createOnchainKitTestConfig } from '@coinbase/onchainkit/test';

const config = createOnchainKitTestConfig({
  chain: baseSepolia,
  // Test configuration
});
```

2. Test cases to verify:
- Base chain compatibility
- Contract deployments
- Transaction handling
- Provider integration
- Component rendering

## Phase 6: Documentation and Deployment
1. Update documentation:
- README.md updates
- API documentation
- Environment setup guide
- Deployment instructions

2. Deployment checklist:
- Verify Base chain configuration
- Check environment variables
- Test contract deployments
- Monitor transaction costs

## Implementation Order
1. Environment setup (1 day)
2. Provider migration (2 days)
3. Contract updates (2-3 days)
4. Component updates (2-3 days)
5. Testing (2 days)
6. Documentation and deployment (1 day)

## Risk Mitigation
1. Provider Migration
- Create fallback mechanisms
- Implement gradual migration
- Monitor performance impacts

2. Chain Compatibility
- Test thoroughly on Base Sepolia
- Monitor gas costs and transaction times
- Implement proper error handling

3. Data Migration
- Backup existing data
- Create data validation tools
- Implement rollback procedures

## Success Criteria
1. All components functional on Base blockchain
2. OnchainKit integration complete and tested
3. Improved transaction efficiency
4. Enhanced user experience
5. Comprehensive documentation
6. Successful deployment to production

## Notes
- Prioritize Base Mainnet compatibility
- Leverage Coinbase Developer Platform features
- Focus on developer experience
- Maintain backward compatibility where possible
