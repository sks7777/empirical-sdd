export declare const CONFIGURATION_GUIDE = "https://github.com/goempirical/empirical-sdd/blob/develop/docs/configuration.md";
export interface ConfigurationOption {
    file: "config" | "policy";
    path: string;
    default: string | number | boolean | null;
    options: string;
    edit: string;
}
/** Public option metadata only. It never contains environment or credential values. */
export declare const CONFIGURATION_OPTIONS: readonly ConfigurationOption[];
export interface ConfigurationReport {
    guide: string;
    options: readonly ConfigurationOption[];
    effective: Array<{
        file: string;
        path: string;
        value: unknown;
        source: string;
    }>;
    issues: string[];
}
export declare function inspectConfiguration(root: string): Promise<ConfigurationReport>;
export declare function renderConfiguration(report: ConfigurationReport): string;
