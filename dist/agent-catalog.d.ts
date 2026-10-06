export declare const AGENT_CATALOG_SOURCE: {
    readonly repository: "https://github.com/vercel-labs/skills";
    readonly version: "1.5.21";
    readonly commit: "7cb7db64dc1201052dea305e508a2fc490f7e5e2";
};
export interface AgentSkillTargetDefinition {
    id: string;
    label: string;
    globalSkillPath: string | null;
    detectPaths: readonly string[];
    aliases?: readonly string[];
    executables?: readonly string[];
    invocation?: string;
    reload?: string;
    projectMcp?: boolean;
    handoff?: boolean;
    exclusionReason?: string;
}
export declare const AGENT_SKILL_TARGETS: readonly [{
    readonly id: "aider-desk";
    readonly label: "AiderDesk";
    readonly globalSkillPath: ".aider-desk/skills";
    readonly detectPaths: readonly [".aider-desk"];
}, {
    readonly id: "amp";
    readonly label: "Amp";
    readonly globalSkillPath: ".config/agents/skills";
    readonly detectPaths: readonly [".config/amp"];
}, {
    readonly id: "antigravity";
    readonly label: "Antigravity";
    readonly globalSkillPath: ".gemini/antigravity/skills";
    readonly detectPaths: readonly [".gemini/antigravity"];
}, {
    readonly id: "antigravity-cli";
    readonly label: "Antigravity CLI";
    readonly globalSkillPath: ".gemini/antigravity-cli/skills";
    readonly detectPaths: readonly [".gemini/antigravity-cli"];
}, {
    readonly id: "astrbot";
    readonly label: "AstrBot";
    readonly globalSkillPath: ".astrbot/data/skills";
    readonly detectPaths: readonly [".astrbot"];
}, {
    readonly id: "autohand-code";
    readonly label: "Autohand Code CLI";
    readonly globalSkillPath: ".autohand/skills";
    readonly detectPaths: readonly [".autohand"];
}, {
    readonly id: "augment";
    readonly label: "Augment";
    readonly globalSkillPath: ".augment/skills";
    readonly detectPaths: readonly [".augment"];
}, {
    readonly id: "bob";
    readonly label: "IBM Bob";
    readonly globalSkillPath: ".bob/skills";
    readonly detectPaths: readonly [".bob"];
}, {
    readonly id: "claude-code";
    readonly label: "Claude Code";
    readonly globalSkillPath: ".claude/skills";
    readonly detectPaths: readonly [".claude"];
    readonly aliases: readonly ["claude"];
    readonly executables: readonly ["claude"];
    readonly invocation: "/empirical";
    readonly reload: "Restart Claude Code so it reloads the global Empirical Init skill, then invoke /empirical-init for repository setup or repair.";
    readonly projectMcp: true;
    readonly handoff: true;
}, {
    readonly id: "openclaw";
    readonly label: "OpenClaw";
    readonly globalSkillPath: ".openclaw/skills";
    readonly detectPaths: readonly [".openclaw", ".clawdbot", ".moltbot"];
}, {
    readonly id: "cline";
    readonly label: "Cline";
    readonly globalSkillPath: ".agents/skills";
    readonly detectPaths: readonly [".cline"];
}, {
    readonly id: "codearts-agent";
    readonly label: "CodeArts Agent";
    readonly globalSkillPath: ".codeartsdoer/skills";
    readonly detectPaths: readonly [".codeartsdoer"];
}, {
    readonly id: "codebuddy";
    readonly label: "CodeBuddy";
    readonly globalSkillPath: ".codebuddy/skills";
    readonly detectPaths: readonly [".codebuddy"];
}, {
    readonly id: "codemaker";
    readonly label: "Codemaker";
    readonly globalSkillPath: ".codemaker/skills";
    readonly detectPaths: readonly [".codemaker"];
}, {
    readonly id: "codestudio";
    readonly label: "Code Studio";
    readonly globalSkillPath: ".codestudio/skills";
    readonly detectPaths: readonly [".codestudio"];
}, {
    readonly id: "codex";
    readonly label: "Codex";
    readonly globalSkillPath: ".codex/skills";
    readonly detectPaths: readonly [".codex"];
    readonly executables: readonly ["codex"];
    readonly invocation: "$empirical";
    readonly reload: "Restart or reopen Codex so it rescans user skills, then invoke $empirical-init for repository setup or repair.";
    readonly projectMcp: true;
    readonly handoff: true;
}, {
    readonly id: "command-code";
    readonly label: "Command Code";
    readonly globalSkillPath: ".commandcode/skills";
    readonly detectPaths: readonly [".commandcode"];
}, {
    readonly id: "continue";
    readonly label: "Continue";
    readonly globalSkillPath: ".continue/skills";
    readonly detectPaths: readonly [".continue"];
}, {
    readonly id: "cortex";
    readonly label: "Cortex Code";
    readonly globalSkillPath: ".snowflake/cortex/skills";
    readonly detectPaths: readonly [".snowflake/cortex"];
}, {
    readonly id: "crush";
    readonly label: "Crush";
    readonly globalSkillPath: ".config/crush/skills";
    readonly detectPaths: readonly [".config/crush"];
}, {
    readonly id: "cursor";
    readonly label: "Cursor";
    readonly globalSkillPath: ".cursor/skills";
    readonly detectPaths: readonly [".cursor"];
    readonly executables: readonly ["cursor"];
    readonly invocation: "empirical";
    readonly reload: "Reload Cursor and open Agent chat; Cursor discovers the global Empirical skills.";
    readonly projectMcp: true;
    readonly handoff: true;
}, {
    readonly id: "deepagents";
    readonly label: "Deep Agents";
    readonly globalSkillPath: ".deepagents/agent/skills";
    readonly detectPaths: readonly [".deepagents"];
}, {
    readonly id: "devin";
    readonly label: "Devin for Terminal";
    readonly globalSkillPath: ".config/devin/skills";
    readonly detectPaths: readonly [".config/devin"];
}, {
    readonly id: "dexto";
    readonly label: "Dexto";
    readonly globalSkillPath: ".agents/skills";
    readonly detectPaths: readonly [".dexto"];
}, {
    readonly id: "droid";
    readonly label: "Droid";
    readonly globalSkillPath: ".factory/skills";
    readonly detectPaths: readonly [".factory"];
}, {
    readonly id: "eve";
    readonly label: "Eve";
    readonly globalSkillPath: null;
    readonly detectPaths: readonly [];
    readonly exclusionReason: "Eve supports project-local skills only.";
}, {
    readonly id: "firebender";
    readonly label: "Firebender";
    readonly globalSkillPath: ".firebender/skills";
    readonly detectPaths: readonly [".firebender"];
}, {
    readonly id: "forgecode";
    readonly label: "ForgeCode";
    readonly globalSkillPath: ".forge/skills";
    readonly detectPaths: readonly [".forge"];
}, {
    readonly id: "gemini-cli";
    readonly label: "Gemini CLI";
    readonly globalSkillPath: ".gemini/skills";
    readonly detectPaths: readonly [".gemini"];
    readonly aliases: readonly ["gemini"];
    readonly executables: readonly ["gemini"];
    readonly invocation: "empirical";
    readonly reload: "Run /skills reload and /skills list, then ask Gemini to run the desired Empirical skill.";
    readonly projectMcp: true;
    readonly handoff: true;
}, {
    readonly id: "github-copilot";
    readonly label: "GitHub Copilot";
    readonly globalSkillPath: ".copilot/skills";
    readonly detectPaths: readonly [".copilot"];
    readonly reload: "Start a new Copilot CLI or Agent Host session so it reloads the global Empirical MCP bridge.";
    readonly projectMcp: true;
}, {
    readonly id: "goose";
    readonly label: "Goose";
    readonly globalSkillPath: ".config/goose/skills";
    readonly detectPaths: readonly [".config/goose"];
}, {
    readonly id: "grok";
    readonly label: "Grok Build";
    readonly globalSkillPath: ".grok/skills";
    readonly detectPaths: readonly [".grok"];
}, {
    readonly id: "hermes-agent";
    readonly label: "Hermes Agent";
    readonly globalSkillPath: ".hermes/skills";
    readonly detectPaths: readonly [".hermes"];
}, {
    readonly id: "inference-sh";
    readonly label: "inference.sh";
    readonly globalSkillPath: ".inferencesh/skills";
    readonly detectPaths: readonly [".inferencesh"];
}, {
    readonly id: "jazz";
    readonly label: "Jazz";
    readonly globalSkillPath: ".jazz/skills";
    readonly detectPaths: readonly [".jazz"];
}, {
    readonly id: "junie";
    readonly label: "Junie";
    readonly globalSkillPath: ".junie/skills";
    readonly detectPaths: readonly [".junie"];
}, {
    readonly id: "iflow-cli";
    readonly label: "iFlow CLI";
    readonly globalSkillPath: ".iflow/skills";
    readonly detectPaths: readonly [".iflow"];
}, {
    readonly id: "kilo";
    readonly label: "Kilo Code";
    readonly globalSkillPath: ".kilocode/skills";
    readonly detectPaths: readonly [".kilocode"];
}, {
    readonly id: "kimchi";
    readonly label: "Kimchi";
    readonly globalSkillPath: ".config/kimchi/harness/skills";
    readonly detectPaths: readonly [".config/kimchi"];
}, {
    readonly id: "kimi-code-cli";
    readonly label: "Kimi Code CLI";
    readonly globalSkillPath: ".agents/skills";
    readonly detectPaths: readonly [".kimi-code", ".kimi"];
}, {
    readonly id: "kiro-cli";
    readonly label: "Kiro CLI";
    readonly globalSkillPath: ".kiro/skills";
    readonly detectPaths: readonly [".kiro"];
}, {
    readonly id: "kode";
    readonly label: "Kode";
    readonly globalSkillPath: ".kode/skills";
    readonly detectPaths: readonly [".kode"];
}, {
    readonly id: "lingma";
    readonly label: "Lingma";
    readonly globalSkillPath: ".lingma/skills";
    readonly detectPaths: readonly [".lingma"];
}, {
    readonly id: "loaf";
    readonly label: "Loaf";
    readonly globalSkillPath: ".agents/skills";
    readonly detectPaths: readonly [".loaf"];
}, {
    readonly id: "mcpjam";
    readonly label: "MCPJam";
    readonly globalSkillPath: ".mcpjam/skills";
    readonly detectPaths: readonly [".mcpjam"];
}, {
    readonly id: "mistral-vibe";
    readonly label: "Mistral Vibe";
    readonly globalSkillPath: ".vibe/skills";
    readonly detectPaths: readonly [".vibe"];
}, {
    readonly id: "moxby";
    readonly label: "Moxby";
    readonly globalSkillPath: ".moxby/skills";
    readonly detectPaths: readonly [".moxby"];
}, {
    readonly id: "mux";
    readonly label: "Mux";
    readonly globalSkillPath: ".mux/skills";
    readonly detectPaths: readonly [".mux"];
}, {
    readonly id: "opencode";
    readonly label: "OpenCode";
    readonly globalSkillPath: ".config/opencode/skills";
    readonly detectPaths: readonly [".config/opencode"];
}, {
    readonly id: "openhands";
    readonly label: "OpenHands";
    readonly globalSkillPath: ".openhands/skills";
    readonly detectPaths: readonly [".openhands"];
}, {
    readonly id: "ona";
    readonly label: "Ona";
    readonly globalSkillPath: ".ona/skills";
    readonly detectPaths: readonly [".ona"];
}, {
    readonly id: "pi";
    readonly label: "Pi";
    readonly globalSkillPath: ".pi/agent/skills";
    readonly detectPaths: readonly [".pi/agent"];
}, {
    readonly id: "qoder";
    readonly label: "Qoder";
    readonly globalSkillPath: ".qoder/skills";
    readonly detectPaths: readonly [".qoder"];
}, {
    readonly id: "qoder-cn";
    readonly label: "Qoder CN";
    readonly globalSkillPath: ".qoder-cn/skills";
    readonly detectPaths: readonly [".qoder-cn"];
}, {
    readonly id: "qwen-code";
    readonly label: "Qwen Code";
    readonly globalSkillPath: ".qwen/skills";
    readonly detectPaths: readonly [".qwen"];
}, {
    readonly id: "replit";
    readonly label: "Replit";
    readonly globalSkillPath: ".config/agents/skills";
    readonly detectPaths: readonly [];
}, {
    readonly id: "reasonix";
    readonly label: "Reasonix";
    readonly globalSkillPath: ".reasonix/skills";
    readonly detectPaths: readonly [".reasonix"];
}, {
    readonly id: "rovodev";
    readonly label: "Rovo Dev";
    readonly globalSkillPath: ".rovodev/skills";
    readonly detectPaths: readonly [".rovodev"];
}, {
    readonly id: "roo";
    readonly label: "Roo Code";
    readonly globalSkillPath: ".roo/skills";
    readonly detectPaths: readonly [".roo"];
}, {
    readonly id: "tabnine-cli";
    readonly label: "Tabnine CLI";
    readonly globalSkillPath: ".tabnine/agent/skills";
    readonly detectPaths: readonly [".tabnine"];
}, {
    readonly id: "terramind";
    readonly label: "Terramind";
    readonly globalSkillPath: ".terramind/skills";
    readonly detectPaths: readonly [".terramind"];
}, {
    readonly id: "tinycloud";
    readonly label: "Tinycloud";
    readonly globalSkillPath: ".tinycloud/skills";
    readonly detectPaths: readonly [".tinycloud"];
}, {
    readonly id: "trae";
    readonly label: "Trae";
    readonly globalSkillPath: ".trae/skills";
    readonly detectPaths: readonly [".trae"];
}, {
    readonly id: "trae-cn";
    readonly label: "Trae CN";
    readonly globalSkillPath: ".trae-cn/skills";
    readonly detectPaths: readonly [".trae-cn"];
}, {
    readonly id: "warp";
    readonly label: "Warp";
    readonly globalSkillPath: ".agents/skills";
    readonly detectPaths: readonly [".warp"];
}, {
    readonly id: "windsurf";
    readonly label: "Windsurf";
    readonly globalSkillPath: ".codeium/windsurf/skills";
    readonly detectPaths: readonly [".codeium/windsurf"];
    readonly executables: readonly ["windsurf"];
    readonly invocation: "@empirical";
    readonly reload: "Reload Windsurf or start a new Cascade session, then invoke @empirical-init for repository setup or repair.";
    readonly projectMcp: true;
    readonly handoff: true;
}, {
    readonly id: "zed";
    readonly label: "Zed";
    readonly globalSkillPath: ".agents/skills";
    readonly detectPaths: readonly [".config/zed"];
}, {
    readonly id: "zcode";
    readonly label: "ZCode";
    readonly globalSkillPath: ".zcode/skills";
    readonly detectPaths: readonly [".zcode"];
}, {
    readonly id: "zencoder";
    readonly label: "Zencoder";
    readonly globalSkillPath: ".zencoder/skills";
    readonly detectPaths: readonly [".zencoder"];
}, {
    readonly id: "zenflow";
    readonly label: "Zenflow";
    readonly globalSkillPath: ".zencoder/skills";
    readonly detectPaths: readonly [".zencoder"];
}, {
    readonly id: "neovate";
    readonly label: "Neovate";
    readonly globalSkillPath: ".neovate/skills";
    readonly detectPaths: readonly [".neovate"];
}, {
    readonly id: "pochi";
    readonly label: "Pochi";
    readonly globalSkillPath: ".pochi/skills";
    readonly detectPaths: readonly [".pochi"];
}, {
    readonly id: "promptscript";
    readonly label: "PromptScript";
    readonly globalSkillPath: null;
    readonly detectPaths: readonly [];
    readonly exclusionReason: "PromptScript supports project-local skills only.";
}, {
    readonly id: "adal";
    readonly label: "AdaL";
    readonly globalSkillPath: ".adal/skills";
    readonly detectPaths: readonly [".adal"];
}, {
    readonly id: "universal";
    readonly label: "Universal";
    readonly globalSkillPath: ".config/agents/skills";
    readonly detectPaths: readonly [];
}];
export type AgentSkillTargetId = typeof AGENT_SKILL_TARGETS[number]["id"];
export type AgentSkillTarget = typeof AGENT_SKILL_TARGETS[number];
export type GlobalAgentSkillTarget = AgentSkillTargetDefinition & {
    id: AgentSkillTargetId;
    globalSkillPath: string;
};
export interface AgentSkillDetectionOptions {
    homeRoot: string;
    pathValue?: string;
}
export declare function globalAgentSkillTargets(): GlobalAgentSkillTarget[];
export declare function agentSkillTarget(id: AgentSkillTargetId): AgentSkillTargetDefinition & {
    id: AgentSkillTargetId;
};
export declare function resolveAgentSkillTargetId(value: string): AgentSkillTargetId | null;
export declare function agentSkillTargetPath(homeRoot: string, target: GlobalAgentSkillTarget): string;
export declare function detectAgentSkillTargets(options: AgentSkillDetectionOptions): Promise<AgentSkillTargetId[]>;
export declare function validateAgentSkillCatalog(): string[];
