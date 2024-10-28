export type ErrorType<name extends string = "Error"> = Error & {
    name: name;
};
export declare function prettyPrint(args: Record<string, bigint | number | string | undefined | false | unknown>): string;
//# sourceMappingURL=utils.d.ts.map