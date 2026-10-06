import type { HarnessEndpoint, HarnessExploration, HarnessPhase, HarnessRoute, HarnessRouteDecision } from "./routing.js";
export type BenchmarkScenarioId = "small-scoped-edit" | "delegated-health-check" | "explicit-sdd-themes";
export interface BenchmarkAcceptance {
    route: HarnessRoute;
    delegation: HarnessRouteDecision["execution"]["delegation"];
    artifacts: HarnessRouteDecision["execution"]["artifacts"];
    endpoint: HarnessEndpoint;
    phases: readonly HarnessPhase[];
    allowedWorkflowArtifacts: readonly string[];
}
export interface BenchmarkScenario {
    id: BenchmarkScenarioId;
    feature: string;
    prompt: string;
    exploration: Readonly<HarnessExploration>;
    acceptance: BenchmarkAcceptance;
}
export declare const BENCHMARK_SCENARIOS: readonly BenchmarkScenario[];
export type CheckResult = "passed" | "failed" | "not-run";
export interface RunCheck {
    name: string;
    result: CheckResult;
    durationMs: number | null;
}
export interface RunMeasurements {
    wallTimeMs: number | null;
    harnessTimeMs: number | null;
    agentTimeMs: number | null;
    testTimeMs: number | null;
    approvalWaitMs: number | null;
    toolCalls: number | null;
}
export interface DelegationObservation {
    observed: boolean | null;
    workerCount: number | null;
}
export interface BenchmarkRunInput {
    scenario: BenchmarkScenario;
    flowTaken: HarnessRoute;
    changedFiles: string[];
    checks: RunCheck[];
    scopeCompliant: boolean | null;
    completionLevel: HarnessEndpoint | "none";
    delegation?: Partial<DelegationObservation>;
    measurements?: Partial<RunMeasurements>;
}
export interface BenchmarkRunReport {
    scenarioId: BenchmarkScenarioId;
    feature: string;
    prompt: string;
    harnessVersion: string;
    flowTaken: HarnessRoute;
    changedFiles: string[];
    checks: RunCheck[];
    scopeCompliant: boolean | null;
    completionLevel: HarnessEndpoint | "none";
    delegation: DelegationObservation;
    measurements: RunMeasurements;
}
export declare function scenarioById(id: BenchmarkScenarioId): BenchmarkScenario;
export declare function evaluateScenarioRouting(scenario: BenchmarkScenario): HarnessRouteDecision;
export declare function assertScenarioAcceptance(scenario: BenchmarkScenario, decision: HarnessRouteDecision): void;
export declare function buildBenchmarkRunReport(input: BenchmarkRunInput): BenchmarkRunReport;
export interface TimingSummary {
    sampleCount: number;
    medianMs: number;
    rangeMs: readonly [number, number];
}
export interface RoutingBenchmarkScenarioResult extends TimingSummary {
    scenarioId: BenchmarkScenarioId;
    prompt: string;
    route: HarnessRoute;
}
export interface RoutingBenchmarkReport {
    harnessVersion: string;
    samplesPerScenario: number;
    scenarios: RoutingBenchmarkScenarioResult[];
}
export interface RoutingBenchmarkOptions {
    samplesPerScenario?: number;
    now?: () => bigint;
}
export declare function benchmarkRouting(options?: RoutingBenchmarkOptions): RoutingBenchmarkReport;
export declare function summarizeTimings(samples: readonly number[]): TimingSummary;
