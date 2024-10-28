import { BaseError } from "viem";
export type InvalidBeneficiaryAddressErrorType = InvalidBeneficiaryAddressError & {
    name: "InvalidBeneficiaryAddressError";
};
export declare class InvalidBeneficiaryAddressError extends BaseError {
    static message: RegExp;
    name: string;
    constructor({ cause, docsPath }: {
        cause?: BaseError;
        docsPath?: string;
    });
}
export type InvalidAggregatorErrorType = InvalidAggregatorError & {
    name: "InvalidAggregatorError";
};
export declare class InvalidAggregatorError extends BaseError {
    static message: RegExp;
    name: string;
    constructor({ cause, docsPath }: {
        cause?: BaseError;
        docsPath?: string;
    });
}
//# sourceMappingURL=bundler.d.ts.map