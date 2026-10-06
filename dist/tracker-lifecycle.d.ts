import { z } from "zod";
import type { TrackerLifecycleFacts, TrackerLifecyclePolicy, TrackerLifecycleStage, TrackerPolicy, TrackerProjection, WorkflowState } from "./types.js";
export declare const trackerEnvironmentSchema: z.ZodString;
export declare const trackerLifecyclePolicySchema: z.ZodObject<{
    doneWhen: z.ZodEnum<{
        deployment: "deployment";
        release: "release";
        workflow: "workflow";
    }>;
    readyForRelease: z.ZodString;
    readyForDeployment: z.ZodString;
    productionEnvironment: z.ZodString;
}, z.core.$strict>;
export declare const trackerLifecycleFactSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    version: z.ZodString;
    commit: z.ZodString;
    url: z.ZodNullable<z.ZodString>;
    occurredAt: z.ZodString;
    kind: z.ZodLiteral<"release">;
    environment: z.ZodNull;
    sourceFeature: z.ZodString;
    evidenceDigest: z.ZodString;
    generation: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>, z.ZodObject<{
    version: z.ZodString;
    commit: z.ZodString;
    url: z.ZodNullable<z.ZodString>;
    occurredAt: z.ZodString;
    kind: z.ZodLiteral<"deployment">;
    environment: z.ZodString;
    sourceFeature: z.ZodString;
    evidenceDigest: z.ZodString;
    generation: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>], "kind">;
export declare const trackerLifecycleFactsSchema: z.ZodObject<{
    release: z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
        version: z.ZodString;
        commit: z.ZodString;
        url: z.ZodNullable<z.ZodString>;
        occurredAt: z.ZodString;
        kind: z.ZodLiteral<"release">;
        environment: z.ZodNull;
        sourceFeature: z.ZodString;
        evidenceDigest: z.ZodString;
        generation: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>, z.ZodObject<{
        version: z.ZodString;
        commit: z.ZodString;
        url: z.ZodNullable<z.ZodString>;
        occurredAt: z.ZodString;
        kind: z.ZodLiteral<"deployment">;
        environment: z.ZodString;
        sourceFeature: z.ZodString;
        evidenceDigest: z.ZodString;
        generation: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>], "kind"> & z.ZodType<{
        version: string;
        commit: string;
        url: string | null;
        occurredAt: string;
        kind: "release";
        environment: null;
        sourceFeature: string;
        evidenceDigest: string;
        generation?: number | undefined;
    }, {
        version: string;
        commit: string;
        url: string | null;
        occurredAt: string;
        kind: "release";
        environment: null;
        sourceFeature: string;
        evidenceDigest: string;
        generation?: number | undefined;
    } | {
        version: string;
        commit: string;
        url: string | null;
        occurredAt: string;
        kind: "deployment";
        environment: string;
        sourceFeature: string;
        evidenceDigest: string;
        generation?: number | undefined;
    }, z.core.$ZodTypeInternals<{
        version: string;
        commit: string;
        url: string | null;
        occurredAt: string;
        kind: "release";
        environment: null;
        sourceFeature: string;
        evidenceDigest: string;
        generation?: number | undefined;
    }, {
        version: string;
        commit: string;
        url: string | null;
        occurredAt: string;
        kind: "release";
        environment: null;
        sourceFeature: string;
        evidenceDigest: string;
        generation?: number | undefined;
    } | {
        version: string;
        commit: string;
        url: string | null;
        occurredAt: string;
        kind: "deployment";
        environment: string;
        sourceFeature: string;
        evidenceDigest: string;
        generation?: number | undefined;
    }>>>;
    deployments: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
        version: z.ZodString;
        commit: z.ZodString;
        url: z.ZodNullable<z.ZodString>;
        occurredAt: z.ZodString;
        kind: z.ZodLiteral<"release">;
        environment: z.ZodNull;
        sourceFeature: z.ZodString;
        evidenceDigest: z.ZodString;
        generation: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>, z.ZodObject<{
        version: z.ZodString;
        commit: z.ZodString;
        url: z.ZodNullable<z.ZodString>;
        occurredAt: z.ZodString;
        kind: z.ZodLiteral<"deployment">;
        environment: z.ZodString;
        sourceFeature: z.ZodString;
        evidenceDigest: z.ZodString;
        generation: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>], "kind">>>;
    latest: z.ZodDiscriminatedUnion<[z.ZodObject<{
        version: z.ZodString;
        commit: z.ZodString;
        url: z.ZodNullable<z.ZodString>;
        occurredAt: z.ZodString;
        kind: z.ZodLiteral<"release">;
        environment: z.ZodNull;
        sourceFeature: z.ZodString;
        evidenceDigest: z.ZodString;
        generation: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>, z.ZodObject<{
        version: z.ZodString;
        commit: z.ZodString;
        url: z.ZodNullable<z.ZodString>;
        occurredAt: z.ZodString;
        kind: z.ZodLiteral<"deployment">;
        environment: z.ZodString;
        sourceFeature: z.ZodString;
        evidenceDigest: z.ZodString;
        generation: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>], "kind">;
}, z.core.$strict>;
/** A configured observation command prints this complete JSON document on stdout. */
export declare const trackerLifecycleObservationSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    version: z.ZodString;
    commit: z.ZodString;
    url: z.ZodNullable<z.ZodString>;
    occurredAt: z.ZodString;
    kind: z.ZodLiteral<"release">;
    environment: z.ZodNull;
    features: z.ZodArray<z.ZodString>;
    generations: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
}, z.core.$strict>, z.ZodObject<{
    version: z.ZodString;
    commit: z.ZodString;
    url: z.ZodNullable<z.ZodString>;
    occurredAt: z.ZodString;
    kind: z.ZodLiteral<"deployment">;
    environment: z.ZodString;
    features: z.ZodArray<z.ZodString>;
    generations: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
}, z.core.$strict>], "kind">;
export declare const trackerRecordInputSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    receipt: z.ZodLiteral<"publication">;
    sourceFeature: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    receipt: z.ZodLiteral<"execution">;
    sourceFeature: z.ZodString;
    receiptId: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    receipt: z.ZodLiteral<"command">;
    sourceFeature: z.ZodString;
    commandId: z.ZodString;
}, z.core.$strict>], "receipt">;
export declare function trackerLifecycleStage(state: WorkflowState, policy: TrackerLifecyclePolicy | undefined): TrackerLifecycleStage | undefined;
export declare function currentLifecycleFact(state: WorkflowState, fact: TrackerLifecycleFacts["latest"] | undefined): TrackerLifecycleFacts["latest"] | undefined;
export declare function trackerTargetState(policy: TrackerPolicy, projection: TrackerProjection): string;
export declare function applyTrackerLifecycleFact(previous: TrackerLifecycleFacts | undefined, fact: TrackerLifecycleFacts["latest"]): TrackerLifecycleFacts;
