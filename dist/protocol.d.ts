import { z } from "zod";
/** The longest a single configured verification command may run. */
export declare const MAX_COMMAND_TIMEOUT_MS = 2700000;
export declare const SCHEMA_VERSION: 5;
export declare const POLICY_SCHEMA_VERSION: 2;
export declare const MANIFEST_SCHEMA_VERSION: 2;
export declare const RECEIPT_SCHEMA_VERSION: 1;
export declare const PRODUCT_VERSION = "0.42.0";
export declare const workflowSchema: z.ZodEnum<{
    complex: "complex";
    fast: "fast";
}>;
export declare const featureLifecycleSchema: z.ZodObject<{
    stage: z.ZodEnum<{
        consolidation: "consolidation";
        development: "development";
        iteration: "iteration";
    }>;
    iteration: z.ZodNumber;
    awaitingFeedback: z.ZodBoolean;
    iterative: z.ZodOptional<z.ZodLiteral<true>>;
    contractRevision: z.ZodOptional<z.ZodNumber>;
    riskRequest: z.ZodOptional<z.ZodString>;
    contractBaseline: z.ZodOptional<z.ZodNumber>;
    amendments: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    amendContract: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export type FeatureLifecycle = z.infer<typeof featureLifecycleSchema>;
/** Present only while the selected feature is paused for direct work. */
export declare const directPauseSchema: z.ZodObject<{
    since: z.ZodString;
    baseCommit: z.ZodString;
}, z.core.$strict>;
export type DirectPause = z.infer<typeof directPauseSchema>;
/** The recorded answer to the size guardrail, bound to the contract size it covered. */
export declare const sizeDecisionSchema: z.ZodObject<{
    choice: z.ZodEnum<{
        keep: "keep";
        split: "split";
    }>;
    criteria: z.ZodNumber;
    capabilities: z.ZodNumber;
    reason: z.ZodNullable<z.ZodString>;
    actor: z.ZodString;
    revision: z.ZodNumber;
}, z.core.$strict>;
export type SizeDecision = z.infer<typeof sizeDecisionSchema>;
/** Team or personal default lane; absent means `empirical`. */
export declare const defaultModeSchema: z.ZodEnum<{
    direct: "direct";
    empirical: "empirical";
}>;
export type DefaultMode = z.infer<typeof defaultModeSchema>;
export declare const directActionSchema: z.ZodEnum<{
    pause: "pause";
    resume: "resume";
    track: "track";
}>;
export type DirectAction = z.infer<typeof directActionSchema>;
export declare const executionModeSchema: z.ZodEnum<{
    normal: "normal";
    yolo: "yolo";
}>;
/** Explicit QA scope: `iterate` runs only changed-file commands; `final` is the full configured scope. */
export declare const verificationProfileSchema: z.ZodEnum<{
    final: "final";
    iterate: "iterate";
}>;
export type VerificationProfile = z.infer<typeof verificationProfileSchema>;
/** Full-CI promotion mode; omitted means `auto` (see promotionRoute). */
export declare const promotionFullCiSchema: z.ZodEnum<{
    auto: "auto";
    local: "local";
    "remote-checks": "remote-checks";
}>;
export type PromotionFullCi = z.infer<typeof promotionFullCiSchema>;
/**
 * How strictly proof is bound. `standard` (omitted) keeps a receipt, approval
 * or review valid while the content it covered is unchanged, so commits that
 * only add Empirical records or touch unrelated files never force a re-test.
 * `strict` binds proof to the exact commit, for releases and audits.
 */
export declare const promotionBindingSchema: z.ZodEnum<{
    standard: "standard";
    strict: "strict";
}>;
export type PromotionBinding = z.infer<typeof promotionBindingSchema>;
export declare const riskFloorSchema: z.ZodEnum<{
    behavioral: "behavioral";
    "contract-neutral": "contract-neutral";
    delivery: "delivery";
    integration: "integration";
    migration: "migration";
    publication: "publication";
    sensitive: "sensitive";
}>;
export declare const completionLevelSchema: z.ZodEnum<{
    delivered: "delivered";
    implemented: "implemented";
    integrated: "integrated";
    none: "none";
    published: "published";
    verified: "verified";
}>;
export declare const phaseSchema: z.ZodEnum<{
    archive: "archive";
    context: "context";
    deliver: "deliver";
    design: "design";
    done: "done";
    idle: "idle";
    implement: "implement";
    integrate: "integrate";
    plan: "plan";
    publish: "publish";
    review: "review";
    shape: "shape";
    specify: "specify";
    verify: "verify";
}>;
export declare const workflowStatusSchema: z.ZodEnum<{
    awaiting_human: "awaiting_human";
    blocked: "blocked";
    done: "done";
    idle: "idle";
    waiting: "waiting";
}>;
export type Workflow = z.infer<typeof workflowSchema>;
export type ExecutionMode = z.infer<typeof executionModeSchema>;
export type RiskFloor = z.infer<typeof riskFloorSchema>;
export type CompletionLevel = z.infer<typeof completionLevelSchema>;
export type Phase = z.infer<typeof phaseSchema>;
export type WorkflowStatus = z.infer<typeof workflowStatusSchema>;
type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | {
    [key: string]: JsonValue;
};
export declare function canonicalJson(value: unknown): string;
export declare function sha256(value: string | Uint8Array): string;
export declare function digestJson(value: unknown): string;
export declare const criterionSchema: z.ZodObject<{
    id: z.ZodString;
    text: z.ZodString;
    ui: z.ZodDefault<z.ZodBoolean>;
    checked: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strict>;
export type Criterion = z.infer<typeof criterionSchema>;
export declare const evidenceKindSchema: z.ZodEnum<{
    browser: "browser";
    human: "human";
    review: "review";
    screenshot: "screenshot";
    test: "test";
}>;
export declare const qaCheckKindSchema: z.ZodEnum<{
    "adapter-contract": "adapter-contract";
    "clean-clone": "clean-clone";
    "cross-platform": "cross-platform";
    "end-to-end": "end-to-end";
    "fault-injection": "fault-injection";
    "fresh-context": "fresh-context";
    "full-ci": "full-ci";
    integration: "integration";
    "live-acceptance": "live-acceptance";
    "package-consumer": "package-consumer";
    unit: "unit";
}>;
export declare const qaAttemptOutcomeSchema: z.ZodEnum<{
    cancelled: "cancelled";
    failed: "failed";
    "missing-environment": "missing-environment";
    passed: "passed";
    skipped: "skipped";
    "timed-out": "timed-out";
    unsupported: "unsupported";
}>;
export type QaCheckKind = z.infer<typeof qaCheckKindSchema>;
export type QaAttemptOutcome = z.infer<typeof qaAttemptOutcomeSchema>;
export declare function validateCriteria(criteria: readonly Criterion[]): void;
export declare const MAX_SCOPE_ENTRIES = 32;
export declare const MAX_SCOPE_ENTRY_LENGTH = 200;
export declare const commandPolicySchema: z.ZodObject<{
    id: z.ZodString;
    argv: z.ZodArray<z.ZodString>;
    cwd: z.ZodDefault<z.ZodString>;
    timeoutMs: z.ZodNumber;
    maxOutputBytes: z.ZodDefault<z.ZodNumber>;
    evidenceKinds: z.ZodDefault<z.ZodArray<z.ZodEnum<{
        browser: "browser";
        human: "human";
        review: "review";
        screenshot: "screenshot";
        test: "test";
    }>>>;
    checks: z.ZodDefault<z.ZodArray<z.ZodEnum<{
        "adapter-contract": "adapter-contract";
        "clean-clone": "clean-clone";
        "cross-platform": "cross-platform";
        "end-to-end": "end-to-end";
        "fault-injection": "fault-injection";
        "fresh-context": "fresh-context";
        "full-ci": "full-ci";
        integration: "integration";
        "live-acceptance": "live-acceptance";
        "package-consumer": "package-consumer";
        unit: "unit";
    }>>>;
    criteria: z.ZodDefault<z.ZodArray<z.ZodString>>;
    testFiles: z.ZodOptional<z.ZodLiteral<"changed">>;
    scope: z.ZodOptional<z.ZodUnion<readonly [z.ZodArray<z.ZodString>, z.ZodLiteral<"workspace">]>>;
}, z.core.$strict>;
export type CommandPolicy = z.infer<typeof commandPolicySchema>;
export declare const evidencePolicySchema: z.ZodObject<{
    required: z.ZodDefault<z.ZodBoolean>;
    browserForUi: z.ZodDefault<z.ZodBoolean>;
    screenshotForUi: z.ZodDefault<z.ZodBoolean>;
    codeReview: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strict>;
export declare const projectPolicySchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<2>;
    context: z.ZodDefault<z.ZodArray<z.ZodString>>;
    phases: z.ZodDefault<z.ZodRecord<z.ZodEnum<{
        archive: "archive";
        context: "context";
        deliver: "deliver";
        design: "design";
        done: "done";
        idle: "idle";
        implement: "implement";
        integrate: "integrate";
        plan: "plan";
        publish: "publish";
        review: "review";
        shape: "shape";
        specify: "specify";
        verify: "verify";
    }> & z.core.$partial, z.ZodArray<z.ZodString>>>;
    verification: z.ZodDefault<z.ZodObject<{
        evidence: z.ZodDefault<z.ZodObject<{
            required: z.ZodDefault<z.ZodBoolean>;
            browserForUi: z.ZodDefault<z.ZodBoolean>;
            screenshotForUi: z.ZodDefault<z.ZodBoolean>;
            codeReview: z.ZodDefault<z.ZodBoolean>;
        }, z.core.$strict>>;
        commands: z.ZodDefault<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            argv: z.ZodArray<z.ZodString>;
            cwd: z.ZodDefault<z.ZodString>;
            timeoutMs: z.ZodNumber;
            maxOutputBytes: z.ZodDefault<z.ZodNumber>;
            evidenceKinds: z.ZodDefault<z.ZodArray<z.ZodEnum<{
                browser: "browser";
                human: "human";
                review: "review";
                screenshot: "screenshot";
                test: "test";
            }>>>;
            checks: z.ZodDefault<z.ZodArray<z.ZodEnum<{
                "adapter-contract": "adapter-contract";
                "clean-clone": "clean-clone";
                "cross-platform": "cross-platform";
                "end-to-end": "end-to-end";
                "fault-injection": "fault-injection";
                "fresh-context": "fresh-context";
                "full-ci": "full-ci";
                integration: "integration";
                "live-acceptance": "live-acceptance";
                "package-consumer": "package-consumer";
                unit: "unit";
            }>>>;
            criteria: z.ZodDefault<z.ZodArray<z.ZodString>>;
            testFiles: z.ZodOptional<z.ZodLiteral<"changed">>;
            scope: z.ZodOptional<z.ZodUnion<readonly [z.ZodArray<z.ZodString>, z.ZodLiteral<"workspace">]>>;
        }, z.core.$strict>>>;
        notApplicable: z.ZodOptional<z.ZodArray<z.ZodObject<{
            check: z.ZodEnum<{
                "clean-clone": "clean-clone";
                "cross-platform": "cross-platform";
                "package-consumer": "package-consumer";
            }>;
            reason: z.ZodString;
        }, z.core.$strict>>>;
    }, z.core.$strict>>;
    delivery: z.ZodDefault<z.ZodNullable<z.ZodObject<{
        provider: z.ZodLiteral<"github">;
        targetBranch: z.ZodString;
        requiredChecks: z.ZodDefault<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>>;
    promotion: z.ZodOptional<z.ZodObject<{
        fullCi: z.ZodOptional<z.ZodEnum<{
            auto: "auto";
            local: "local";
            "remote-checks": "remote-checks";
        }>>;
        binding: z.ZodOptional<z.ZodEnum<{
            standard: "standard";
            strict: "strict";
        }>>;
    }, z.core.$strict>>;
    preferredAgent: z.ZodDefault<z.ZodNullable<z.ZodEnum<{
        claude: "claude";
        codex: "codex";
        cursor: "cursor";
        gemini: "gemini";
        windsurf: "windsurf";
    }>>>;
}, z.core.$strict>;
export type EvidencePolicy = z.infer<typeof evidencePolicySchema>;
export type ProjectPolicy = z.infer<typeof projectPolicySchema>;
export declare const impactManifestSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    classification: z.ZodEnum<{
        behavioral: "behavioral";
        "non-behavioral": "non-behavioral";
    }>;
    capabilities: z.ZodArray<z.ZodString>;
    surfaces: z.ZodArray<z.ZodString>;
    regressionRationale: z.ZodNullable<z.ZodString>;
    digest: z.ZodString;
}, z.core.$strict>;
export type ImpactManifest = z.infer<typeof impactManifestSchema>;
/** Implementation scope only; this never approves a canonical capability delta. */
export declare const fastImpactManifestSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    workflow: z.ZodLiteral<"fast">;
    classification: z.ZodEnum<{
        behavioral: "behavioral";
        "non-behavioral": "non-behavioral";
    }>;
    request: z.ZodString;
    capabilities: z.ZodArray<z.ZodString>;
    surfaces: z.ZodArray<z.ZodString>;
    canonical: z.ZodLiteral<false>;
    verification: z.ZodLiteral<"skipped">;
    digest: z.ZodString;
}, z.core.$strict>;
export type FastImpactManifest = z.infer<typeof fastImpactManifestSchema>;
export declare function createFastImpactManifest(input: Omit<FastImpactManifest, "digest">): FastImpactManifest;
export declare function verifyFastImpactManifest(manifest: FastImpactManifest): void;
export declare function createImpactManifest(input: Omit<ImpactManifest, "digest">): ImpactManifest;
export declare function verifyImpactManifest(manifest: ImpactManifest): void;
export declare const authorizationSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    mode: z.ZodLiteral<"yolo">;
    repositoryId: z.ZodString;
    feature: z.ZodString;
    requestDigest: z.ZodString;
    ceiling: z.ZodEnum<{
        delivered: "delivered";
        implemented: "implemented";
        integrated: "integrated";
        published: "published";
        verified: "verified";
    }>;
    targetBranch: z.ZodNullable<z.ZodString>;
    allowExternalAgent: z.ZodBoolean;
    createdAt: z.ZodString;
    expiresAt: z.ZodNullable<z.ZodString>;
    digest: z.ZodString;
}, z.core.$strict>;
export type StandingAuthorization = z.infer<typeof authorizationSchema>;
export declare function createAuthorization(input: Omit<StandingAuthorization, "schemaVersion" | "mode" | "digest">): StandingAuthorization;
export declare function verifyAuthorization(authorization: StandingAuthorization, now?: Date): void;
/** Derived acceptance coverage, never an executed QA attempt. */
export declare const reviewCoverageSchema: z.ZodObject<{
    kind: z.ZodLiteral<"review-derived">;
    checkId: z.ZodLiteral<"qa-fresh-context">;
    receiptId: z.ZodString;
    matrixDigest: z.ZodString;
    specDigest: z.ZodString;
    revision: z.ZodNumber;
}, z.core.$strict>;
export declare const closureOutcomeSchema: z.ZodEnum<{
    abandoned: "abandoned";
    "merged-externally": "merged-externally";
    superseded: "superseded";
}>;
/**
 * Externally observed merge facts. These are read from the host forge and the
 * local Git graph; they never stand in for a delivery receipt and never raise a
 * completion level.
 */
export declare const externalMergeFactsSchema: z.ZodObject<{
    pullRequest: z.ZodNumber;
    url: z.ZodString;
    state: z.ZodLiteral<"MERGED">;
    mergeCommit: z.ZodString;
    targetBranch: z.ZodString;
    ancestorOfTarget: z.ZodLiteral<true>;
    observedAt: z.ZodString;
}, z.core.$strict>;
export declare const featureClosureSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    outcome: z.ZodEnum<{
        abandoned: "abandoned";
        "merged-externally": "merged-externally";
        superseded: "superseded";
    }>;
    reason: z.ZodString;
    actor: z.ZodString;
    confirmation: z.ZodEnum<{
        "agent-relayed": "agent-relayed";
        cli: "cli";
        "cli-unattended": "cli-unattended";
        elicited: "elicited";
        "merge-observed": "merge-observed";
    }>;
    closedAtPhase: z.ZodEnum<{
        archive: "archive";
        context: "context";
        deliver: "deliver";
        design: "design";
        done: "done";
        idle: "idle";
        implement: "implement";
        integrate: "integrate";
        plan: "plan";
        publish: "publish";
        review: "review";
        shape: "shape";
        specify: "specify";
        verify: "verify";
    }>;
    completionAtClosure: z.ZodEnum<{
        delivered: "delivered";
        implemented: "implemented";
        integrated: "integrated";
        none: "none";
        published: "published";
        verified: "verified";
    }>;
    externalMerge: z.ZodOptional<z.ZodObject<{
        pullRequest: z.ZodNumber;
        url: z.ZodString;
        state: z.ZodLiteral<"MERGED">;
        mergeCommit: z.ZodString;
        targetBranch: z.ZodString;
        ancestorOfTarget: z.ZodLiteral<true>;
        observedAt: z.ZodString;
    }, z.core.$strict>>;
    closedAt: z.ZodString;
    digest: z.ZodString;
}, z.core.$strict>;
export type ClosureOutcome = z.infer<typeof closureOutcomeSchema>;
export type ExternalMergeFacts = z.infer<typeof externalMergeFactsSchema>;
export type FeatureClosure = z.infer<typeof featureClosureSchema>;
export declare function createFeatureClosure(input: Omit<FeatureClosure, "schemaVersion" | "digest">): FeatureClosure;
export declare function verifyFeatureClosure(closure: FeatureClosure): void;
export declare const trackerWaiverReasonSchema: z.ZodEnum<{
    abandoned: "abandoned";
    "tracked-elsewhere": "tracked-elsewhere";
}>;
/**
 * An audited decision that a terminal feature's unsynchronized tracker
 * projection will not be synchronized. It records what it resolved; it makes no
 * claim about any provider ticket, which is why `ticket` is only a reference.
 */
export declare const trackerWaiverSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    reason: z.ZodEnum<{
        abandoned: "abandoned";
        "tracked-elsewhere": "tracked-elsewhere";
    }>;
    justification: z.ZodString;
    ticket: z.ZodNullable<z.ZodString>;
    actor: z.ZodString;
    resolvedPending: z.ZodObject<{
        provider: z.ZodEnum<{
            github: "github";
            jira: "jira";
            linear: "linear";
            plane: "plane";
        }>;
        mode: z.ZodEnum<{
            attach: "attach";
            create: "create";
        }>;
        idempotencyKey: z.ZodString;
        digest: z.ZodString;
        projectionRevision: z.ZodNumber;
        failureCode: z.ZodNullable<z.ZodString>;
    }, z.core.$strict>;
    waivedAt: z.ZodString;
    digest: z.ZodString;
}, z.core.$strict>;
export type TrackerWaiver = z.infer<typeof trackerWaiverSchema>;
export declare function createTrackerWaiver(input: Omit<TrackerWaiver, "schemaVersion" | "digest">): TrackerWaiver;
export declare function verifyTrackerWaiver(waiver: TrackerWaiver): TrackerWaiver;
export interface CompletionFacts {
    implemented: boolean;
    verified: boolean;
    integrated: boolean;
    delivered: boolean;
    published: boolean;
}
export interface CompletionReport extends CompletionFacts {
    highest: CompletionLevel;
    reasons: Partial<Record<Exclude<CompletionLevel, "none">, string>>;
}
export declare function deriveCompletion(facts: CompletionFacts): CompletionReport;
export declare const receiptProvenanceSchema: z.ZodObject<{
    repositoryId: z.ZodString;
    feature: z.ZodString;
    specRevision: z.ZodNumber;
    specDigest: z.ZodString;
    treeDigest: z.ZodString;
    policyDigest: z.ZodString;
}, z.core.$strict>;
export declare const executedReceiptSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    id: z.ZodString;
    criteria: z.ZodArray<z.ZodString>;
    evidenceKinds: z.ZodArray<z.ZodEnum<{
        browser: "browser";
        human: "human";
        review: "review";
        screenshot: "screenshot";
        test: "test";
    }>>;
    summary: z.ZodString;
    passed: z.ZodBoolean;
    startedAt: z.ZodString;
    completedAt: z.ZodString;
    provenance: z.ZodObject<{
        repositoryId: z.ZodString;
        feature: z.ZodString;
        specRevision: z.ZodNumber;
        specDigest: z.ZodString;
        treeDigest: z.ZodString;
        policyDigest: z.ZodString;
    }, z.core.$strict>;
    digest: z.ZodString;
    kind: z.ZodLiteral<"executed">;
    command: z.ZodObject<{
        argv: z.ZodArray<z.ZodString>;
        cwd: z.ZodString;
        timeoutMs: z.ZodNumber;
        maxOutputBytes: z.ZodNumber;
        environmentKeys: z.ZodDefault<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>;
    result: z.ZodObject<{
        exitCode: z.ZodNullable<z.ZodNumber>;
        signal: z.ZodNullable<z.ZodString>;
        timedOut: z.ZodBoolean;
        stdoutDigest: z.ZodString;
        stderrDigest: z.ZodString;
        stdoutTail: z.ZodString;
        stderrTail: z.ZodString;
        stdoutTruncated: z.ZodBoolean;
        stderrTruncated: z.ZodBoolean;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const artifactRecordSchema: z.ZodObject<{
    path: z.ZodString;
    mediaType: z.ZodString;
    bytes: z.ZodNumber;
    digest: z.ZodString;
}, z.core.$strict>;
export type ArtifactRecord = z.infer<typeof artifactRecordSchema>;
export declare const qaAttemptSchema: z.ZodObject<{
    number: z.ZodNumber;
    outcome: z.ZodEnum<{
        cancelled: "cancelled";
        failed: "failed";
        "missing-environment": "missing-environment";
        passed: "passed";
        skipped: "skipped";
        "timed-out": "timed-out";
        unsupported: "unsupported";
    }>;
    summary: z.ZodString;
    startedAt: z.ZodString;
    completedAt: z.ZodString;
    durationMs: z.ZodNumber;
    collector: z.ZodNullable<z.ZodString>;
    command: z.ZodNullable<z.ZodObject<{
        executableDigest: z.ZodOptional<z.ZodString>;
        runtimeDigest: z.ZodOptional<z.ZodString>;
        argv: z.ZodArray<z.ZodString>;
        cwd: z.ZodString;
        timeoutMs: z.ZodNumber;
        maxOutputBytes: z.ZodNumber;
        environmentKeys: z.ZodArray<z.ZodString>;
    }, z.core.$strict>>;
    result: z.ZodNullable<z.ZodObject<{
        exitCode: z.ZodNullable<z.ZodNumber>;
        signal: z.ZodNullable<z.ZodString>;
        timedOut: z.ZodBoolean;
        stdoutDigest: z.ZodString;
        stderrDigest: z.ZodString;
        stdoutTail: z.ZodString;
        stderrTail: z.ZodString;
        stdoutTruncated: z.ZodBoolean;
        stderrTruncated: z.ZodBoolean;
    }, z.core.$strict>>;
    cleanStart: z.ZodBoolean;
    sourceTreeBefore: z.ZodString;
    sourceTreeAfter: z.ZodString;
    artifacts: z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        mediaType: z.ZodString;
        bytes: z.ZodNumber;
        digest: z.ZodString;
    }, z.core.$strict>>;
}, z.core.$strict>;
export declare const qaReceiptSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    id: z.ZodString;
    criteria: z.ZodArray<z.ZodString>;
    evidenceKinds: z.ZodArray<z.ZodEnum<{
        browser: "browser";
        human: "human";
        review: "review";
        screenshot: "screenshot";
        test: "test";
    }>>;
    summary: z.ZodString;
    passed: z.ZodBoolean;
    startedAt: z.ZodString;
    completedAt: z.ZodString;
    digest: z.ZodString;
    kind: z.ZodLiteral<"qa">;
    testSelection: z.ZodOptional<z.ZodObject<{
        method: z.ZodString;
        files: z.ZodArray<z.ZodObject<{
            path: z.ZodString;
            reasons: z.ZodArray<z.ZodString>;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
    provenance: z.ZodObject<{
        repositoryId: z.ZodString;
        feature: z.ZodString;
        specRevision: z.ZodNumber;
        specDigest: z.ZodString;
        treeDigest: z.ZodString;
        policyDigest: z.ZodString;
        workflowRevision: z.ZodNumber;
        gitCommit: z.ZodString;
        scope: z.ZodOptional<z.ZodArray<z.ZodString>>;
        scopeDigest: z.ZodOptional<z.ZodString>;
        scopeSource: z.ZodOptional<z.ZodLiteral<"workspace">>;
        scopeUnresolved: z.ZodOptional<z.ZodString>;
        textTreeDigest: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>;
    matrixDigest: z.ZodString;
    check: z.ZodObject<{
        id: z.ZodString;
        kind: z.ZodEnum<{
            "adapter-contract": "adapter-contract";
            "clean-clone": "clean-clone";
            "cross-platform": "cross-platform";
            "end-to-end": "end-to-end";
            "fault-injection": "fault-injection";
            "fresh-context": "fresh-context";
            "full-ci": "full-ci";
            integration: "integration";
            "live-acceptance": "live-acceptance";
            "package-consumer": "package-consumer";
            unit: "unit";
        }>;
    }, z.core.$strict>;
    coveredChecks: z.ZodArray<z.ZodEnum<{
        "adapter-contract": "adapter-contract";
        "clean-clone": "clean-clone";
        "cross-platform": "cross-platform";
        "end-to-end": "end-to-end";
        "fault-injection": "fault-injection";
        "fresh-context": "fresh-context";
        "full-ci": "full-ci";
        integration: "integration";
        "live-acceptance": "live-acceptance";
        "package-consumer": "package-consumer";
        unit: "unit";
    }>>;
    platform: z.ZodObject<{
        os: z.ZodString;
        arch: z.ZodString;
        node: z.ZodString;
        bun: z.ZodNullable<z.ZodString>;
    }, z.core.$strict>;
    attempts: z.ZodArray<z.ZodObject<{
        number: z.ZodNumber;
        outcome: z.ZodEnum<{
            cancelled: "cancelled";
            failed: "failed";
            "missing-environment": "missing-environment";
            passed: "passed";
            skipped: "skipped";
            "timed-out": "timed-out";
            unsupported: "unsupported";
        }>;
        summary: z.ZodString;
        startedAt: z.ZodString;
        completedAt: z.ZodString;
        durationMs: z.ZodNumber;
        collector: z.ZodNullable<z.ZodString>;
        command: z.ZodNullable<z.ZodObject<{
            executableDigest: z.ZodOptional<z.ZodString>;
            runtimeDigest: z.ZodOptional<z.ZodString>;
            argv: z.ZodArray<z.ZodString>;
            cwd: z.ZodString;
            timeoutMs: z.ZodNumber;
            maxOutputBytes: z.ZodNumber;
            environmentKeys: z.ZodArray<z.ZodString>;
        }, z.core.$strict>>;
        result: z.ZodNullable<z.ZodObject<{
            exitCode: z.ZodNullable<z.ZodNumber>;
            signal: z.ZodNullable<z.ZodString>;
            timedOut: z.ZodBoolean;
            stdoutDigest: z.ZodString;
            stderrDigest: z.ZodString;
            stdoutTail: z.ZodString;
            stderrTail: z.ZodString;
            stdoutTruncated: z.ZodBoolean;
            stderrTruncated: z.ZodBoolean;
        }, z.core.$strict>>;
        cleanStart: z.ZodBoolean;
        sourceTreeBefore: z.ZodString;
        sourceTreeAfter: z.ZodString;
        artifacts: z.ZodArray<z.ZodObject<{
            path: z.ZodString;
            mediaType: z.ZodString;
            bytes: z.ZodNumber;
            digest: z.ZodString;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
    anomalies: z.ZodArray<z.ZodString>;
}, z.core.$strict>;
export declare const collectedReceiptSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    id: z.ZodString;
    criteria: z.ZodArray<z.ZodString>;
    evidenceKinds: z.ZodArray<z.ZodEnum<{
        browser: "browser";
        human: "human";
        review: "review";
        screenshot: "screenshot";
        test: "test";
    }>>;
    summary: z.ZodString;
    passed: z.ZodBoolean;
    startedAt: z.ZodString;
    completedAt: z.ZodString;
    provenance: z.ZodObject<{
        repositoryId: z.ZodString;
        feature: z.ZodString;
        specRevision: z.ZodNumber;
        specDigest: z.ZodString;
        treeDigest: z.ZodString;
        policyDigest: z.ZodString;
    }, z.core.$strict>;
    digest: z.ZodString;
    kind: z.ZodLiteral<"collected">;
    collector: z.ZodString;
    artifacts: z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        mediaType: z.ZodString;
        bytes: z.ZodNumber;
        digest: z.ZodString;
    }, z.core.$strict>>;
}, z.core.$strict>;
/**
 * Passing GitHub required-check proof for one exact pushed commit. Only
 * explicitly copied facts are persisted; no response body, header or
 * credential has a field here, and only passing proof is ever written.
 */
export declare const remoteChecksReceiptSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    id: z.ZodString;
    criteria: z.ZodArray<z.ZodString>;
    evidenceKinds: z.ZodArray<z.ZodEnum<{
        browser: "browser";
        human: "human";
        review: "review";
        screenshot: "screenshot";
        test: "test";
    }>>;
    summary: z.ZodString;
    passed: z.ZodBoolean;
    startedAt: z.ZodString;
    completedAt: z.ZodString;
    digest: z.ZodString;
    kind: z.ZodLiteral<"remote-checks">;
    provenance: z.ZodObject<{
        repositoryId: z.ZodString;
        feature: z.ZodString;
        specRevision: z.ZodNumber;
        specDigest: z.ZodString;
        treeDigest: z.ZodString;
        policyDigest: z.ZodString;
        workflowRevision: z.ZodNumber;
        gitCommit: z.ZodString;
    }, z.core.$strict>;
    githubRepository: z.ZodString;
    gate: z.ZodEnum<{
        deliver: "deliver";
        integrate: "integrate";
    }>;
    matrixDigest: z.ZodString;
    fullCi: z.ZodObject<{
        commandId: z.ZodString;
        argvDigest: z.ZodString;
    }, z.core.$strict>;
    targetBranch: z.ZodString;
    targetBranchSource: z.ZodEnum<{
        authorization: "authorization";
        "integration-target": "integration-target";
    }>;
    targetBaseCommit: z.ZodString;
    mergeBaseCommit: z.ZodString;
    remoteHead: z.ZodString;
    requiredSet: z.ZodObject<{
        requirements: z.ZodArray<z.ZodObject<{
            context: z.ZodString;
            appId: z.ZodNumber;
            source: z.ZodEnum<{
                "branch-protection": "branch-protection";
                ruleset: "ruleset";
            }>;
        }, z.core.$strict>>;
    }, z.core.$strict>;
    checks: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        appId: z.ZodNumber;
        appSlug: z.ZodString;
        checkSuiteId: z.ZodString;
        runId: z.ZodString;
        headSha: z.ZodString;
        workflowRunId: z.ZodNullable<z.ZodString>;
        runAttempt: z.ZodNullable<z.ZodNumber>;
        status: z.ZodLiteral<"completed">;
        conclusion: z.ZodLiteral<"success">;
    }, z.core.$strict>>;
    observedAt: z.ZodString;
}, z.core.$strict>;
export declare const evidenceReceiptSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    id: z.ZodString;
    criteria: z.ZodArray<z.ZodString>;
    evidenceKinds: z.ZodArray<z.ZodEnum<{
        browser: "browser";
        human: "human";
        review: "review";
        screenshot: "screenshot";
        test: "test";
    }>>;
    summary: z.ZodString;
    passed: z.ZodBoolean;
    startedAt: z.ZodString;
    completedAt: z.ZodString;
    provenance: z.ZodObject<{
        repositoryId: z.ZodString;
        feature: z.ZodString;
        specRevision: z.ZodNumber;
        specDigest: z.ZodString;
        treeDigest: z.ZodString;
        policyDigest: z.ZodString;
    }, z.core.$strict>;
    digest: z.ZodString;
    kind: z.ZodLiteral<"executed">;
    command: z.ZodObject<{
        argv: z.ZodArray<z.ZodString>;
        cwd: z.ZodString;
        timeoutMs: z.ZodNumber;
        maxOutputBytes: z.ZodNumber;
        environmentKeys: z.ZodDefault<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>;
    result: z.ZodObject<{
        exitCode: z.ZodNullable<z.ZodNumber>;
        signal: z.ZodNullable<z.ZodString>;
        timedOut: z.ZodBoolean;
        stdoutDigest: z.ZodString;
        stderrDigest: z.ZodString;
        stdoutTail: z.ZodString;
        stderrTail: z.ZodString;
        stdoutTruncated: z.ZodBoolean;
        stderrTruncated: z.ZodBoolean;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    id: z.ZodString;
    criteria: z.ZodArray<z.ZodString>;
    evidenceKinds: z.ZodArray<z.ZodEnum<{
        browser: "browser";
        human: "human";
        review: "review";
        screenshot: "screenshot";
        test: "test";
    }>>;
    summary: z.ZodString;
    passed: z.ZodBoolean;
    startedAt: z.ZodString;
    completedAt: z.ZodString;
    provenance: z.ZodObject<{
        repositoryId: z.ZodString;
        feature: z.ZodString;
        specRevision: z.ZodNumber;
        specDigest: z.ZodString;
        treeDigest: z.ZodString;
        policyDigest: z.ZodString;
    }, z.core.$strict>;
    digest: z.ZodString;
    kind: z.ZodLiteral<"collected">;
    collector: z.ZodString;
    artifacts: z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        mediaType: z.ZodString;
        bytes: z.ZodNumber;
        digest: z.ZodString;
    }, z.core.$strict>>;
}, z.core.$strict>, z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    id: z.ZodString;
    criteria: z.ZodArray<z.ZodString>;
    evidenceKinds: z.ZodArray<z.ZodEnum<{
        browser: "browser";
        human: "human";
        review: "review";
        screenshot: "screenshot";
        test: "test";
    }>>;
    summary: z.ZodString;
    passed: z.ZodBoolean;
    startedAt: z.ZodString;
    completedAt: z.ZodString;
    digest: z.ZodString;
    kind: z.ZodLiteral<"qa">;
    testSelection: z.ZodOptional<z.ZodObject<{
        method: z.ZodString;
        files: z.ZodArray<z.ZodObject<{
            path: z.ZodString;
            reasons: z.ZodArray<z.ZodString>;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
    provenance: z.ZodObject<{
        repositoryId: z.ZodString;
        feature: z.ZodString;
        specRevision: z.ZodNumber;
        specDigest: z.ZodString;
        treeDigest: z.ZodString;
        policyDigest: z.ZodString;
        workflowRevision: z.ZodNumber;
        gitCommit: z.ZodString;
        scope: z.ZodOptional<z.ZodArray<z.ZodString>>;
        scopeDigest: z.ZodOptional<z.ZodString>;
        scopeSource: z.ZodOptional<z.ZodLiteral<"workspace">>;
        scopeUnresolved: z.ZodOptional<z.ZodString>;
        textTreeDigest: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>;
    matrixDigest: z.ZodString;
    check: z.ZodObject<{
        id: z.ZodString;
        kind: z.ZodEnum<{
            "adapter-contract": "adapter-contract";
            "clean-clone": "clean-clone";
            "cross-platform": "cross-platform";
            "end-to-end": "end-to-end";
            "fault-injection": "fault-injection";
            "fresh-context": "fresh-context";
            "full-ci": "full-ci";
            integration: "integration";
            "live-acceptance": "live-acceptance";
            "package-consumer": "package-consumer";
            unit: "unit";
        }>;
    }, z.core.$strict>;
    coveredChecks: z.ZodArray<z.ZodEnum<{
        "adapter-contract": "adapter-contract";
        "clean-clone": "clean-clone";
        "cross-platform": "cross-platform";
        "end-to-end": "end-to-end";
        "fault-injection": "fault-injection";
        "fresh-context": "fresh-context";
        "full-ci": "full-ci";
        integration: "integration";
        "live-acceptance": "live-acceptance";
        "package-consumer": "package-consumer";
        unit: "unit";
    }>>;
    platform: z.ZodObject<{
        os: z.ZodString;
        arch: z.ZodString;
        node: z.ZodString;
        bun: z.ZodNullable<z.ZodString>;
    }, z.core.$strict>;
    attempts: z.ZodArray<z.ZodObject<{
        number: z.ZodNumber;
        outcome: z.ZodEnum<{
            cancelled: "cancelled";
            failed: "failed";
            "missing-environment": "missing-environment";
            passed: "passed";
            skipped: "skipped";
            "timed-out": "timed-out";
            unsupported: "unsupported";
        }>;
        summary: z.ZodString;
        startedAt: z.ZodString;
        completedAt: z.ZodString;
        durationMs: z.ZodNumber;
        collector: z.ZodNullable<z.ZodString>;
        command: z.ZodNullable<z.ZodObject<{
            executableDigest: z.ZodOptional<z.ZodString>;
            runtimeDigest: z.ZodOptional<z.ZodString>;
            argv: z.ZodArray<z.ZodString>;
            cwd: z.ZodString;
            timeoutMs: z.ZodNumber;
            maxOutputBytes: z.ZodNumber;
            environmentKeys: z.ZodArray<z.ZodString>;
        }, z.core.$strict>>;
        result: z.ZodNullable<z.ZodObject<{
            exitCode: z.ZodNullable<z.ZodNumber>;
            signal: z.ZodNullable<z.ZodString>;
            timedOut: z.ZodBoolean;
            stdoutDigest: z.ZodString;
            stderrDigest: z.ZodString;
            stdoutTail: z.ZodString;
            stderrTail: z.ZodString;
            stdoutTruncated: z.ZodBoolean;
            stderrTruncated: z.ZodBoolean;
        }, z.core.$strict>>;
        cleanStart: z.ZodBoolean;
        sourceTreeBefore: z.ZodString;
        sourceTreeAfter: z.ZodString;
        artifacts: z.ZodArray<z.ZodObject<{
            path: z.ZodString;
            mediaType: z.ZodString;
            bytes: z.ZodNumber;
            digest: z.ZodString;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
    anomalies: z.ZodArray<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    id: z.ZodString;
    criteria: z.ZodArray<z.ZodString>;
    evidenceKinds: z.ZodArray<z.ZodEnum<{
        browser: "browser";
        human: "human";
        review: "review";
        screenshot: "screenshot";
        test: "test";
    }>>;
    summary: z.ZodString;
    passed: z.ZodBoolean;
    startedAt: z.ZodString;
    completedAt: z.ZodString;
    digest: z.ZodString;
    kind: z.ZodLiteral<"remote-checks">;
    provenance: z.ZodObject<{
        repositoryId: z.ZodString;
        feature: z.ZodString;
        specRevision: z.ZodNumber;
        specDigest: z.ZodString;
        treeDigest: z.ZodString;
        policyDigest: z.ZodString;
        workflowRevision: z.ZodNumber;
        gitCommit: z.ZodString;
    }, z.core.$strict>;
    githubRepository: z.ZodString;
    gate: z.ZodEnum<{
        deliver: "deliver";
        integrate: "integrate";
    }>;
    matrixDigest: z.ZodString;
    fullCi: z.ZodObject<{
        commandId: z.ZodString;
        argvDigest: z.ZodString;
    }, z.core.$strict>;
    targetBranch: z.ZodString;
    targetBranchSource: z.ZodEnum<{
        authorization: "authorization";
        "integration-target": "integration-target";
    }>;
    targetBaseCommit: z.ZodString;
    mergeBaseCommit: z.ZodString;
    remoteHead: z.ZodString;
    requiredSet: z.ZodObject<{
        requirements: z.ZodArray<z.ZodObject<{
            context: z.ZodString;
            appId: z.ZodNumber;
            source: z.ZodEnum<{
                "branch-protection": "branch-protection";
                ruleset: "ruleset";
            }>;
        }, z.core.$strict>>;
    }, z.core.$strict>;
    checks: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        appId: z.ZodNumber;
        appSlug: z.ZodString;
        checkSuiteId: z.ZodString;
        runId: z.ZodString;
        headSha: z.ZodString;
        workflowRunId: z.ZodNullable<z.ZodString>;
        runAttempt: z.ZodNullable<z.ZodNumber>;
        status: z.ZodLiteral<"completed">;
        conclusion: z.ZodLiteral<"success">;
    }, z.core.$strict>>;
    observedAt: z.ZodString;
}, z.core.$strict>], "kind">;
export type ExecutedReceipt = z.infer<typeof executedReceiptSchema>;
export type CollectedReceipt = z.infer<typeof collectedReceiptSchema>;
export type QaAttempt = z.infer<typeof qaAttemptSchema>;
export type QaReceipt = z.infer<typeof qaReceiptSchema>;
export type RemoteChecksReceipt = z.infer<typeof remoteChecksReceiptSchema>;
export type EvidenceReceipt = z.infer<typeof evidenceReceiptSchema>;
export declare function verifyReceiptDigest(receipt: EvidenceReceipt): void;
export {};
