import type { ReadStream, WriteStream } from "node:tty";
import type { AgentSkillTargetId } from "./agent-catalog.js";
export interface AgentSelectorItem {
    id: AgentSkillTargetId;
    label: string;
    aliases: readonly string[];
    destination: string;
    detected: boolean;
    managed: boolean;
    remembered?: boolean;
}
export interface AgentSelectorState {
    cursor: number;
    query: string;
    selected: Set<AgentSkillTargetId>;
    error: string | null;
}
export type SelectorKey = "up" | "down" | "toggle" | "backspace" | "submit" | {
    type: "input";
    value: string;
};
export interface AgentSelectorRenderOptions {
    columns?: number;
    visibleRows?: number;
}
export declare function createSelectorState(items: AgentSelectorItem[], initiallySelected: Iterable<AgentSkillTargetId>): AgentSelectorState;
export declare function orderedAgentSelectorItems(items: AgentSelectorItem[]): AgentSelectorItem[];
export declare function filterAgentSelectorItems(items: AgentSelectorItem[], query: string): AgentSelectorItem[];
export declare function reduceSelector(state: AgentSelectorState, key: SelectorKey, items: AgentSelectorItem[]): AgentSelectorState;
export declare function selectorViewport(items: AgentSelectorItem[], state: AgentSelectorState, visibleRows?: number): {
    items: AgentSelectorItem[];
    start: number;
    hiddenAbove: number;
    hiddenBelow: number;
};
export declare function renderAgentSelector(items: AgentSelectorItem[], state: AgentSelectorState, options?: AgentSelectorRenderOptions | number): string;
export declare function selectAgentsInteractive(items: AgentSelectorItem[], initiallySelected: Iterable<AgentSkillTargetId>, input?: ReadStream, output?: WriteStream): Promise<AgentSkillTargetId[]>;
