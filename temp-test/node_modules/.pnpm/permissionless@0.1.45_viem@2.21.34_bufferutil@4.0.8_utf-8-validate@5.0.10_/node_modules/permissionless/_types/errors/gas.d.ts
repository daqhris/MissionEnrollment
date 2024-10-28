import { BaseError } from "viem";
export type VerificationGasLimitTooLowErrorType = VerificationGasLimitTooLowError & {
    name: "VerificationGasLimitTooLowError";
};
export declare class VerificationGasLimitTooLowError extends BaseError {
    static message: RegExp;
    name: string;
    constructor({ cause, verificationGasLimit, docsPath }: {
        cause?: BaseError;
        verificationGasLimit?: bigint;
        docsPath?: string;
    });
}
export type ActualGasCostTooHighErrorType = ActualGasCostTooHighError & {
    name: "ActualGasCostTooHighError";
};
export declare class ActualGasCostTooHighError extends BaseError {
    static message: RegExp;
    name: string;
    constructor({ cause, docsPath }: {
        cause?: BaseError;
        docsPath?: string;
    });
}
export type GasValuesOverflowErrorType = GasValuesOverflowError & {
    name: "GasValuesOverflowError";
};
export declare class GasValuesOverflowError extends BaseError {
    static message: RegExp;
    name: string;
    constructor({ cause, docsPath }: {
        cause?: BaseError;
        docsPath?: string;
    });
}
export type BundlerOutOfGasErrorType = BundlerOutOfGasError & {
    name: "BundlerOutOfGasError";
};
export declare class BundlerOutOfGasError extends BaseError {
    static message: RegExp;
    name: string;
    constructor({ cause, docsPath }: {
        cause?: BaseError;
        docsPath?: string;
    });
}
//# sourceMappingURL=gas.d.ts.map