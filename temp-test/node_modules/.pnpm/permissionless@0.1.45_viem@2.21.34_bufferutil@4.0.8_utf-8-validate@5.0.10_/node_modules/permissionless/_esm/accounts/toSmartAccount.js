import { concat, encodeAbiParameters } from "viem";
import { toAccount } from "viem/accounts";
import { isSmartAccountDeployed } from "../utils/index.js";
import { SignTransactionNotSupportedBySmartAccount } from "./types.js";
const MAGIC_BYTES = "0x6492649264926492649264926492649264926492649264926492649264926492";
export function toSmartAccount({ address, client, source, entryPoint, getNonce, getInitCode, getFactory, getFactoryData, encodeCallData, getDummySignature, encodeDeployCallData, signUserOperation, signMessage, signTypedData }) {
    const account = toAccount({
        address: address,
        signMessage: async ({ message }) => {
            const isDeployed = await isSmartAccountDeployed(client, address);
            const signature = await signMessage({ message });
            if (isDeployed)
                return signature;
            const abiEncodedMessage = encodeAbiParameters([
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
                (await getFactory()) ?? "0x", // "0x should never happen if it's deployed"
                (await getFactoryData()) ?? "0x", // "0x should never happen if it's deployed"
                signature
            ]);
            return concat([abiEncodedMessage, MAGIC_BYTES]);
        },
        signTypedData: async (typedData) => {
            const isDeployed = await isSmartAccountDeployed(client, address);
            const signature = await signTypedData(typedData);
            if (isDeployed)
                return signature;
            const abiEncodedMessage = encodeAbiParameters([
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
                (await getFactory()) ?? "0x", // "0x should never happen if it's deployed"
                (await getFactoryData()) ?? "0x", // "0x should never happen if it's deployed"
                signature
            ]);
            return concat([abiEncodedMessage, MAGIC_BYTES]);
        },
        async signTransaction(_, __) {
            throw new SignTransactionNotSupportedBySmartAccount();
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
//# sourceMappingURL=toSmartAccount.js.map