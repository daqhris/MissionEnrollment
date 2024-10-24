import { Contract, JsonRpcApiProvider } from 'ethers';

declare module 'ethers' {
  export interface JsonRpcApiProviderInterface {
    lookupAddress(address: string): Promise<string | null>;
  }

  export interface ContractInterface extends Contract {
    connect(provider: JsonRpcApiProvider): Contract;
  }

  export namespace utils {
    export function isAddress(address: string): boolean;
    export function id(text: string): string;
  }
}

interface Window {
  ethereum: any;
}
