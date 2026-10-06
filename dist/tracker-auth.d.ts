import type { ResolvedTrackerAuthentication, TrackerAuthenticationGuidance, TrackerDependencies, TrackerDiscoveryInput, TrackerOAuthAuthorization, TrackerPolicy, TrackerProvider } from "./types.js";
export declare const DEFAULT_TRACKER_CREDENTIAL_ENV: Readonly<{
    github: Readonly<{
        token: "GITHUB_TOKEN";
    }>;
    linear: Readonly<{
        apiKey: "LINEAR_SECRET_KEY";
    }>;
    jira: Readonly<{
        email: "JIRA_EMAIL";
        apiToken: "JIRA_API_TOKEN";
    }>;
    plane: Readonly<{
        apiKey: "PLANE_API_KEY";
    }>;
}>;
type AuthenticationSubject = TrackerPolicy | TrackerDiscoveryInput;
export declare function defaultTrackerCredentialEnv(provider: "github"): {
    token: string;
};
export declare function defaultTrackerCredentialEnv(provider: "linear"): {
    apiKey: string;
};
export declare function defaultTrackerCredentialEnv(provider: "jira"): {
    email: string;
    apiToken: string;
};
export declare function defaultTrackerCredentialEnv(provider: "plane"): {
    apiKey: string;
};
export declare function defaultTrackerCredentialEnv(provider: TrackerProvider): Record<string, string>;
export declare function trackerCredentialNames(subject: AuthenticationSubject): string[];
export declare function defaultTrackerSecretFilePath(dependencies?: TrackerDependencies): string;
export declare function trackerAuthenticationGuidance(subject: AuthenticationSubject | TrackerProvider, dependencies?: TrackerDependencies): TrackerAuthenticationGuidance;
export declare function trackerOAuthAuthorization(subject: AuthenticationSubject, dependencies?: TrackerDependencies): Promise<TrackerOAuthAuthorization | null>;
export declare function resolveTrackerAuthentication(subject: AuthenticationSubject, dependencies?: TrackerDependencies): Promise<ResolvedTrackerAuthentication>;
export {};
