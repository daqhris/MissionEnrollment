import type { ENTRYPOINT_ADDRESS_V06_TYPE, ENTRYPOINT_ADDRESS_V07_TYPE, UserOperation } from "../types";
import type { EntryPoint, GetEntryPointVersion } from "../types/entrypoint";
export declare const ENTRYPOINT_ADDRESS_V06: ENTRYPOINT_ADDRESS_V06_TYPE;
export declare const ENTRYPOINT_ADDRESS_V07: ENTRYPOINT_ADDRESS_V07_TYPE;
export declare const getEntryPointVersion: (entryPoint: EntryPoint) => GetEntryPointVersion<EntryPoint>;
export declare function isUserOperationVersion06(entryPoint: EntryPoint, _operation: UserOperation<"v0.6"> | UserOperation<"v0.7">): _operation is UserOperation<"v0.6">;
export declare function isUserOperationVersion07(entryPoint: EntryPoint, _operation: UserOperation<"v0.6"> | UserOperation<"v0.7">): _operation is UserOperation<"v0.7">;
//# sourceMappingURL=getEntryPointVersion.d.ts.map