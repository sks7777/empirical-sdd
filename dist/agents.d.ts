import type { AgentHandoffOption, AgentIntegrationId, AgentLaunchCapability, DetectedAgent } from "./types.js";
export interface SupportedAgentDefinition {
    id: AgentIntegrationId;
    agent: string;
    executables: string[];
    skillSegments: string[];
    invocation: string;
    reload: string;
    capability: AgentLaunchCapability;
}
export declare const SUPPORTED_AGENTS: SupportedAgentDefinition[];
export interface AgentDetectionOptions {
    homeRoot?: string;
    pathValue?: string;
    includeAll?: boolean;
    includeConfigured?: boolean;
}
export declare function detectSupportedAgents(options?: AgentDetectionOptions): Promise<DetectedAgent[]>;
export declare function agentDefinition(id: AgentIntegrationId): SupportedAgentDefinition;
export declare function buildHandoffOption(input: {
    root: string;
    feature: string;
    specification: string;
    specDigest: string;
    agent: DetectedAgent;
}): AgentHandoffOption;
export declare function handoffToken(value: unknown): string;
