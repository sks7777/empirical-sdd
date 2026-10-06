/**
 * Orphan cleanup: the recorded way to remove the debris a wedged or abandoned
 * feature leaves behind.
 *
 * Every plan entry except a checkout recovery entry is gated on the Doctor
 * finding that reported it, so cleanup can never act on something the
 * read-only diagnostic did not see. A recovery entry has no Doctor finding: it
 * is forgotten only when no required-ticket policy could govern it, because
 * the required-ticket check releases it itself once sync or waiver is done.
 * Doctor itself stays read-only; it names this operation as remediation
 * rather than performing one.
 */
import { type DoctorReport } from "./doctor.js";
import type { CleanupClass, CleanupPlan, CleanupResult } from "./types.js";
export declare const CLEANUP_CLASSES: readonly CleanupClass[];
export declare function parseCleanupClasses(value: string): CleanupClass[];
/** Throws unless `path` is inside `root` and outside every protected segment. */
export declare function assertCleanupPathAllowed(path: string): void;
/**
 * Translate the current Doctor report into the exact prunable orphan plan.
 * Classes not named in `include` are never inspected, so there is no
 * "clean everything" path.
 */
export declare function buildCleanupPlan(rootInput: string, include: CleanupClass[], report?: DoctorReport): Promise<CleanupPlan>;
/** Apply a plan. Every entry is re-checked against the protected paths first. */
export declare function applyCleanupPlan(rootInput: string, plan: CleanupPlan): Promise<CleanupResult>;
