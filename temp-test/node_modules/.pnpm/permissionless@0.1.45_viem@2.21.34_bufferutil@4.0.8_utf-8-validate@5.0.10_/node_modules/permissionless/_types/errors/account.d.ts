import { type Address, BaseError } from "viem";
export type SenderAlreadyDeployedErrorType = SenderAlreadyDeployedError & {
    name: "SenderAlreadyDeployedError";
};
export declare class SenderAlreadyDeployedError extends BaseError {
    static message: RegExp;
    name: "SenderAlreadyDeployedError";
    constructor({ cause, sender, docsPath }?: {
        cause?: BaseError;
        sender?: Address;
        docsPath?: string;
    });
}
export type InitCodeRevertedErrorType = InitCodeRevertedError & {
    name: "InitCodeRevertedError";
};
export declare class InitCodeRevertedError extends BaseError {
    static message: RegExp;
    name: "InitCodeRevertedError";
    constructor({ cause, docsPath }?: {
        cause?: BaseError;
        docsPath?: string;
    });
}
export type SenderAddressMismatchErrorType = SenderAddressMismatchError & {
    name: "SenderAddressMismatchError";
};
export declare class SenderAddressMismatchError extends BaseError {
    static message: RegExp;
    name: "SenderAddressMismatchError";
    constructor({ cause, sender, docsPath }: {
        cause?: BaseError;
        sender: Address;
        docsPath?: string;
    });
}
export type InitCodeDidNotDeploySenderErrorType = InitCodeDidNotDeploySenderError & {
    name: "InitCodeDidNotDeploySenderError";
};
export declare class InitCodeDidNotDeploySenderError extends BaseError {
    static message: RegExp;
    name: "InitCodeDidNotDeploySenderError";
    constructor({ cause, sender, docsPath }: {
        cause?: BaseError;
        sender: Address;
        docsPath?: string;
    });
}
export type SenderNotDeployedErrorType = SenderNotDeployedError & {
    name: "SenderNotDeployedError";
};
export declare class SenderNotDeployedError extends BaseError {
    static message: RegExp;
    name: "SenderNotDeployedError";
    constructor({ cause, sender, docsPath }: {
        cause?: BaseError;
        sender: Address;
        docsPath?: string;
    });
}
export type SmartAccountInsufficientFundsErrorType = SmartAccountInsufficientFundsError & {
    name: "SmartAccountInsufficientFundsError";
};
export declare class SmartAccountInsufficientFundsError extends BaseError {
    static message: RegExp;
    name: "SmartAccountInsufficientFundsError";
    constructor({ cause, sender, docsPath }: {
        cause?: BaseError;
        sender: Address;
        docsPath?: string;
    });
}
export type SmartAccountSignatureValidityPeriodErrorType = SmartAccountSignatureValidityPeriodError & {
    name: "SmartAccountSignatureValidityPeriodError";
};
export declare class SmartAccountSignatureValidityPeriodError extends BaseError {
    static message: RegExp;
    name: "SmartAccountSignatureValidityPeriodError";
    constructor({ cause, docsPath }: {
        cause?: BaseError;
        docsPath?: string;
    });
}
export type SmartAccountValidationRevertedErrorType = SmartAccountValidationRevertedError & {
    name: "SmartAccountValidationRevertedError";
};
export declare class SmartAccountValidationRevertedError extends BaseError {
    static message: RegExp;
    name: "SmartAccountValidationRevertedError";
    constructor({ cause, sender, docsPath }: {
        cause?: BaseError;
        sender: Address;
        docsPath?: string;
    });
}
export type InvalidSmartAccountSignatureErrorType = InvalidSmartAccountSignatureError & {
    name: "InvalidSmartAccountSignatureError";
};
export declare class InvalidSmartAccountSignatureError extends BaseError {
    static message: RegExp;
    name: "InvalidSmartAccountSignatureError";
    constructor({ cause, sender, docsPath }: {
        cause?: BaseError;
        sender: Address;
        docsPath?: string;
    });
}
export type InvalidSmartAccountNonceErrorType = InvalidSmartAccountNonceError & {
    name: "InvalidSmartAccountNonceError";
};
export declare class InvalidSmartAccountNonceError extends BaseError {
    static message: RegExp;
    name: "InvalidSmartAccountNonceError";
    constructor({ cause, sender, nonce, docsPath }: {
        cause?: BaseError;
        sender: Address;
        docsPath?: string;
        nonce: bigint;
    });
}
//# sourceMappingURL=account.d.ts.map