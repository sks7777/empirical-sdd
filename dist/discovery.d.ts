import type { FeatureStartResult } from "./types.js";
export declare const DISCOVERY_SCHEMA_VERSION: 1;
export type DiscoveryPassId = "problem" | "outcome" | "boundaries" | "risks" | "verification";
export type DiscoveryStatus = "draft" | "approved" | "started";
export type DiscoveryWorkflow = "fast" | "complex";
export declare const DISCOVERY_PASS_ORDER: readonly DiscoveryPassId[];
export interface SocraticQuestion {
    pass: DiscoveryPassId;
    title: string;
    question: string;
}
export interface SocraticPrompt extends SocraticQuestion {
    kind: "pass" | "follow_up";
}
export interface SocraticAnswer {
    pass: DiscoveryPassId;
    title: string;
    question: string;
    answer: string;
    followUp: {
        question: string;
        answer: string;
    } | null;
}
export interface DiscoveryRecord {
    schemaVersion: typeof DISCOVERY_SCHEMA_VERSION;
    id: string;
    problem: string;
    status: DiscoveryStatus;
    answers: SocraticAnswer[];
    refinedRequest: string | null;
    approvedAt: string | null;
    workflow: DiscoveryWorkflow | null;
    handoff: {
        feature: string;
        revision: number;
    } | null;
    createdAt: string;
    updatedAt: string;
}
export interface DiscoveryPaths {
    directory: string;
    json: string;
    markdown: string;
}
export interface DiscoverySubmission {
    id?: string;
    problem: string;
    answers: SocraticAnswer[];
    approved?: true;
}
export interface DiscoverySubmissionResult {
    record: DiscoveryRecord;
    paths: DiscoveryPaths;
    refinedRequest: string | null;
    nextQuestion: SocraticPrompt | null;
    start: FeatureStartResult | null;
}
export declare function createDiscoveryRecord(problem: string, now?: Date): DiscoveryRecord;
export declare function socraticQuestions(problem: string, priorContext?: string): SocraticQuestion[];
export declare function materialFollowUp(problem: string, question: SocraticQuestion, answer: string): string | null;
export declare function buildRefinedRequest(problem: string, answers: SocraticAnswer[]): string;
export declare function validateSocraticAnswers(answers: SocraticAnswer[], options?: {
    complete?: boolean;
}): SocraticAnswer[];
export declare function validateMaterialFollowUps(problem: string, answers: SocraticAnswer[], options?: {
    complete?: boolean;
}): void;
export declare function nextSocraticPrompt(problem: string, answers: SocraticAnswer[]): SocraticPrompt | null;
export declare function recommendWorkflow(problem: string, answers: SocraticAnswer[]): DiscoveryWorkflow;
export declare function saveDiscovery(root: string, record: DiscoveryRecord): Promise<DiscoveryPaths>;
export declare function loadDiscovery(root: string, id: string): Promise<DiscoveryRecord>;
export declare function renderDiscoveryMarkdown(record: DiscoveryRecord): string;
