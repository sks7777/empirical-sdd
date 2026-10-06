export declare function mockupDirectory(feature: string): string;
export interface MockupPreview {
    /** Origin to open, always on loopback. */
    url: string;
    port: number;
    /** Resolves when the server stops, whether by close or by the lifetime bound. */
    finished: Promise<"closed" | "expired">;
    /** Absolute directory being served, with links resolved. */
    servedPath: string;
    /** Idempotent. Safe to call from a failure path. */
    close(): Promise<void>;
}
export interface MockupPreviewOptions {
    /** Upper bound on how long the preview may stay up. */
    maxLifetimeMs?: number;
}
/**
 * Serve one mockup directory on an ephemeral loopback port.
 *
 * The caller owns teardown. Every path that starts a server must stop it,
 * including on failure: a leaked preview holding a port is a recurring class of
 * bug, so `close` is idempotent, destroys open sockets rather than waiting for
 * keep-alive to lapse, and a lifetime bound closes the server even if a caller
 * forgets entirely.
 */
export declare function startMockupPreview(directory: string, options?: MockupPreviewOptions): Promise<MockupPreview>;
