declare module 'ethers' {
  export namespace ethers {
    export namespace providers {
      export class Web3Provider {
        constructor(provider: any);
        getNetwork(): Promise<{ name: string }>;
      }
      export class JsonRpcProvider {
        constructor(url: string);
        lookupAddress(address: string): Promise<string | null>;
      }
    }
    export namespace utils {
      export function isAddress(address: string): boolean;
      export function id(text: string): string;
    }
  }
}

interface Window {
  ethereum: any;
}
