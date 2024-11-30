```typescript
// Environment variables configuration
export const NEXT_PUBLIC_WC_PROJECT_ID = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
export const NEXT_PUBLIC_ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
export const NEXT_PUBLIC_ONCHAINKIT_API_KEY = process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY;

// Validate required environment variables
if (!NEXT_PUBLIC_WC_PROJECT_ID) {
  throw new Error('NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is required');
}

if (!NEXT_PUBLIC_ALCHEMY_API_KEY) {
  throw new Error('NEXT_PUBLIC_ALCHEMY_API_KEY is required');
}

if (!NEXT_PUBLIC_ONCHAINKIT_API_KEY) {
  console.warn('NEXT_PUBLIC_ONCHAINKIT_API_KEY is not set. Some features may be limited.');
}
```
