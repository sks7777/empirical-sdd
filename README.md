# Empirical SDD

**Agent work that survives the chat.**

Empirical is a repository-native harness for coding agents. The model writes;
Empirical keeps the contract, progress, proof, and exact next action in Git so
work can resume across sessions, agents, and machines.

> Empirical is alpha software and requires Node.js 22 or newer.

**[Open the practical harness guide](docs/harness-guide.md)**
for the walkthrough, checklists, and complete workflow. (The original hosted
visual guide is no longer available; what could be recovered is mirrored under
[docs/mirrored/](docs/mirrored/README.md).)

For a short explanation of receipts, review, checkpoints and cross-machine work,
read [Working with Empirical](docs/harness-guide.md). See the
[configuration reference](docs/configuration.md) for options and fixed rules.
Run `empirical doctor` for the complete plain-English project health check,
including what is working, what needs attention, and what you can change. The
older `--options` spelling remains available as an alias. Use `--json` only
when an agent, CI job, or advanced diagnostic needs technical details.

## Start in three steps

1. Install the package and the agent integrations you use.

   ```sh
   npm install -g empirical-sdd
   empirical install
   ```

2. Initialize each repository once from your coding agent.

   - Codex: `$empirical-init`
   - Claude Code: `/empirical-init`

   Init guides you through six steps in your agent chat: **Setup → Preferences →
   Review bot → Tracking → Confirm → Apply**. It shows your current step and asks
   one question at a time. Use **Back** or **Edit** to revisit a section while
   keeping your other answers. Nothing is applied until you confirm **Save**.

   Bot review is optional. Init offers it once; say “no,” “skip,” or “ignore”
   to save fresh-context review without a bot token. Future init runs preserve
   that choice. To enable it later, tell your agent “enable bot review.”
   Fresh-context review still uses an isolated reviewer, but does not count as
   an independent GitHub approval.

3. Choose when to use Empirical.

   Init recommends **Only when explicitly requested**. Use the local skill for
   work you want to run through Empirical: `$empirical` in Codex or `/empirical`
   in Claude Code. Ordinary coding requests stay outside the workflow.

   Choose **Automatically for this team** only when the team agrees to shared
   routing instructions. You can then ask for a change normally:

   ```text
   Add rate limiting to the public API and prove the failure path.
   ```

Empirical is optional. You can ask to work without it in either mode. Read-only
questions remain read-only. If Empirical work stops, invoke it again in the same
checkout to resume from the committed journal.

To change the choice later, ask your agent to configure Empirical activation.
Switching to explicit removes only Empirical's shared routing blocks and keeps
workflow history. Repair preserves saved choices. Older repositories without a
recorded choice become explicit on repair; start a fresh agent session afterward.
See [optional adoption](docs/optional-adoption.md) for mixed teams and migration.

## Why use it?

| Without a harness | With Empirical |
| --- | --- |
| Lost chat | **Continuity** — resume from repository state. |
| Ambiguous request | **Shared contract** — agree on observable outcomes first. |
| Confidence without proof | **Honest evidence** — bind claims to exact source, commands, attempts, and results. |
| Scope drift | **Reviewable scope** — keep decisions, diffs, failures, and gaps visible. |
| Unsafe convergence | **Safer integration** — isolate parallel work and validate against an independent target. |
| Accidental publication | **Bounded authority** — keep implementation, delivery, and publication separate. |

## How it works

Empirical Flow selects the lightest route that preserves the requested process
and safety floor:

- **Flow Direct** handles understood, tightly scoped work in the current agent
  without creating workflow artifacts.
- **Flow Delegated** assigns bounded independent work through the host's native
  delegation and creates at most one concise Flow Record when recovery value
  justifies it.
- **Formal SDD** is selected only when the user explicitly requests it. It
  preserves proposal, specification, technical design, task breakdown,
  implementation, verification, and any later requested endpoint.

The existing Fast and Complex state machines remain compatibility engines for
durable Empirical features:

- **Fast** handles explicitly requested small, scoped, reversible features and
  fixes, including ordinary behavior and UI changes. It requires no tests,
  formal review, or Context phase and finishes **implemented; verification
  skipped**. Its spec and journal remain available.
- **Complex** carries work through a durable contract, decisions, verification,
  exact-diff review, and independent integration. Explicit Complex is honored;
  sensitive and higher-risk work always requires it.

Fast:

```text
Implement → Done (implemented; verification skipped)
```

Complex:

```text
Specify → Design → Plan → Implement → Context? → Review → Verify → Integrate
```

Existing features retain their saved Verify-before-Review order. New Complex
features and promoted Fast features review first; changing reviewed code requires
another review before Verify can finish.

A Complex feature that shows an interface gets its mockup at Specify when the
saved mockup preference is enabled. The contract is still open: seeing a screen
reveals states and flows that prose misses and those belong in the criteria.
`empirical mockups` serves the
directions on a local address so a person can click through and choose one;
Verify then checks what was built against what was approved.

Complex runs Context when repository knowledge needs refinement. Failed
verification or requested review changes return to implementation. Evidence, review, and
integration are different claims, and Empirical reports only the highest level
actually proven: `implemented`, `verified`, `integrated`, `delivered`, or
`published`.

Choose Fast for small, self-contained changes. Work that builds on an existing
foundation and will be integrated belongs in Complex iterative
(`empirical_complex` with `iterative: true`): adjust with `empirical_iterate`
without test runs, then say "ready to close" to run final verification once.
Each Complex implementation packet carries a bounded contract summary instead of
the full documents, and the newest adjustment wins: a behavior change at the same
risk floor amends the criteria and decisions in place, with the approved contract
snapshotted for review. Raising the risk floor or changing the declared capability
scope still requires an explicit contract revision through Specify/Design/Plan.

Fast trades verification confidence for less waiting and process. A follow-up
adjustment to the same Fast feature uses `empirical_iterate`, from Implement or
after Done: no promotion, no test run, and the journal keeps every adjustment.
A failed Fast completion blocks in place for `retry` or explicit promotion.
Promotion is always explicit: Fast consolidate, Integrate and Deliver require
`empirical_promote`, which continues the same spec through Complex Specify and
preserves its history and identity. Historical completed Fast records retain the
evidence and completion level they originally earned.

Delivery is never implied. Empirical does not infer permission to merge a pull
request, bypass protection, create a release, or publish a package.

Every read returns one deterministic roadmap, and every stop shows the same
status card built from it, so you always see where the work is and what it
needs from you:

```text
Empirical · add-team-invitations · Complex · verify (5/7) · rev 5
Done:           specify, design, plan, implement
Not done:       verify: qa-unit unrun, qa-browser missing-environment
Next:           Run qa-unit at revision 5 (~2m 10s) when you request tests
Waiting on you: [test-request] Ask to run 1 check (~2m 10s), or keep iterating
                [environment] qa-browser needs isolated-consumer
Verification:   2 of 4 checks left (~2m 10s known; 1 unknown)
Time:           1h 12m of 2h budget
```

Work does not run silently for hours. Elapsed time comes from the feature's
journal and is measured against a per-lane budget (defaults: Fast 30, Quick 60,
Complex 120 minutes; override with `"budget": { "fast": 45 }` in
`.empirical/config.json`). Past the budget, or when Review sends work back to
Implement, the card stops at a checkpoint and offers explicit exits: ship as
is with a draft PR, split, defer non-blocking findings, continue with a new
budget (`empirical_checkpoint`), or stop.

`empirical status`, `explain`, `next` and `loop` print it, `--json` carries the
same `roadmap`, and the agent skill shows it at every start, phase change and
stop, and before a long run it estimates and offers to defer. The card reports
facts; it authorizes nothing.
## Work directly when you want to

Say "direct", "without Empirical" or "quick change" and the agent just edits:
no specification, state, phase, receipt, gate, tracker update or worktree
proposal, and no reading of specs, decisions or context pages. Nothing runs
unless you ask for it, and the turn ends with one line such as
`Changed the button label in 1 files · not tested (not requested) · say "track this" to formalize`.

Inside a repository or feature that uses Empirical, "go direct" pauses the
selected feature, "back to Empirical" folds the direct diff back in as one
iteration, and "track this" rebuilds recent direct commits and uncommitted files
from Git into a Fast (or Complex) feature. Push, merge, pull request, tag,
publish, credential use and destructive Git still need an explicit request.

A team can set `defaultMode` to `direct` in `.empirical/config.json`, and each
developer can override it for their own checkout; explicit Fast, Complex or
"use Empirical" requests always start those lanes.

## Keep features small

When a Complex feature grows past 6 acceptance criteria or 2 capabilities, the
status card asks whether to split it into independently shippable slices, each
with its own draft PR, or keep it as one with a recorded reason. The question
never blocks a gate; tune or disable it with `sizeGuardrail` in
`.empirical/config.json`.

## Close out work that is stuck

Sometimes a feature cannot satisfy its next gate: the PR was merged by hand, the
work was abandoned, or the proof the gate wants is never coming. Ask to close it
out and Empirical records why rather than pretending:

- “Close this feature out, it was merged manually in PR #123” reads the pull
  request, requires it to be genuinely merged into the target branch, and
  records those facts. It does **not** mark the feature delivered — that still
  means a verified delivery receipt — so the status card stays honest.
- “Give up on this feature, the approach did not work” ends it as abandoned at
  whatever it had actually reached.
- “Skip this stage” advances exactly one stage past a gate. It will not step
  into Integrate, Deliver or Publish, which have their own approvals.

Every close needs a reason in plain words, shows you the exact effect first, and
lands in the feature's journal. It never writes a receipt or raises a completion
level, so nothing a forced close touches can later be mistaken for proof.

When features show as **merged, not closed** — their PRs merged on GitHub but
the session that merged them never recorded it — ask to reconcile. Empirical
finds the merged PR for each unfinished feature on its own, shows you the list,
and closes the ones you approve as merged externally. Features that never got
to Implement, have no provable merge, or belong to another checkout are listed
with what to do instead; nothing is deleted.

`empirical doctor` stays read-only. When it reports leftovers — expired locks,
stale claims, prunable worktree registrations — ask to clean them up and it
removes only what the report already named, and only the classes you name.

## Run tests when you need them

Fast and Complex iteration do not automatically run tests after edits. Ask for a
run when ready:

- “Run the changed tests” or “run the affected tests” runs the `iterate`
  verification profile once: only commands configured with `testFiles: "changed"`.
- “Now run it”, “run everything” or “ready to close” uses the `final` profile,
  which runs only the Verify selection: one cheapest configured command per
  Verify check, never full CI.
- “Keep iterating; skip tests for now” leaves verification pending.

One test request does not enable automatic reruns after subsequent changes, and
no phase, iteration or consolidation runs tests by itself. The full suite runs
once, at the very end. By default (`promotion.fullCi` omitted, which means
`auto`) it runs as pull-request CI when the repository's GitHub delivery pins
required checks and no SDD-67 local-forcing reason applies; Deliver merges
nothing until those checks pass on the exact head. Otherwise it runs locally,
only after you approve that exact run (command, revision and estimate), and one
exact full-CI receipt recorded at Integrate also serves Deliver when nothing
changed. Agents never approve on your behalf; Publish's explicit publication
authorization is the approval for its own full-CI run. An explicit
`promotion.fullCi: "local"` always runs locally, and `"remote-checks"` keeps
remote proof without a local fallback.
A focused command can declare a `scope` of paths so an edit elsewhere does not
invalidate its Verify receipt; global configuration (policy, manifests,
lockfiles, workflows, argv-named files) always invalidates it, and full CI and
promotion proof are never scoped. See [docs/mcp.md](docs/mcp.md).
If no focused command is configured, the agent reports the gap instead of
silently running the entire suite. Complex still requires real evidence before
claiming verified completion; Fast can finish implemented and unverified.
Explicit final verification or promotion requests include their required checks,
and CI/release gates remain enforced. An explicit no-tests request takes
precedence over execution and leaves any conflicting gate pending.

Long local runs can go to the background: `empirical_qa_start` runs the command
in a snapshot worktree of the committed `HEAD` and returns a job id immediately,
`empirical_qa_status` reports progress and the receipt, and `empirical_qa_cancel`
stops it. See [MCP usage](docs/mcp.md#background-verification-jobs).
When CI is not available, agents ask before a full regression at the end, run
it in the background with your approval, keep working, and rerun only the
failing test files if it fails.

### Ship early

Agents open a draft pull request at the first coherent commit of feature work
and push every commit. Commits and pushes never wait on tests: the change's
tests run in the background while work continues, and heavy or full-suite runs
belong to pull-request CI unless you approve a local run. This authority covers
only the agent's own feature branch and draft pull requests; agents never merge,
never push to protected or target branches, and never force push. Without a
remote or `gh`, the agent says so and continues locally.

Existing repositories need their managed skills refreshed with `empirical-init`
and a restarted agent session after upgrading to receive this guidance.

## What it creates

Init installs the harness; selected work fills in the record:

```text
repository/
├── AGENTS.md / CLAUDE.md / GEMINI.md    bounded activation markers
├── agent skill + MCP entries            selected integrations
└── .empirical/
    ├── config.json                      project setup
    ├── policy.json                      verification and delivery policy
    ├── tracker.json                     secret-free tracker choice
    ├── context/                         repository knowledge
    ├── mockups/decision.md              app mockups adopted or declined
    ├── specs/<feature>/
    │   ├── spec.md + decisions.md       contract and decisions
    │   ├── mockups/                     approved directions and fidelity
    │   ├── design.md + plan.md          Complex approach and plan
    │   ├── impact.json                  affected behavior and surfaces
    │   ├── state.json + events/         phase and resumable journal
    │   ├── evidence/receipts/           immutable attempts and artifacts
    │   ├── reviews/                     exact-diff review, when reached
    │   └── integration-receipt.json     convergence proof, when reached
    └── capabilities/<capability>/       living behavior after integration
```

Exact host files depend on the integrations selected during install. Init
creates durable setup and empty work containers; a real mutation creates a
feature record, and conditional artifacts appear only when their phases run.

Optional tracking mirrors approved milestones to Linear, GitHub, Jira, or Plane; the
repository remains authoritative. Policy supports
`enforcement: "best-effort" | "strict"`; strict recovery retries the exact
feature. Credentials never belong in chat, prompts, repository files, tool
arguments, or evidence.

When GitHub Copilot is selected, installation also reconciles the exact
Empirical stdio bridge in `~/.copilot/mcp-config.json`; start a new session after
install or update. Linear setup then uses an in-memory OAuth client for Linear's
official remote MCP endpoint, with browser authorization through negotiated URL
elicitation. Empirical never reads Copilot's token store or persists the OAuth
token. The guarded `LINEAR_SECRET_KEY` host file remains a fallback, not the
default requirement for an OAuth-capable session. On Codex, Policy v2 can use
`connection: "linear-mcp"`: Empirical emits durable secret-free intents, Codex
executes them through the authenticated Linear MCP tools, and validated results
converge the same binding, milestone, and strict-gate records without sharing
the OAuth token.

### Automatic lifecycle tracking

Policy v2 workflow actions now synchronize automatically. Linear MCP hosts
receive a prepared tracker intent, and trusted host dispatchers can execute it
automatically. Init confirms every discovered mapping and whether Done means
local completion, a confirmed release, or production deployment. See
[Lifecycle tracking](docs/tracking.md) for setup, recovery, and the observation hook.

## Documentation

- [Practical guide](docs/harness-guide.md) — walkthrough, checklists, and workflow
- [Demo](docs/demo.md) — installation and representative scenarios
- [Protocol](docs/protocol.md) — state machine, artifacts, and completion rules
- [Architecture](docs/architecture.md) — persistence and trust boundaries
- [MCP and tracking](docs/mcp.md) — agent operations and tracker configuration
- [Security](docs/security.md) — credentials, execution, review, and authority
- [Releasing](docs/releasing.md) — guarded maintainer playbook

## Development

```sh
bun install --frozen-lockfile
bun run ci
```

CI covers Node.js 22, 24, and 26. Ordinary changes target `develop`; `main` is
reserved for validated release pull requests.

## License

[MIT](LICENSE)

### Shared specs across worktrees

Specs and capability contracts are repository artifacts. Each Git worktree
selects and claims its own active feature in local Git metadata; different
worktrees can execute different features concurrently. Unclaimed or temporarily
inactive specs stay in `.empirical/specs/`. They are not abandoned work.

Use the agent's `empirical_select` operation to resume an existing unclaimed
feature. Explicit new feature starts and repository setup/context repair are not
blocked by unrelated unclaimed specs. If a feature-required operation needs a
choice, it lists candidates rather than choosing or moving a spec. An approved
worktree handoff can be retried with its original input after interruption.
Creating it from an approved committed base leaves uncommitted source edits in
their original checkout. Transferring an unfinished spec to another worktree
requires its exact source revision and matching destination history; it keeps
the original capability bases and receipts.

Ignored local environment files such as `apps/api/.env` or `apps/web/.env.local`
are discovered by default, listed by path in each worktree proposal, and copied
into the new worktree when you approve it. Copies are independent, never
overwrite existing files and never enter Git. Set `isolation.localFiles.discover`
to `false` to opt out, or adjust its `include` and `exclude` patterns. For a
worktree created by another tool or `git worktree add`, your agent previews and
applies Empirical prepare to fill in the missing files.
See [local environment files](docs/protocol.md#local-environment-files-in-worktrees).

Long-lived branches drift. The status card flags a branch that is behind its
target with predicted conflicts or by more than 10 commits, and your agent syncs
at each checkpoint: Empirical merges the target only when it is clean and
conflict-free, never rebases or force-pushes, and names conflicting files right
away. See [staying current](docs/mcp.md#stay-current-with-the-target-branch).

Ask your agent for the read-only overview to see specs, owners, branches,
profiles, progress and verification status together. Unrelated malformed records
appear as local diagnostics without selecting or deleting any spec. Independent
work uses separate locks; overlapping feature writers and integration targets
still serialize safely. Multiple worktrees cost disk space and setup, and
changes to shared capabilities can still conflict when they integrate.
See [selection and recovery semantics](docs/protocol.md#shared-specs-and-checkout-selection).

### Sub-agents for specs and implementation

Ask your agent to delegate bounded specification or implementation work. Empirical
discovers the host's actual native agent capabilities, reserves each assignment
before spawning, and tracks its identity through interruption or cancellation.
Writable children use separate registered worktrees and selected specs. Read-only
consults require a host that enforces read-only access.

Delegation can progress independent specs concurrently, at the cost of additional
agent usage, worktrees and integration work. Host support varies: installation
alone does not prove that spawning, lookup, observation and cancellation are
available. Worker completion never substitutes for workflow evidence. Fast workers
remain unverified; Complex workers still pass the full applicable gates.
See the [native delegation bridge](docs/mcp.md#native-sub-agent-delegation).
