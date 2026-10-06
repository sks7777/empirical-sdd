import { z } from "zod";
/** Tool descriptions come from the live host registry, not executable detection.
 * Capability assertions are the host's contract, not an inferred sandbox. */
export declare const delegationHostSchema: z.ZodObject<{
    id: z.ZodString;
    instanceId: z.ZodString;
    provider: z.ZodString;
    capabilities: z.ZodObject<{
        readOnly: z.ZodBoolean;
        isolatedCwd: z.ZodBoolean;
        idempotentSpawn: z.ZodBoolean;
        fencedCancellation: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>;
    tools: z.ZodObject<{
        spawn: z.ZodObject<{
            name: z.ZodString;
            provider: z.ZodString;
            description: z.ZodString;
            inputSchema: z.ZodRecord<z.ZodString, z.ZodUnknown>;
            bindings: z.ZodRecord<z.ZodString, z.ZodString>;
        }, z.core.$strict>;
        lookup: z.ZodObject<{
            name: z.ZodString;
            provider: z.ZodString;
            description: z.ZodString;
            inputSchema: z.ZodRecord<z.ZodString, z.ZodUnknown>;
            bindings: z.ZodRecord<z.ZodString, z.ZodString>;
        }, z.core.$strict>;
        status: z.ZodObject<{
            name: z.ZodString;
            provider: z.ZodString;
            description: z.ZodString;
            inputSchema: z.ZodRecord<z.ZodString, z.ZodUnknown>;
            bindings: z.ZodRecord<z.ZodString, z.ZodString>;
        }, z.core.$strict>;
        stop: z.ZodObject<{
            name: z.ZodString;
            provider: z.ZodString;
            description: z.ZodString;
            inputSchema: z.ZodRecord<z.ZodString, z.ZodUnknown>;
            bindings: z.ZodRecord<z.ZodString, z.ZodString>;
        }, z.core.$strict>;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const delegationPrepareInputSchema: z.ZodObject<{
    id: z.ZodString;
    approved: z.ZodLiteral<true>;
    parent: z.ZodObject<{
        feature: z.ZodString;
        revision: z.ZodNumber;
    }, z.core.$strict>;
    worker: z.ZodObject<{
        feature: z.ZodString;
        revision: z.ZodNumber;
        root: z.ZodString;
    }, z.core.$strict>;
    role: z.ZodEnum<{
        consult: "consult";
        implement: "implement";
        specify: "specify";
    }>;
    instruction: z.ZodString;
    scope: z.ZodArray<z.ZodString>;
    host: z.ZodObject<{
        id: z.ZodString;
        instanceId: z.ZodString;
        provider: z.ZodString;
        capabilities: z.ZodObject<{
            readOnly: z.ZodBoolean;
            isolatedCwd: z.ZodBoolean;
            idempotentSpawn: z.ZodBoolean;
            fencedCancellation: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>;
        tools: z.ZodObject<{
            spawn: z.ZodObject<{
                name: z.ZodString;
                provider: z.ZodString;
                description: z.ZodString;
                inputSchema: z.ZodRecord<z.ZodString, z.ZodUnknown>;
                bindings: z.ZodRecord<z.ZodString, z.ZodString>;
            }, z.core.$strict>;
            lookup: z.ZodObject<{
                name: z.ZodString;
                provider: z.ZodString;
                description: z.ZodString;
                inputSchema: z.ZodRecord<z.ZodString, z.ZodUnknown>;
                bindings: z.ZodRecord<z.ZodString, z.ZodString>;
            }, z.core.$strict>;
            status: z.ZodObject<{
                name: z.ZodString;
                provider: z.ZodString;
                description: z.ZodString;
                inputSchema: z.ZodRecord<z.ZodString, z.ZodUnknown>;
                bindings: z.ZodRecord<z.ZodString, z.ZodString>;
            }, z.core.$strict>;
            stop: z.ZodObject<{
                name: z.ZodString;
                provider: z.ZodString;
                description: z.ZodString;
                inputSchema: z.ZodRecord<z.ZodString, z.ZodUnknown>;
                bindings: z.ZodRecord<z.ZodString, z.ZodString>;
            }, z.core.$strict>;
        }, z.core.$strict>;
    }, z.core.$strict>;
    maxConcurrency: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
export declare const delegationNormalizedResultSchema: z.ZodObject<{
    hostId: z.ZodString;
    instanceId: z.ZodString;
    dispatchId: z.ZodString;
    operation: z.ZodEnum<{
        lookup: "lookup";
        spawn: "spawn";
        status: "status";
        stop: "stop";
    }>;
    outcome: z.ZodEnum<{
        cancelled: "cancelled";
        completed: "completed";
        failed: "failed";
        "not-found": "not-found";
        running: "running";
        unknown: "unknown";
    }>;
    agentId: z.ZodNullable<z.ZodString>;
    terminationConfirmed: z.ZodBoolean;
    summary: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const delegationAcceptInputSchema: z.ZodObject<{
    id: z.ZodString;
    intentId: z.ZodString;
    result: z.ZodObject<{
        hostId: z.ZodString;
        instanceId: z.ZodString;
        dispatchId: z.ZodString;
        operation: z.ZodEnum<{
            lookup: "lookup";
            spawn: "spawn";
            status: "status";
            stop: "stop";
        }>;
        outcome: z.ZodEnum<{
            cancelled: "cancelled";
            completed: "completed";
            failed: "failed";
            "not-found": "not-found";
            running: "running";
            unknown: "unknown";
        }>;
        agentId: z.ZodNullable<z.ZodString>;
        terminationConfirmed: z.ZodBoolean;
        summary: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const delegationStatusInputSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    action: z.ZodOptional<z.ZodEnum<{
        cancel: "cancel";
        observe: "observe";
    }>>;
}, z.core.$strict>;
export type DelegationHost = z.infer<typeof delegationHostSchema>;
export type DelegationPrepareInput = z.infer<typeof delegationPrepareInputSchema>;
export type DelegationAcceptInput = z.infer<typeof delegationAcceptInputSchema>;
export type DelegationStatusInput = z.infer<typeof delegationStatusInputSchema>;
export type DelegationNormalizedResult = z.infer<typeof delegationNormalizedResultSchema>;
declare const intentSchema: z.ZodObject<{
    id: z.ZodString;
    dispatchId: z.ZodString;
    generation: z.ZodNumber;
    hostId: z.ZodString;
    instanceId: z.ZodString;
    operation: z.ZodEnum<{
        lookup: "lookup";
        spawn: "spawn";
        status: "status";
        stop: "stop";
    }>;
    tool: z.ZodString;
    provider: z.ZodString;
    arguments: z.ZodRecord<z.ZodString, z.ZodUnknown>;
}, z.core.$strict>;
declare const recordSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    id: z.ZodString;
    dispatchId: z.ZodString;
    requestDigest: z.ZodString;
    repositoryId: z.ZodString;
    parent: z.ZodObject<{
        feature: z.ZodString;
        revision: z.ZodNumber;
        root: z.ZodString;
        worktreeId: z.ZodString;
        specDigest: z.ZodString;
        phase: z.ZodString;
    }, z.core.$strict>;
    worker: z.ZodObject<{
        feature: z.ZodString;
        revision: z.ZodNumber;
        root: z.ZodString;
        worktreeId: z.ZodString;
        specDigest: z.ZodString;
        phase: z.ZodString;
    }, z.core.$strict>;
    role: z.ZodEnum<{
        consult: "consult";
        implement: "implement";
        specify: "specify";
    }>;
    instruction: z.ZodString;
    scope: z.ZodArray<z.ZodString>;
    host: z.ZodObject<{
        id: z.ZodString;
        instanceId: z.ZodString;
        provider: z.ZodString;
        capabilities: z.ZodObject<{
            readOnly: z.ZodBoolean;
            isolatedCwd: z.ZodBoolean;
            idempotentSpawn: z.ZodBoolean;
            fencedCancellation: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>;
        tools: z.ZodObject<{
            spawn: z.ZodObject<{
                name: z.ZodString;
                provider: z.ZodString;
                description: z.ZodString;
                inputSchema: z.ZodRecord<z.ZodString, z.ZodUnknown>;
                bindings: z.ZodRecord<z.ZodString, z.ZodString>;
            }, z.core.$strict>;
            lookup: z.ZodObject<{
                name: z.ZodString;
                provider: z.ZodString;
                description: z.ZodString;
                inputSchema: z.ZodRecord<z.ZodString, z.ZodUnknown>;
                bindings: z.ZodRecord<z.ZodString, z.ZodString>;
            }, z.core.$strict>;
            status: z.ZodObject<{
                name: z.ZodString;
                provider: z.ZodString;
                description: z.ZodString;
                inputSchema: z.ZodRecord<z.ZodString, z.ZodUnknown>;
                bindings: z.ZodRecord<z.ZodString, z.ZodString>;
            }, z.core.$strict>;
            stop: z.ZodObject<{
                name: z.ZodString;
                provider: z.ZodString;
                description: z.ZodString;
                inputSchema: z.ZodRecord<z.ZodString, z.ZodUnknown>;
                bindings: z.ZodRecord<z.ZodString, z.ZodString>;
            }, z.core.$strict>;
        }, z.core.$strict>;
    }, z.core.$strict>;
    maxConcurrency: z.ZodNumber;
    status: z.ZodEnum<{
        cancelled: "cancelled";
        completed: "completed";
        dispatching: "dispatching";
        failed: "failed";
        running: "running";
        stopping: "stopping";
        uncertain: "uncertain";
    }>;
    agentId: z.ZodNullable<z.ZodString>;
    cancelRequested: z.ZodBoolean;
    intent: z.ZodNullable<z.ZodObject<{
        id: z.ZodString;
        dispatchId: z.ZodString;
        generation: z.ZodNumber;
        hostId: z.ZodString;
        instanceId: z.ZodString;
        operation: z.ZodEnum<{
            lookup: "lookup";
            spawn: "spawn";
            status: "status";
            stop: "stop";
        }>;
        tool: z.ZodString;
        provider: z.ZodString;
        arguments: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    }, z.core.$strict>>;
    generation: z.ZodNumber;
    lastAccepted: z.ZodNullable<z.ZodObject<{
        intentId: z.ZodString;
        resultDigest: z.ZodString;
    }, z.core.$strict>>;
    summary: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    digest: z.ZodString;
}, z.core.$strict>;
export type DelegationRecord = z.infer<typeof recordSchema>;
export type DelegationIntent = z.infer<typeof intentSchema>;
export interface DelegationResult {
    kind: "delegation";
    record: DelegationRecord | null;
    records: DelegationRecord[];
    intent: DelegationIntent | null;
    recovery: string | null;
}
export interface DelegationRuntime {
    /** Exact live registry metadata for this runtime instance. */
    host: DelegationHost;
    /** Invoke the actual discovered tool with intent.arguments and normalize its
     * native result. A throw is uncertain, including a lost successful response. */
    execute(intent: DelegationIntent): Promise<DelegationNormalizedResult>;
}
/** Only direct, compatible native input fields are negotiated. An unsupported
 * schema is a capability gap; it never becomes a guessed argument translation. */
export declare function discoverDelegationHost(value: unknown): {
    kind: "delegation_host";
    host: DelegationHost;
    digest: string;
    writable: boolean;
    consult: boolean;
    unavailable: string[];
};
export declare function prepareDelegation(root: string, value: unknown): Promise<DelegationResult>;
/** Reading with no action neither creates metadata nor changes a pending intent. */
export declare function delegationStatus(root: string, value?: unknown): Promise<DelegationResult>;
/** Ownership changes share the checkout lock with prepare's parent+worker lock
 * set. Reading the atomically replaced ledger is sufficient here: existing
 * assignments can become terminal concurrently, but no new writer can reserve
 * this root until the guarded operation finishes. No global ledger lock is held
 * during a transfer, Git inspection, or workflow transaction. */
export declare function withDelegationOwnershipGuard<T>(root: string, input: {
    feature?: string;
    nextFeature?: string | null;
    terminalCompletion?: boolean;
}, operation: () => Promise<T>): Promise<T>;
export declare function acceptDelegation(root: string, value: unknown): Promise<DelegationResult>;
/** Dispatch once through an injected native host, without holding any Git or
 * ledger lock while the child launches or runs. No workflow proof is created. */
export declare function runDelegation(root: string, input: DelegationPrepareInput, runtime: DelegationRuntime): Promise<DelegationResult>;
/** Observe/reconcile/cancel one native lifecycle step. If lookup proves absence,
 * a subsequent call performs the recovered spawn using the same dispatch key. */
export declare function advanceDelegation(root: string, input: DelegationStatusInput, runtime: DelegationRuntime): Promise<DelegationResult>;
export {};
