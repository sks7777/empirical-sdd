import type { TrackerProjection, TrackerProvider } from "./types.js";
export declare const TRACKER_MARKER_ORIGIN = "https://github.com/goempirical/empirical-sdd";
declare const COMMENT_PROPERTY = "empirical-sdd-effect";
export type TrackerMilestoneMarkerInspection = "absent" | "match" | "malformed";
export interface TrackerMilestoneAction {
    label: "Action needed" | "Blocker";
    text: string;
}
export interface TrackerMilestoneEvidence {
    label: string;
    url: string;
}
export interface TrackerMilestoneView {
    headline: string;
    work: string;
    summary: string | null;
    action: TrackerMilestoneAction | null;
    evidence: TrackerMilestoneEvidence[];
}
export interface MarkdownTrackerMilestone {
    provider: "github" | "linear" | "plane";
    body: string;
}
export interface JiraTrackerMilestone {
    provider: "jira";
    body: Record<string, unknown>;
    property: {
        key: typeof COMMENT_PROPERTY;
        value: string;
    };
}
export type TrackerMilestonePayload = MarkdownTrackerMilestone | JiraTrackerMilestone;
/** Build the provider payload for one already-committed tracker projection. */
export declare function renderTrackerMilestone(provider: TrackerProvider, projection: TrackerProjection, effectKey: string, folded?: readonly string[]): TrackerMilestonePayload;
/** Derive one provider-neutral, human-first milestone view. */
export declare function createTrackerMilestoneView(projection: TrackerProjection): TrackerMilestoneView;
/**
 * Classify only exact machine-owned marker representations. Expected-key text
 * in any partial or duplicated representation is malformed and must fail closed.
 */
export declare function inspectTrackerMilestoneMarker(provider: TrackerProvider, comment: {
    body?: unknown;
    properties?: unknown;
}, effectKey: string): TrackerMilestoneMarkerInspection;
/** Exact pre-change marker retained for recovery tests and compatibility. */
export declare function legacyTrackerMilestoneMarker(effectKey: string): string;
export declare function milestoneHeadline(projection: TrackerProjection): string;
export declare function safeEvidenceUrl(value: string | null): string | null;
export {};
