/**
 * The exeuctor abi, used to execute transactions on the Biconomy Modular Smart Account
 */
export declare const BiconomyExecuteAbi: readonly [{
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "dest";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "value";
        readonly type: "uint256";
    }, {
        readonly internalType: "bytes";
        readonly name: "func";
        readonly type: "bytes";
    }];
    readonly name: "execute_ncC";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address[]";
        readonly name: "dest";
        readonly type: "address[]";
    }, {
        readonly internalType: "uint256[]";
        readonly name: "value";
        readonly type: "uint256[]";
    }, {
        readonly internalType: "bytes[]";
        readonly name: "func";
        readonly type: "bytes[]";
    }];
    readonly name: "executeBatch_y6U";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}];
/**
 * The init abi, used to initialise Biconomy Modular Smart Account / setup default ECDSA module
 */
export declare const BiconomyInitAbi: {
    inputs: {
        internalType: string;
        name: string;
        type: string;
    }[];
    name: string;
    outputs: {
        internalType: string;
        name: string;
        type: string;
    }[];
    stateMutability: string;
    type: string;
}[];
//# sourceMappingURL=BiconomySmartAccountAbi.d.ts.map