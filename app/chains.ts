import { type Chain } from 'viem'
import { baseSepolia } from 'viem/chains'

// Create a properly typed chain configuration for Base Sepolia
export const baseSepoliaChain: Chain = {
  ...baseSepolia,
  rpcUrls: {
    ...baseSepolia.rpcUrls,
    default: {
      http: [process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || '']
    },
    public: {
      http: [process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || '']
    }
  }
}
