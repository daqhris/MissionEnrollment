import { BaseError } from "viem";
import { parseAccount } from "./index.js";
import { getUserOperationHash } from "./getUserOperationHash.js";
export class AccountOrClientNotFoundError extends BaseError {
    constructor({ docsPath } = {}) {
        super([
            "Could not find an Account to execute with this Action.",
            "Please provide an Account with the `account` argument on the Action, or by supplying an `account` to the WalletClient."
        ].join("\n"), {
            docsPath,
            docsSlug: "account"
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "AccountOrClientNotFoundError"
        });
    }
}
/**
 *
 * Returns signature for user operation. It signs over user operation hash.
 * If you have a custom way of signing user operation hash, you can use this function to sign it with ECDSA.
 *
 * - Docs: https://docs.pimlico.io/permissionless/reference/utils/signUserOperationHashWithECDSA
 *
 * @param signer: owner as {@link Client<Transport, TChain, TAccount>}
 * @param params: account & (userOperation, entryPoint, chainId)  | hash to sign
 * @returns signature as {@link Hash}
 *
 * @example
 * import { signUserOperationHashWithECDSA } from "permissionless/utils"
 *
 * const userOperationSignature = signUserOperationHashWithECDSA(owner, {
 *      userOperation,
 *      entryPoint,
 *      chainId
 * })
 *
 * // Returns "0x7d9ae17d5e617e4bf3221dfcb69d64d824959e5ae2ef7078c6ddc3a4fe26c8301ab39277c61160dca68ca90071eb449d9fb2fbbc78b3614d9d7282c860270e291c"
 *
 */
export const signUserOperationHashWithECDSA = async ({ client, account: account_ = client?.account, hash, userOperation, chainId, entryPoint: entryPointAddress }) => {
    if (!account_)
        throw new AccountOrClientNotFoundError({
            docsPath: "/permissionless/reference/utils/signUserOperationHashWithECDSA"
        });
    let userOperationHash;
    if (hash) {
        userOperationHash = hash;
    }
    else {
        userOperationHash = getUserOperationHash({
            userOperation,
            chainId,
            entryPoint: entryPointAddress
        });
    }
    const account = parseAccount(account_);
    if (account.type === "local")
        return account.signMessage({
            message: {
                raw: userOperationHash
            }
        });
    if (!client)
        throw new AccountOrClientNotFoundError({
            docsPath: "/permissionless/reference/utils/signUserOperationHashWithECDSA"
        });
    return client.request({
        method: "personal_sign",
        params: [userOperationHash, account.address]
    });
};
//# sourceMappingURL=signUserOperationHashWithECDSA.js.map