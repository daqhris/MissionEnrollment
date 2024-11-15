import { TransactionReceipt, TransactionRequest } from 'ethers';
import { TypedDataDomain } from "viem";

export interface OnchainAttestationProps {
  onAttestationComplete: (attestationUID: string) => void;
  poaps: Array<{ token_id: string; event: { name: string; start_date: string } }>;
}

export interface CustomSigner {
  getAddress: () => Promise<string>;
  signMessage: (message: string | Uint8Array) => Promise<string>;
  sendTransaction: (transaction: TransactionRequest) => Promise<{ hash: `0x${string}` }>;
  _signTypedData: (domain: TypedDataDomain, types: Record<string, Array<TypedDataDomain>>, value: Record<string, unknown>) => Promise<string>;
}

export const EAS_CONTRACT_ADDRESS: Record<string, `0x${string}`> = {
  base: "0xC2679fBD37d54388Ce493F1DB75320D236e1815e" as `0x${string}`,
  optimism: "0xC2679fBD37d54388Ce493F1DB75320D236e1815e" as `0x${string}`
};
