"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bundlerActions = void 0;
const chainId_1 = require("../../actions/bundler/chainId.js");
const estimateUserOperationGas_1 = require("../../actions/bundler/estimateUserOperationGas.js");
const getUserOperationByHash_1 = require("../../actions/bundler/getUserOperationByHash.js");
const getUserOperationReceipt_1 = require("../../actions/bundler/getUserOperationReceipt.js");
const sendUserOperation_1 = require("../../actions/bundler/sendUserOperation.js");
const supportedEntryPoints_1 = require("../../actions/bundler/supportedEntryPoints.js");
const waitForUserOperationReceipt_1 = require("../../actions/bundler/waitForUserOperationReceipt.js");
const bundlerActions = (entryPointAddress) => (client) => ({
    sendUserOperation: async (args) => (0, sendUserOperation_1.sendUserOperation)(client, {
        ...args,
        entryPoint: entryPointAddress
    }),
    estimateUserOperationGas: (args, stateOverrides) => (0, estimateUserOperationGas_1.estimateUserOperationGas)(client, { ...args, entryPoint: entryPointAddress }, stateOverrides),
    supportedEntryPoints: () => (0, supportedEntryPoints_1.supportedEntryPoints)(client),
    chainId: () => (0, chainId_1.chainId)(client),
    getUserOperationByHash: (args) => (0, getUserOperationByHash_1.getUserOperationByHash)(client, args),
    getUserOperationReceipt: (args) => (0, getUserOperationReceipt_1.getUserOperationReceipt)(client, args),
    waitForUserOperationReceipt: (args) => (0, waitForUserOperationReceipt_1.waitForUserOperationReceipt)(client, args)
});
exports.bundlerActions = bundlerActions;
//# sourceMappingURL=bundler.js.map