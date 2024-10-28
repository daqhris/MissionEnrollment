import { BaseError } from "viem";
import type { EstimateUserOperationGasParameters } from "../actions/bundler/estimateUserOperationGas";
import type { EntryPoint } from "../types/entrypoint";
export type EstimateUserOperationGasErrorType<entryPoint extends EntryPoint> = EstimateUserOperationGasError<entryPoint> & {
    name: "EstimateUserOperationGasError";
};
export declare class EstimateUserOperationGasError<entryPoint extends EntryPoint> extends BaseError {
    cause: BaseError;
    name: string;
    constructor(cause: BaseError, { userOperation, entryPoint, docsPath }: EstimateUserOperationGasParameters<entryPoint> & {
        docsPath?: string;
    });
}
//# sourceMappingURL=estimateUserOperationGas.d.ts.map