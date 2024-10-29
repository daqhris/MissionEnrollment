import { Chain } from 'viem';
import { base } from 'viem/chains';
import { serializeTransaction } from 'viem/op-stack';

type OnchainKitChain = Chain & {
  readonly blockExplorers: {
    readonly default: {
      readonly name: "Basescan";
      readonly url: `https://${string}.basescan.org` | "https://basescan.org";
      readonly apiUrl: `https://api${string}.basescan.org/api` | "https://api.basescan.org/api";
    };
  };
  readonly formatters: {
    readonly transactionRequest: {
      readonly type: 'transactionRequest';
      readonly format: (tx: any) => { type: 'eip7702' } & Record<string, any>;
    };
  };
};

export const baseMainnet: OnchainKitChain = {
  id: 8453,
  name: 'Base',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_BASE_MAINNET_RPC_URL || 'https://mainnet.base.org'],
    },
    public: {
      http: ['https://mainnet.base.org'],
    },
  },
  blockExplorers: {
    default: {
      name: "Basescan",
      url: "https://basescan.org",
      apiUrl: "https://api.basescan.org/api",
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 5022,
    },
    l2OutputOracle: {
      1: {
        address: '0x56315b90c40730925ec5485cf004d835058518A0',
      },
    },
    portal: {
      1: {
        address: '0x49048044D57e1C92A77f79988d21Fa8fAF74E97e',
        blockCreated: 17482143,
      },
    },
    l1StandardBridge: {
      1: {
        address: '0x3154Cf16ccdb4C6d922629664174b904d80F2C35',
        blockCreated: 17482143,
      },
    },
    l2StandardBridge: {
      address: '0x4200000000000000000000000000000000000010',
      blockCreated: 0,
    },
    l2ToL1MessagePasser: {
      address: '0x4200000000000000000000000000000000000016',
      blockCreated: 0,
    },
    l2CrossDomainMessenger: {
      address: '0x4200000000000000000000000000000000000007',
      blockCreated: 0,
    },
    gasPriceOracle: {
      address: '0x420000000000000000000000000000000000000F',
      blockCreated: 0,
    },
    l1Block: {
      address: '0x4200000000000000000000000000000000000015',
      blockCreated: 0,
    },
    l2Erc721Bridge: {
      address: '0x4200000000000000000000000000000000000014',
      blockCreated: 0,
    },
  },
  formatters: {
    transactionRequest: {
      type: 'transactionRequest',
      format: (tx: any) => ({
        ...tx,
        type: 'eip7702',
      }),
    },
  },
  serializers: {
    transaction: serializeTransaction,
  },
} as const;

export const baseSepolia: OnchainKitChain = {
  ...base,
  id: 84532,
  name: 'Base Sepolia',
  nativeCurrency: {
    name: 'Sepolia Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  blockExplorers: {
    default: {
      name: "Basescan",
      url: "https://sepolia.basescan.org",
      apiUrl: "https://api-sepolia.basescan.org/api",
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 1059647
    },
    l1Block: {
      address: '0x4200000000000000000000000000000000000015'
    },
    l2Erc721Bridge: {
      address: '0x4200000000000000000000000000000000000014'
    },
    l2StandardBridge: {
      address: '0x4200000000000000000000000000000000000010'
    },
    l2ToL1MessagePasser: {
      address: '0x4200000000000000000000000000000000000016'
    },
    gasPriceOracle: {
      address: '0x420000000000000000000000000000000000000F'
    },
    l2OutputOracle: {
      address: '0x84457ca9D0163FbC4bbfe4Dfbb20ba46e48DF254'
    },
    portal: {
      address: '0x49048044D57e1C92A77f79988d21Fa8fAF74E97e'
    },
    l1StandardBridge: {
      address: '0x3154Cf16ccdb4C6d922629664174b904d80F2C35'
    }
  },
  rpcUrls: {
    ...base.rpcUrls,
    default: {
      http: [process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org']
    }
  },
  formatters: {
    transactionRequest: {
      type: 'transactionRequest',
      format: (tx: any) => ({
        ...tx,
        type: 'eip7702',
      }),
    },
  },
  serializers: {
    transaction: serializeTransaction
  },
} as const;

export const supportedChains = [baseMainnet, baseSepolia];
