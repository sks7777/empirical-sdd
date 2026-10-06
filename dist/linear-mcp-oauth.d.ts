import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { type OAuthClientProvider } from "@modelcontextprotocol/sdk/client/auth.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import type { TrackerOAuthResolver } from "./types.js";
export declare const LINEAR_REMOTE_MCP_URL = "https://mcp.linear.app/mcp";
export interface LinearMcpOAuthAccess {
    accessToken: string;
    expiresAt: number;
}
export interface LinearMcpOAuthSession {
    authorizationUrl(): Promise<URL | null>;
    access(): Promise<LinearMcpOAuthAccess>;
    close(): Promise<void>;
}
export interface LinearMcpOAuthResolverOptions {
    sessionFactory?: () => Promise<LinearMcpOAuthSession>;
    now?: () => number;
    remoteStepTimeoutMs?: number;
}
export type LinearMcpClientFactory = (provider: OAuthClientProvider) => {
    client: Client;
    transport: StreamableHTTPClientTransport;
};
export interface LinearSdkOAuthSessionOptions {
    clientFactory?: LinearMcpClientFactory;
    redirectTimeoutMs?: number;
    authorizationTimeoutMs?: number;
    remoteStepTimeoutMs?: number;
}
export declare function createLinearMcpOAuthResolver(options?: LinearMcpOAuthResolverOptions): TrackerOAuthResolver;
export declare class LinearSdkOAuthSession implements LinearMcpOAuthSession {
    private readonly callbackServer;
    private readonly clientFactory;
    private readonly redirectTimeoutMs;
    private readonly authorizationTimeoutMs;
    private readonly remoteStepTimeoutMs;
    private readonly provider;
    private state;
    private redirect;
    private code;
    private pending;
    private closed;
    private constructor();
    static create(options?: LinearSdkOAuthSessionOptions): Promise<LinearSdkOAuthSession>;
    authorizationUrl(): Promise<URL | null>;
    access(): Promise<LinearMcpOAuthAccess>;
    close(): Promise<void>;
    private resetAttempt;
    private createClient;
    private receiveCallback;
    private assertOpen;
}
