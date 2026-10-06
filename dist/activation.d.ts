import { z } from "zod";
export declare const activationModeSchema: z.ZodEnum<{
    automatic: "automatic";
    explicit: "explicit";
}>;
export type ActivationMode = z.infer<typeof activationModeSchema>;
/** Absence is not consent to automatically route a team's work. */
export declare function resolveActivationMode(value: unknown): ActivationMode;
