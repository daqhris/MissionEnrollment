import { getAlchemyHttpUrl } from "./networks";
import type { ChainWithAttributes } from "./networks";
import { createPublicClient, http, parseAbi } from "viem";
import type { Address } from "viem";
import { mainnet } from "viem/chains";
import { keccak256 as keccakHash } from "js-sha3";

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(getAlchemyHttpUrl(mainnet.id)),
});

const ABI = parseAbi([
  "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
  "function token0() external view returns (address)",
  "function token1() external view returns (address)",
]);

const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

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

const computePairAddress = (tokenA: string, tokenB: string): Address => {
  const [token0, token1] = tokenA.toLowerCase() < tokenB.toLowerCase() ? [tokenA, tokenB] : [tokenB, tokenA];
  
  const FACTORY_ADDRESS = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
  const INIT_CODE_HASH = "0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f";
  
  const packedTokens = token0.slice(2) + token1.slice(2);
  const salt = keccak256(packedTokens);
  
  const create2Input = "ff" + FACTORY_ADDRESS.slice(2) + salt.slice(2) + INIT_CODE_HASH.slice(2);
  const pairAddress = keccak256(create2Input);
  
  return `0x${pairAddress.slice(-40)}` as Address;
};

const keccak256 = (input: string): string => {
  return keccakHash(input);
};
