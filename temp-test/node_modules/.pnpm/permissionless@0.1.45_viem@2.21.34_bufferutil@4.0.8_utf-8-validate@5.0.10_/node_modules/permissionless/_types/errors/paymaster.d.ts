import { BaseError, type Hex } from "viem";
export type PaymasterNotDeployedErrorType = PaymasterNotDeployedError & {
    name: "PaymasterNotDeployedError";
};
export declare class PaymasterNotDeployedError extends BaseError {
    static message: RegExp;
    name: string;
    constructor({ cause, paymasterAndData, docsPath }?: {
        cause?: BaseError;
        paymasterAndData?: Hex;
        docsPath?: string;
    });
}
export type PaymasterDepositTooLowErrorType = PaymasterDepositTooLowError & {
    name: "PaymasterDepositTooLowError";
};
export declare class PaymasterDepositTooLowError extends BaseError {
    static message: RegExp;
    name: string;
    constructor({ cause, paymasterAndData, docsPath }?: {
        cause?: BaseError;
        paymasterAndData?: Hex;
        docsPath?: string;
    });
}
export type PaymasterValidityPeriodErrorType = PaymasterValidityPeriodError & {
    name: "PaymasterValidityPeriodError";
};
export declare class PaymasterValidityPeriodError extends BaseError {
    static message: RegExp;
    name: string;
    constructor({ cause, paymasterAndData, docsPath }: {
        cause?: BaseError;
        paymasterAndData?: Hex;
        docsPath?: string;
    });
}
export type PaymasterValidationRevertedErrorType = PaymasterValidationRevertedError & {
    name: "PaymasterValidationRevertedError";
};
export declare class PaymasterValidationRevertedError extends BaseError {
    static message: RegExp;
    name: string;
    constructor({ cause, paymasterAndData, docsPath }: {
        cause?: BaseError;
        paymasterAndData?: Hex;
        docsPath?: string;
    });
}
export type PaymasterDataRejectedErrorType = PaymasterDataRejectedError & {
    name: "PaymasterDataRejectedError";
};
export declare class PaymasterDataRejectedError extends BaseError {
    static message: RegExp;
    name: string;
    constructor({ cause, paymasterAndData, docsPath }: {
        cause?: BaseError;
        paymasterAndData?: Hex;
        docsPath?: string;
    });
}
export type PaymasterPostOpRevertedErrorType = PaymasterPostOpRevertedError & {
    name: "PaymasterPostOpRevertedError";
};
export declare class PaymasterPostOpRevertedError extends BaseError {
    static message: RegExp;
    name: string;
    constructor({ cause, paymasterAndData, docsPath }: {
        cause?: BaseError;
        paymasterAndData?: Hex;
        docsPath?: string;
    });
}
export type InvalidPaymasterAndDataErrorType = InvalidPaymasterAndDataError & {
    name: "InvalidPaymasterAndDataError";
};
export declare class InvalidPaymasterAndDataError extends BaseError {
    static message: RegExp;
    name: string;
    constructor({ cause, docsPath }: {
        cause?: BaseError;
        docsPath?: string;
    });
}
//# sourceMappingURL=paymaster.d.ts.map