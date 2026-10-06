import type { WorkRoute } from "./types.js";
export interface FlowRecordInput {
    feature: string;
    title: string;
    objective: string;
    scope: string[];
    tasks: Array<{
        id: string;
        text: string;
        done?: boolean;
    }>;
    progress?: string[];
    checks?: string[];
    nextStep?: string;
}
export declare function flowArtifacts(route: WorkRoute, feature: string, recoveryUseful?: boolean): string[];
export declare function renderFlowRecord(input: FlowRecordInput): string;
