import { type Chain } from 'viem'
import { baseSepolia } from 'viem/chains'

// Create a properly typed chain configuration for Base Sepolia
export const baseSepoliaChain: Chain = {
  ...baseSepolia,
  rpcUrls: {
    ...baseSepolia.rpcUrls,
    default: {
      http: [`https://base-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`]
    },
    public: {
      http: ['https://sepolia.base.org']
    }
  }
}
