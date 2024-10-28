"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSmartAccount = void 0;
const viem_1 = require("viem");
const accounts_1 = require("viem/accounts");
const utils_1 = require("../utils/index.js");
const types_1 = require("./types.js");
const MAGIC_BYTES = "0x6492649264926492649264926492649264926492649264926492649264926492";
function toSmartAccount({ address, client, source, entryPoint, getNonce, getInitCode, getFactory, getFactoryData, encodeCallData, getDummySignature, encodeDeployCallData, signUserOperation, signMessage, signTypedData }) {
    const account = (0, accounts_1.toAccount)({
        address: address,
        signMessage: async ({ message }) => {
            const isDeployed = await (0, utils_1.isSmartAccountDeployed)(client, address);
            const signature = await signMessage({ message });
            if (isDeployed)
                return signature;
            const abiEncodedMessage = (0, viem_1.encodeAbiParameters)([
                {
                    type: "address",
                    name: "create2Factory"
                },
                {
                    type: "bytes",
                    name: "factoryCalldata"
                },
                {
                    type: "bytes",
                    name: "originalERC1271Signature"
                }
            ], [
                (await getFactory()) ?? "0x",
                (await getFactoryData()) ?? "0x",
                signature
            ]);
            return (0, viem_1.concat)([abiEncodedMessage, MAGIC_BYTES]);
        },
        signTypedData: async (typedData) => {
            const isDeployed = await (0, utils_1.isSmartAccountDeployed)(client, address);
            const signature = await signTypedData(typedData);
            if (isDeployed)
                return signature;
            const abiEncodedMessage = (0, viem_1.encodeAbiParameters)([
                {
                    type: "address",
                    name: "create2Factory"
                },
                {
                    type: "bytes",
                    name: "factoryCalldata"
                },
                {
                    type: "bytes",
                    name: "originalERC1271Signature"
                }
            ], [
                (await getFactory()) ?? "0x",
                (await getFactoryData()) ?? "0x",
                signature
            ]);
            return (0, viem_1.concat)([abiEncodedMessage, MAGIC_BYTES]);
        },
        async signTransaction(_, __) {
            throw new types_1.SignTransactionNotSupportedBySmartAccount();
        }
    });
    return {
        ...account,
        source,
        client,
        type: "local",
        entryPoint,
        publicKey: address,
        getNonce,
        getInitCode,
        getFactory,
        getFactoryData,
        encodeCallData,
        getDummySignature,
        encodeDeployCallData,
        signUserOperation
    };
}
exports.toSmartAccount = toSmartAccount;
//# sourceMappingURL=toSmartAccount.js.map