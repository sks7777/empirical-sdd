import type { TrackerSetupState } from "./tracking.js";
import type { ProjectConfig, ProjectConfigurationInput, TrackerPolicy } from "./types.js";
import { type BotReviewReadinessOptions } from "./review.js";
import type { BotReviewReadiness } from "./types.js";
export type SetupSettings = Pick<ProjectConfig, "activationMode" | "evidence" | "isolation" | "decisions" | "interaction" | "review" | "mockupsBeforeCoding">;
export declare function recommendedSetupSettings(): SetupSettings;
export declare function setupSettingsFromConfig(config: ProjectConfig): SetupSettings;
export declare function setupConfigurationInput(settings: SetupSettings): ProjectConfigurationInput;
export declare function diagnoseReviewSetup(settings: SetupSettings, options: Omit<BotReviewReadinessOptions, "config">): Promise<BotReviewReadiness | null>;
export declare function validateSetupSettings(settings: SetupSettings): void;
export declare function renderSetupSummary(settings: SetupSettings, options?: {
    current: boolean;
    effective?: boolean;
    resolvedBase?: string;
    tracker?: TrackerPolicy | null;
    trackerSetup?: TrackerSetupState;
}): string;
