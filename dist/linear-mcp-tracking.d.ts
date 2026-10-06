import { z } from "zod";
import type { LinearMcpBridgeResult, LinearMcpIntent, LinearMcpNormalizedResult, TrackerBindInput, TrackerDiscovery, WorkflowState } from "./types.js";
export declare const linearMcpNormalizedResultSchema: z.ZodUnion<readonly [z.ZodObject<{
    kind: z.ZodLiteral<"issue">;
    issue: z.ZodObject<{
        id: z.ZodString;
        identifier: z.ZodString;
        url: z.ZodString;
        description: z.ZodString;
        teamId: z.ZodString;
        projectId: z.ZodNullable<z.ZodString>;
        stateId: z.ZodString;
        attachmentUrls: z.ZodArray<z.ZodString>;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    kind: z.ZodLiteral<"issues">;
    issues: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        identifier: z.ZodString;
        url: z.ZodString;
        description: z.ZodString;
        teamId: z.ZodString;
        projectId: z.ZodNullable<z.ZodString>;
        stateId: z.ZodString;
        attachmentUrls: z.ZodArray<z.ZodString>;
    }, z.core.$strict>>;
    nextCursor: z.ZodNullable<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    kind: z.ZodLiteral<"issues">;
    complete: z.ZodLiteral<true>;
    issues: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        identifier: z.ZodString;
        url: z.ZodString;
        description: z.ZodString;
        teamId: z.ZodString;
        projectId: z.ZodNullable<z.ZodString>;
        stateId: z.ZodString;
        attachmentUrls: z.ZodArray<z.ZodString>;
    }, z.core.$strict>>;
}, z.core.$strict>, z.ZodObject<{
    kind: z.ZodLiteral<"comment">;
    comment: z.ZodObject<{
        id: z.ZodString;
        issueId: z.ZodString;
        body: z.ZodString;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    kind: z.ZodLiteral<"comments">;
    complete: z.ZodLiteral<true>;
    comments: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        issueId: z.ZodString;
        body: z.ZodString;
    }, z.core.$strict>>;
}, z.core.$strict>]>;
export declare const linearMcpDiscoveryCatalogSchema: z.ZodObject<{
    teams: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        key: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    projects: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        teamId: z.ZodString;
        url: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    states: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        teamId: z.ZodString;
        type: z.ZodString;
        position: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export declare function discoverLinearMcpTracker(value: unknown): TrackerDiscovery;
/** Read the current host intent without advancing or dispatching it. */
export declare function inspectLinearMcpTrackerIntent(root: string, feature: string): Promise<{
    intent: LinearMcpIntent;
    sinceRevision: number | null;
    attempts: number;
} | null>;
export declare function prepareLinearMcpTracker(root: string, state: WorkflowState): Promise<LinearMcpBridgeResult>;
export declare function dispatchLinearMcpTracker(root: string, state: WorkflowState, execute: (intent: LinearMcpIntent) => Promise<LinearMcpNormalizedResult>): Promise<LinearMcpBridgeResult>;
/**
 * Create or attach through the agent-mediated connection. The provider read an
 * attach needs becomes the returned intent; accepting its result completes the
 * bind through the ordinary prepare/accept loop.
 */
export declare function bindLinearMcpTracker(root: string, state: WorkflowState, input: TrackerBindInput, execute?: (intent: LinearMcpIntent) => Promise<LinearMcpNormalizedResult>, options?: {
    linkOnly?: boolean;
}): Promise<LinearMcpBridgeResult>;
/** Drop a waived feature's bridge record; its intent will never be executed. */
export declare function removeLinearMcpBridge(root: string, feature: string): Promise<void>;
export declare function acceptLinearMcpTracker(root: string, state: WorkflowState, intentId: string, value: unknown): Promise<LinearMcpBridgeResult>;
