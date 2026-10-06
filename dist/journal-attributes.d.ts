/**
 * Declare the journal rule in the repository's `.gitattributes`.
 *
 * Appends rather than rewrites: the file belongs to the repository, and an
 * existing rule for `.empirical` is left exactly as the project wrote it.
 * Returns whether anything was written.
 */
export declare function ensureJournalAttributes(root: string): Promise<boolean>;
