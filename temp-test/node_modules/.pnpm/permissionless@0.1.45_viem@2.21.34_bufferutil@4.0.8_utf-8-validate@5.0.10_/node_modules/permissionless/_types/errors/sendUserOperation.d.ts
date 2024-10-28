import { BaseError } from "viem";
import type { SendUserOperationParameters } from "../actions/bundler/sendUserOperation";
import type { EntryPoint } from "../types/entrypoint";
export type SendUserOperationErrorType<entryPoint extends EntryPoint> = SendUserOperationError<entryPoint> & {
    name: "SendUserOperationError";
};
export declare class SendUserOperationError<entryPoint extends EntryPoint> extends BaseError {
    cause: BaseError;
    name: string;
    constructor(cause: BaseError, { userOperation, entryPoint, docsPath }: SendUserOperationParameters<entryPoint> & {
        docsPath?: string;
    });
}
//# sourceMappingURL=sendUserOperation.d.ts.map