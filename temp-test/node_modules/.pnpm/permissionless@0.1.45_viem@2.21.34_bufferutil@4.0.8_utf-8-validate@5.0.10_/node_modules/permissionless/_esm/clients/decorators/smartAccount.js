import { sendTransactions } from "../../actions/smartAccount.js";
import { deployContract } from "../../actions/smartAccount/deployContract.js";
import { prepareUserOperationRequest } from "../../actions/smartAccount/prepareUserOperationRequest.js";
import { sendTransaction } from "../../actions/smartAccount/sendTransaction.js";
import { sendUserOperation } from "../../actions/smartAccount/sendUserOperation.js";
import { signMessage } from "../../actions/smartAccount/signMessage.js";
import { signTypedData } from "../../actions/smartAccount/signTypedData.js";
import { writeContract } from "../../actions/smartAccount/writeContract.js";
export function smartAccountActions({ middleware }) {
    return (client) => ({
        prepareUserOperationRequest: (args, stateOverrides) => prepareUserOperationRequest(client, {
            ...args,
            middleware
        }, stateOverrides),
        deployContract: (args) => deployContract(client, {
            ...args,
            middleware
        }),
        sendTransaction: (args) => sendTransaction(client, {
            ...args,
            middleware
        }),
        sendTransactions: (args) => sendTransactions(client, {
            ...args,
            middleware
        }),
        sendUserOperation: (args) => sendUserOperation(client, {
            ...args,
            middleware
        }),
        signMessage: (args) => signMessage(client, args),
        signTypedData: (args) => signTypedData(client, args),
        writeContract: (args) => writeContract(client, {
            ...args,
            middleware
        })
    });
}
//# sourceMappingURL=smartAccount.js.map