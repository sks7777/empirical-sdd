import { type ActivationMode } from "./activation.js";
import { type AgentSkillTargetId } from "./agent-catalog.js";
import { SKILLS } from "./operations.js";
import type { IntegrationReport, ProjectActivationSurface, ProjectActivationSurfaceState, RuntimeActivationGuidance } from "./types.js";
type GlobalSkillPrecedence = "coexists" | "global" | "project" | "unverified";
interface ProjectActivationRuntimeDefinition extends RuntimeActivationGuidance {
    instructionPath: "AGENTS.md" | "CLAUDE.md" | "GEMINI.md";
    skillPath: string;
    instructionScope: "hierarchical" | "root";
    globalSkillPaths: readonly string[];
    globalPrecedence: GlobalSkillPrecedence;
}
export declare const PROJECT_ACTIVATION_RUNTIMES: readonly ProjectActivationRuntimeDefinition[];
type RegistrySkillId = typeof SKILLS[number]["id"];
export declare const EMPIRICAL_AGENT_SKILLS: readonly {
    name: string;
    description: string;
    content: string;
    artifacts: {
        path: string;
        content: string;
    }[];
}[];
export type EmpiricalAgentSkill = typeof EMPIRICAL_AGENT_SKILLS[number];
export type EmpiricalAgentSkillName = RegistrySkillId;
export declare const EMPIRICAL_AGENT_SKILL_NAMES: readonly EmpiricalAgentSkillName[];
export interface ProjectIntegrationInspection {
    root: string;
    invocationPath: string;
    artifactReadiness: "current" | "blocked";
    runtimeLoad: "unverified";
    activationMode: ActivationMode;
    runtimeGuidance: RuntimeActivationGuidance[];
    surfaces: ProjectActivationSurface[];
    nonCanonical: string[];
    shadowing: string[];
    collisions: string[];
    /** Compatibility alias for artifactReadiness === "current"; not proof of host load. */
    ready: boolean;
    required: string[];
    missing: string[];
    drifted: string[];
}
export interface ProjectIntegrationInspectionOptions {
    invocationPath?: string;
    homeRoot?: string | null;
}
interface ProjectActivationClassification {
    state: ProjectActivationSurfaceState;
    detail: string | null;
}
export interface InstallGlobalAgentSkillsOptions {
    all?: boolean;
    agents?: readonly string[];
    pathValue?: string;
}
export declare function managedGlobalAgentIds(homeRoot?: string): Promise<AgentSkillTargetId[]>;
export declare function installedGlobalAgentIds(homeRoot?: string): Promise<AgentSkillTargetId[]>;
export declare function installProjectIntegrations(rootInput: string): Promise<IntegrationReport>;
export declare function inspectProjectIntegrations(rootInput: string, options?: ProjectIntegrationInspectionOptions): Promise<ProjectIntegrationInspection>;
export declare function installGlobalAgentSkills(homeRoot?: string, options?: InstallGlobalAgentSkillsOptions): Promise<IntegrationReport>;
export declare function uninstallGlobalAgentSkills(homeRoot?: string): Promise<IntegrationReport>;
/**
 * Classifies `.codex/config.toml` by what Codex reads: `mcp_servers.empirical`
 * with the Empirical command and arguments. Comments, markers, other servers
 * and extra keys under the table do not matter, because Codex drops comments
 * whenever it rewrites the file.
 */
export declare function inspectCodexBridge(contents: string): ProjectActivationClassification;
export {};
