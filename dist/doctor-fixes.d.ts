import type { JsonValue } from "./protocol.js";
/**
 * How a Doctor finding is resolved:
 * - `safe` rewrites only Empirical-owned generated files (no work, journal or provider);
 * - `confirm` changes durable state and is applied only inside an approved plan;
 * - `decision` needs the user to choose one option (and supply its inputs);
 * - `none` has no automated resolution; the remediation text is the guidance.
 */
export type DoctorFixKind = "safe" | "confirm" | "decision" | "none";
export interface DoctorFixAction {
    /** Stable option id within the fix, e.g. `attach` or `waive`. */
    id: string;
    /** The operation id (see OPERATIONS) that performs the fix. */
    operation: string;
    arguments: Record<string, JsonValue>;
    /** Fields the user must supply before this option can run. */
    inputs: string[];
    /** Whether `doctor-fix` can run it; otherwise the agent calls `operation` with the user. */
    executable: boolean;
    label: string;
}
export interface DoctorFix {
    kind: DoctorFixKind;
    summary: string;
    actions: DoctorFixAction[];
}
interface FixTarget {
    code: string;
    scope: string;
    severity: "ok" | "info" | "warning" | "error";
    remediation: string | null;
}
/** Every warning/error code Doctor may emit must be classified here (enforced by a test). */
export declare const CLASSIFIED_DOCTOR_CODES: ReadonlySet<string>;
/** Attach a structured fix to every warning/error finding, reading only local state. */
export declare function attachDoctorFixes<T extends FixTarget>(root: string, findings: T[]): Promise<Array<T & {
    fix: DoctorFix | null;
}>>;
export {};
