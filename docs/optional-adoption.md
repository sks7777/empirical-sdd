# Optional Empirical adoption

Empirical runs when a person chooses it. Installing the package, joining a
repository, or finding an unfinished specification does not require adoption.
An ordinary coding request remains useful without initialization or workflow
state. A request to work without Empirical takes precedence over automatic
routing for that request.

## Choose how the repository uses Empirical

During `empirical-init`, choose one of these modes before Save:

| Choice | Effect |
| --- | --- |
| Only when explicitly requested (recommended) | Installs the local `empirical` skill and MCP bridges. Does not inject shared routing instructions. Invoke `$empirical` in Codex or `/empirical` in Claude Code for chosen work. |
| Automatically for this team | Saves the team's choice and adds managed routing blocks to `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, and an existing `AGENTS.override.md`. Ordinary mutation requests enter the workflow unless the person asks to skip it. |
| Cancel | Saves nothing and leaves ordinary work available. |

Choose automatic only when the affected team agrees. A mixed team can keep
explicit invocation and let individual developers choose Empirical per task.
This is a repository choice, not a global activation switch. Once a person
chooses Empirical for a task, continuation of that task does not require another
invocation or confirmation; a later request to opt out still takes precedence.

The persisted setting is `activationMode: "explicit" | "automatic"`. Init and
Configure accept it over MCP; their private CLI equivalent is `--activation
explicit|automatic`. People can ask their agent to change the setting. Unrelated
configuration and repeat setup preserve the saved value. Explicitly switching
back removes only well-formed Empirical-owned routing blocks, keeps user content
and workflow history, and installs explicit invocation metadata where supported.
If Configure cannot apply the selected mode, it reports `ACTIVATION_REPAIR_REQUIRED`
and states that the choice was saved but artifact repair remains incomplete.
Malformed markers, symlinks and unmanaged collisions remain untouched and appear
in inspection. Resolve them deliberately before relying on activation status.

An older Schema 5 config without the field resolves to explicit. Reading it does
not rewrite it. Invoke `empirical-init` after upgrading to refresh old generated
instructions; choose automatic explicitly during repair if the team wants it.
Start a fresh agent session afterward because existing sessions may retain old
instructions. Artifact readiness is checked; host loading is reported as
unverified until observed. Execution, evidence, review and tracker gates still
apply to work deliberately run through Empirical.

## Experience audit for SDD-54

Source baseline: `origin/develop` at `2cf873e` (September 11, 2026). The relevant
implementation is `src/integrations.ts`, `src/core.ts`, `src/setup.ts`, and
`src/storage.ts`. These observations describe the code, not interviewed users.

| Repository state | Baseline behavior | Behavior after this change |
| --- | --- | --- |
| Empirical absent | Global installation does not create project state. No local workflow can start until explicit init. | Ordinary work remains available. Installation and init stay explicit. |
| Package installed, repository uninitialized | Only global `empirical-init` is installed. No local routing until init; generated instructions tell users with missing config to initialize. | No generic coding request should invoke init, create state or invite adoption repeatedly. Explicit requests for Empirical receive setup guidance. |
| Initialized, deliberate non-use | No saved activation opt-out. Init unconditionally injects automatic instructions, and repair restores them. Disabling tracking does not disable routing. | Explicit invocation permits non-use. Requests to skip are honored in both modes. Repair retains the chosen mode and history. |
| Partial, invalid or incomplete setup | Generated shared instructions demand Empirical before mutations, then tell the user to initialize if config is invalid or incomplete. Doctor reports missing or stale surfaces. | Invalid or incomplete setup cannot activate a workflow or prevent ordinary work. Explicit repair handles missing choices; diagnostics retain unsafe and conflicting files. |
| Legacy initialized repository | No activation setting records team consent. Existing dispatchers require automatic use. | Missing choice resolves to explicit; repair removes owned automatic blocks. Cached hosts require a fresh session. |

## Non-adopter hypotheses and small experiments

These segments are hypotheses derived from the ticket and current interaction
costs. Their prevalence and reasons require validation with actual non-users.

| Segment / likely reason | Low-commitment experience to test | Observable signal |
| --- | --- | --- |
| Developer in a mixed team; does not want to impose a process | Initialize explicit mode in a disposable repository; compare shared instruction files before and after | Correctly predicts who is affected; no unexpected shared instructions |
| Developer with a small fix; ceremony costs more than the change | Perform the fix normally, then deliberately choose Empirical for a second task if useful | Completes the first task without adoption prompts or state creation |
| Curious evaluator; wants to understand value before setup | Read a sample specification, plan and evidence report, or request a source-linked read-only repository explanation from the existing agent | Can explain the value and decide whether a trial is worthwhile without setup |
| Team with established tools or governance | Keep current tools and try explicit Empirical on one task in a disposable branch | Can stop using it without losing the task's artifacts or disturbing the team's instructions |
| Returning user after partial setup or a failed first attempt | Continue ordinary work, then explicitly repair with saved choices and a visible summary | Understands what remains pending and sees no implicit start or lost history |

Recommendation: build optional activation and revise onboarding first, as this
change does. Use the existing agent for read-only explanations. Do not build a
new passive analysis engine before evidence shows that a sample and optional
trial are insufficient. A refusal is a valid result; do not keep inviting users.

## Validation plan

Recruit six developers who currently do not use Empirical, including at least
two on mixed teams and two who have previously declined or abandoned setup.
Do not require installation to participate. In a disposable repository, give
three tasks: make a normal small change, explain what opting in would affect,
and try or decline one explicitly selected Empirical task. Then ask them to
switch back or cancel setup and verify the resulting files together.

Compare the baseline demonstration with the optional experience in alternating
order. Record task completion time, unnecessary prompts, unexpected file/state
writes, correctness of the participant's explanation, and whether they
voluntarily choose another Empirical task within a week. Do not capture private
code, credentials or chat content for the study.

Acceptance targets for the experiment: all six finish the ordinary task without
an adoption interruption; zero unexpected mutations on Cancel or non-use; at
least five correctly explain the two activation choices and how to stop; and no
participant reports feeling forced to adopt. Median time to make an informed
choice should be under two minutes. Repeat voluntary use is exploratory rather
than a reason to override a refusal. Investigate every unexpected activation
before broad rollout. Keep automatic routing only if team participants can
correctly predict its shared effects.

The experiment has not been conducted. Automated regression tests validate the
configuration and artifact behavior; simulated skill prompt evaluations check
the written contract. Neither establishes real-user acceptance or proves that
every host has loaded the revised instructions.
