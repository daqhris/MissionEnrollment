import { chainId } from "../../actions/bundler/chainId.js";
import { estimateUserOperationGas } from "../../actions/bundler/estimateUserOperationGas.js";
import { getUserOperationByHash } from "../../actions/bundler/getUserOperationByHash.js";
import { getUserOperationReceipt } from "../../actions/bundler/getUserOperationReceipt.js";
import { sendUserOperation } from "../../actions/bundler/sendUserOperation.js";
import { supportedEntryPoints } from "../../actions/bundler/supportedEntryPoints.js";
import { waitForUserOperationReceipt } from "../../actions/bundler/waitForUserOperationReceipt.js";
const bundlerActions = (entryPointAddress) => (client) => ({
    sendUserOperation: async (args) => sendUserOperation(client, {
        ...args,
        entryPoint: entryPointAddress
    }),
    estimateUserOperationGas: (args, stateOverrides) => estimateUserOperationGas(client, { ...args, entryPoint: entryPointAddress }, stateOverrides),
    supportedEntryPoints: () => supportedEntryPoints(client),
    chainId: () => chainId(client),
    getUserOperationByHash: (args) => getUserOperationByHash(client, args),
    getUserOperationReceipt: (args) => getUserOperationReceipt(client, args),
    waitForUserOperationReceipt: (args) => waitForUserOperationReceipt(client, args)
});
export { bundlerActions };
//# sourceMappingURL=bundler.js.map