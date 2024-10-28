import { SerializedEthereumRpcError } from '../error';
export type RPCResponse = {
    result: {
        value: unknown;
    } | {
        error: SerializedEthereumRpcError;
    };
    data?: {
        chains?: {
            [key: number]: string;
        };
        capabilities?: Record<`0x${string}`, Record<string, unknown>>;
    };
};
