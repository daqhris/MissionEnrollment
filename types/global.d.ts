import { JsonRpcProvider, Contract } from 'ethers';

declare module 'ethers' {
  export namespace ethers {
    export class JsonRpcProvider extends JsonRpcProvider {}
    export class Contract extends Contract {}
    export namespace utils {
      export function isAddress(address: string): boolean;
      export function id(text: string): string;
    }
  }
}

interface Window {
  ethereum: any;
}
