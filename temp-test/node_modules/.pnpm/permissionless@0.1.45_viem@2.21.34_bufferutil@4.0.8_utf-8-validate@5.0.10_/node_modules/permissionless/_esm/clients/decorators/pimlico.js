import { sendCompressedUserOperation, validateSponsorshipPolicies } from "../../actions/pimlico.js";
import { getUserOperationGasPrice } from "../../actions/pimlico/getUserOperationGasPrice.js";
import { getUserOperationStatus } from "../../actions/pimlico/getUserOperationStatus.js";
import { sponsorUserOperation } from "../../actions/pimlico/sponsorUserOperation.js";
export const pimlicoBundlerActions = (entryPointAddress) => (client) => ({
    getUserOperationGasPrice: async () => getUserOperationGasPrice(client),
    getUserOperationStatus: async (args) => getUserOperationStatus(client, args),
    sendCompressedUserOperation: async (args) => sendCompressedUserOperation(client, {
        ...args,
        entryPoint: entryPointAddress
    })
});
/**
 * Returns valid sponsorship policies for a userOperation from the list of ids passed
 * - Docs: https://docs.pimlico.io/permissionless/reference/pimlico-paymaster-actions/ValidateSponsorshipPolicies
 *
 * @param args {@link ValidateSponsorshipPoliciesParameters} UserOperation you want to sponsor & entryPoint.
 * @returns valid sponsorship policies, see {@link ValidateSponsorshipPolicies}
 *
 * @example
 * import { createClient } from "viem"
 * import { validateSponsorshipPolicies } from "permissionless/actions/pimlico"
 *
 * const bundlerClient = createClient({
 *   chain: goerli,
 *   transport: http("https://api.pimlico.io/v2/goerli/rpc?apikey=YOUR_API_KEY_HERE")
 * }).extend(pimlicoPaymasterActions)

 *
 * await bundlerClient.validateSponsorshipPolicies({
 *   userOperation: userOperationWithDummySignature,
 *   entryPoint: entryPoint,
 *   sponsorshipPolicyIds: ["sp_shiny_puma"]
 * })
 * Returns
 * [
 *   {
 *     sponsorshipPolicyId: "sp_shiny_puma",
 *     data: {
 *       name: "Shiny Puma",
 *       author: "Pimlico",
 *       icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4...",
 *       description: "This policy is for testing purposes only"
 *    }
 *   }
 * ]
 */
export const pimlicoPaymasterActions = (entryPointAddress) => (client) => ({
    sponsorUserOperation: async (args) => sponsorUserOperation(client, {
        ...args,
        entryPoint: entryPointAddress
    }),
    validateSponsorshipPolicies: async (args) => validateSponsorshipPolicies(client, { ...args, entryPoint: entryPointAddress })
});
/**
 * TODO: Add support for pimlicoActions after we support all the actions of v2 of the Pimlico API.
 */
// export const pimlicoActions = (client: Client) => {
//     return {
//         ...pimlicoBundlerActions(client),
//         ...pimlicoPaymasterActions(client)
//     }
// }
//# sourceMappingURL=pimlico.js.map