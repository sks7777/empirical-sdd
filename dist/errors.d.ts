export declare class EmpiricalError extends Error {
    readonly code: string;
    readonly details?: unknown;
    constructor(code: string, message: string, details?: unknown);
}
export declare function asErrorMessage(error: unknown): string;
