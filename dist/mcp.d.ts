import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ReviewOperationDependencies } from "./review.js";
import type { PromotionProofDependencies } from "./promotion-proof.js";
import { type TrackerDependencies } from "./types.js";
export interface EmpiricalMcpServerOptions {
    /** Trusted host-only tracker dependencies, including an optional OAuth resolver. */
    trackerDependencies?: TrackerDependencies;
    /** Trusted host-only review dependencies; credentials remain outside tool inputs/results. */
    reviewDependencies?: ReviewOperationDependencies;
    /** Trusted host-only remote-proof dependencies, such as an injected GitHub checks reader. */
    promotionProofDependencies?: PromotionProofDependencies;
}
export declare function createMcpServer(defaultRoot?: string, options?: EmpiricalMcpServerOptions): McpServer;
export declare function runMcpServer(defaultRoot?: string, options?: EmpiricalMcpServerOptions): Promise<void>;
export declare function standaloneMcpServerOptions(options?: EmpiricalMcpServerOptions): EmpiricalMcpServerOptions;
