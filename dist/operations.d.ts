import type { ExecutionMode, Workflow } from "./protocol.js";
export interface OperationDefinition {
    id: string;
    mcpName: string;
    internalVerb: string;
    handler: string;
    summary: string;
    profiles: readonly Workflow[];
    modes: readonly ExecutionMode[];
    publicCli: boolean;
    readOnly: boolean;
    destructive: boolean;
    idempotent: boolean;
    cliUsage: string;
}
export declare const OPERATIONS: readonly OperationDefinition[];
export interface SkillDefinition {
    id: string;
    title: string;
    description: string;
    entryOperation: string;
    stopCondition: string;
}
export declare const SKILLS: readonly {
    id: string;
    title: string;
    description: string;
    entryOperation: string;
    stopCondition: string;
}[];
export declare function assertRegistryIntegrity(): void;
export declare function operationById(id: string): OperationDefinition | undefined;
export declare function operationAnnotations(id: string): {
    readOnlyHint: boolean;
    destructiveHint: boolean;
    idempotentHint: boolean;
};
export declare function skillById(id: string): SkillDefinition | undefined;
