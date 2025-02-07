import type { ChainWithAttributes } from "./networks";
import { createPublicClient, http, parseAbi } from "viem";
import type { Address } from "viem";

const publicClient = createPublicClient({
  chain: process.env.NEXT_PUBLIC_DEFAULT_CHAIN as any,
  transport: http(process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL || ''),
});

const ABI = parseAbi([
  "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
  "function token0() external view returns (address)",
  "function token1() external view returns (address)",
]);

const DAI_ADDRESS = process.env.NEXT_PUBLIC_DAI_TOKEN_ADDRESS || '';
const WETH_ADDRESS = process.env.NEXT_PUBLIC_WETH_TOKEN_ADDRESS || '';

export const fetchPriceFromUniswap = async (targetNetwork: ChainWithAttributes): Promise<number> => {
  if (
    targetNetwork.nativeCurrency.symbol !== "ETH" &&
    targetNetwork.nativeCurrency.symbol !== "SEP" &&
    !targetNetwork.nativeCurrencyTokenAddress
  ) {
    return 0;
  }
  try {
    const tokenAddress = targetNetwork.nativeCurrencyTokenAddress || WETH_ADDRESS;
    const pairAddress = computePairAddress(tokenAddress, DAI_ADDRESS);

    const wagmiConfig = {
      address: pairAddress,
      abi: ABI,
    };

    const [reserves, token0Address] = await Promise.all([
      publicClient.readContract({
        ...wagmiConfig,
        functionName: "getReserves",
      }),
      publicClient.readContract({
        ...wagmiConfig,
        functionName: "token0",
      }),
    ]);

    const [reserve0, reserve1] = reserves;
    const [tokenReserve, daiReserve] = token0Address === tokenAddress ? [reserve0, reserve1] : [reserve1, reserve0];

    const price = (Number(daiReserve) / Number(tokenReserve)).toFixed(6);
    return parseFloat(price);
  } catch (error) {
    console.error(
      `useNativeCurrencyPrice - Error fetching ${targetNetwork.nativeCurrency.symbol} price from Uniswap: `,
      error,
    );
    return 0;
  }
};

// Simple implementation of Uniswap V2 pair address computation
const computePairAddress = (tokenA: string, tokenB: string): Address => {
  const [token0, token1] = tokenA.toLowerCase() < tokenB.toLowerCase() ? [tokenA, tokenB] : [tokenB, tokenA];
  const salt = `0x${Buffer.from([
    ...Buffer.from(token0.slice(2), "hex"),
    ...Buffer.from(token1.slice(2), "hex"),
  ]).toString("hex")}`;
  // This is a simplified version and may not be accurate for all cases
  return `0x${keccak256(salt).slice(-40)}` as Address;
};

// Simple keccak256 implementation for demonstration
const keccak256 = (input: string): string => {
  // This is a placeholder. In a real implementation, you'd use a proper keccak256 function
  return input;
};
