import { type ClosureRecords } from "./protocol.js";
import { ProjectStore } from "./storage.js";
/**
 * The folded records index of a merged feature, or null when nothing was
 * folded (no closure.json, or a v1 closure decision). A v2 file that fails
 * validation is never silently ignored.
 */
export declare function readClosureRecords(root: string | ProjectStore, feature: string): Promise<ClosureRecords | null>;
