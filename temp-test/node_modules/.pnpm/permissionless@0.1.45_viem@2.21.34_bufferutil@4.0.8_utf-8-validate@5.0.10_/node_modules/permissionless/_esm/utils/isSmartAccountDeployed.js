import { getBytecode } from "viem/actions";
export const isSmartAccountDeployed = async (client, address) => {
    const contractCode = await getBytecode(client, {
        address: address
    });
    if ((contractCode?.length ?? 0) > 2) {
        return true;
    }
    return false;
};
//# sourceMappingURL=isSmartAccountDeployed.js.map