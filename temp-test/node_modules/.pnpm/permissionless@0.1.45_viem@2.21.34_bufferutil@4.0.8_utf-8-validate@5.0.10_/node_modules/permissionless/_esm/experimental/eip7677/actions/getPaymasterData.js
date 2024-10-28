import { ChainNotFoundError, toHex } from "viem";
import { deepHexlify, getEntryPointVersion } from "../../../utils/index.js";
export async function getPaymasterData(client, { userOperation, entryPoint, context, chain }) {
    const chainId = chain?.id ?? client.chain?.id;
    if (!chainId) {
        throw new ChainNotFoundError();
    }
    const params = context
        ? [
            deepHexlify(userOperation),
            entryPoint,
            toHex(chainId),
            context
        ]
        : [
            deepHexlify(userOperation),
            entryPoint,
            toHex(chainId)
        ];
    const response = await client.request({
        method: "pm_getPaymasterData",
        params
    });
    const entryPointVersion = getEntryPointVersion(entryPoint);
    if (entryPointVersion === "v0.6") {
        const responseV06 = response;
        return {
            paymasterAndData: responseV06.paymasterAndData
        };
    }
    const responseV07 = response;
    return {
        paymaster: responseV07.paymaster,
        paymasterData: responseV07.paymasterData
    };
}
//# sourceMappingURL=getPaymasterData.js.map