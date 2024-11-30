// Environment variables configuration
const NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
const NEXT_PUBLIC_ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
const NEXT_PUBLIC_ONCHAINKIT_API_KEY = process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY;
const NEXT_PUBLIC_BASE_MAINNET_RPC_URL = process.env.NEXT_PUBLIC_BASE_MAINNET_RPC_URL;
const NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL = process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL;

// Validate required environment variables
if (typeof window !== 'undefined') {
  if (!NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID) {
    throw new Error('NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is required');
  }

  if (!NEXT_PUBLIC_ALCHEMY_API_KEY) {
    throw new Error('NEXT_PUBLIC_ALCHEMY_API_KEY is required');
  }

  if (!NEXT_PUBLIC_ONCHAINKIT_API_KEY) {
    console.warn('NEXT_PUBLIC_ONCHAINKIT_API_KEY is not set. Some features may be limited.');
  }
}

// Export environment variables as a single object
export const env = {
  NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  NEXT_PUBLIC_ALCHEMY_API_KEY,
  NEXT_PUBLIC_ONCHAINKIT_API_KEY,
  NEXT_PUBLIC_BASE_MAINNET_RPC_URL,
  NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL,
} as const;

// Also export individual variables for backward compatibility
export {
  NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  NEXT_PUBLIC_ALCHEMY_API_KEY,
  NEXT_PUBLIC_ONCHAINKIT_API_KEY,
};
