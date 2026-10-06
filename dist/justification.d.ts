/**
 * Bounded public justification text.
 *
 * Every recorded override in Empirical is authorized by a written reason rather
 * than by a suppression flag, so the reason is part of the durable record and
 * must stay safe to publish: single-line, bounded, and free of anything that
 * looks like a credential.
 */
export declare const JUSTIFICATION_MIN_LENGTH = 20;
export declare const JUSTIFICATION_MAX_LENGTH = 500;
/**
 * Throws unless `value` is already-trimmed public text of bounded length.
 * `subject` names the field in the thrown message, so each caller keeps its own
 * wording while sharing one rule.
 */
export declare function assertBoundedJustification(value: string, subject: string): string;
