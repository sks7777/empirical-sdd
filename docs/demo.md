# Empirical 0.34.0 demo

## Install once

```bash
npm install -g empirical-sdd
empirical install
```

Choose from the pinned 73-target catalog. Empirical writes the single explicit
`empirical-init` skill once per unique root and performs no runtime network
fetch during installation.

## Initialize deliberately

In Codex, invoke `$empirical-init`. New repositories show proposed defaults;
existing repositories show their saved values. Choose explicit invocation for
individual use, or automatic routing only if the team agrees to shared
instructions. Invoke the local empirical skill for each chosen task in explicit
mode. Requests to skip Empirical remain outside the workflow in either mode.
The wizard covers verification,
**Create mockups before coding?**, reviewer bot, parallel work, decisions,
question detail, and tracking. Choose Yes to approve UI mockups before coding,
or No to skip mandatory mockups. Already approved designs still get fidelity
checks. Saved choices are retained on repeat setup.

The agent uses native selection controls when the host exposes them, otherwise
one text question. Review the complete summary and choose Save; cancellation
before Save writes nothing. Initialization persists Schema 5, Policy v2,
Manifest v2 and supported runtime bridges without creating feature state.
In Claude Code use `/empirical-init`.

Existing `0.22.x` repositories need the same explicit Init once after upgrade.
That repair preserves stored configuration, context, selected work, history,
and evidence unless you explicitly change a setup value.

## Verify Linear OAuth before the demo

Codex's reliable OAuth path is the official Linear Streamable HTTP MCP server,
configured directly in the Codex host:

```bash
codex mcp add linear --url https://mcp.linear.app/mcp
codex mcp login linear
codex mcp list
```

After adding or changing the server, restart the Codex app, CLI session, or IDE
extension so it reloads MCP configuration. Confirm the `linear` server is
connected and ask Codex to list a read-only Linear resource before the live
demo. Restarting only reloads configuration; it does not make the local
Empirical STDIO session advertise nested URL-mode elicitation.

The direct Linear OAuth credential remains private to Codex and enables direct
Linear MCP tools. For `apply all tracking linear`, Init selects Policy v2
`connection: "linear-mcp"`, gathers teams/projects/statuses through those tools,
and drives Empirical's durable prepare/tool/accept loop until the tracker is
synced. The OAuth token is never copied into Empirical. Tool names vary by host:
inspect the actual registry and any lazy tool search before reporting a missing
capability. A bounded read establishes whether the connection works. Missing
write tools do not prevent read-only catalog discovery, and an enabled OAuth
server with unexposed tools needs host exposure diagnostics, not another login
or an automatic API-key request. Use host-file credentials only when explicitly
choosing that alternative after discovery and recovery checks. Never paste
credentials into chat.

## Integration drift repair mock

The packaged demo creates an isolated temporary home and Git repository, marks
setup as complete without installing project integrations, adds user-owned
instructions plus a nested non-canonical `AGENT.md`, runs Doctor from that
nested directory, performs the same reconciliation used by `empirical-init`,
and runs Doctor again:

```bash
bun run build
bun run demo:integration-repair
```

Its JSON output first reports `PROJECT_ACTIVATION_MISSING` and
`PROJECT_ACTIVATION_NONCANONICAL` with artifact readiness `blocked`. Repair
converges the required instruction, native local skill, and MCP artifacts for
the selected integrations while preserving user-owned instructions. The final
report contains
`PROJECT_ACTIVATION_ARTIFACTS_CURRENT` and
`PROJECT_ACTIVATION_RUNTIME_UNVERIFIED`: files are current, but an already
running host must still be verified or reloaded. Configuration, workflow state,
and user instruction preservation are all `true`.

Doctor never repairs while inspecting. If an artifact contains stale
Empirical-owned content, explicit Init updates it. If a path is unsafe or an
Empirical MCP entry is unmanaged and conflicting, Init preserves it and Doctor
continues reporting the exact structured activation state, plus the aggregate
`PROJECT_INTEGRATIONS_DRIFTED` compatibility finding, until the developer
resolves the collision.

## New feature without an assigned ticket

The packaged ticket-policy demo starts a real Complex feature with no ticket
reference, selects concise questions plus the recommended
`features+large-fixes` matrix, and calls production tracker synchronization:

```bash
bun run build
bun run demo:ticket-policy
```

It never contacts Linear. A deterministic injected transport provides target
discovery, an empty stable-marker lookup, one create response, projection, and
one milestone; an in-memory OAuth resolver prevents any host credential read.
The JSON result must report `feature/required`, `createCount: 1`,
`bindingCount: 1`, and `liveNetworkCount: 0`. The clean packed-consumer harness
executes and rejects the package if any invariant changes.

For a Fast fix under the same preset, the effective rule is `optional`. With no
ticket reference, synchronization stays local and asks no ticket question.
Quick or Complex fixes require a ticket; chores are optional. A custom policy
can set any complete matrix cell to `required`, `optional`, or `off`.

## Normal mode

> Use Fast to fix the punctuation typo in the README heading, without tests.

Routing preserves the contract-neutral floor and the explicit Fast choice.
Fast implements the change without mandatory tests, formal review or Context,
records the result in its spec and journal, and finishes at `implemented` with
verification `skipped`. An explicitly requested small, reversible ordinary UI
feature can use the same route while retaining its behavioral classification.
Historical recorded demos may show the former evidence-backed Fast behavior;
those old completion records keep their original meaning.

> Add expiring team invitations with revocation and audit history.

Routing assigns at least the behavioral floor. Complex freezes an impact
manifest and capability deltas, then advances through Specify, Design, Plan,
Implement, conditional Context refinement, Verify, Review, and independent
Integrate. If the request is
materially ambiguous, the agent conducts and persists the five Socratic passes
before drafting the contract.

The repository-local workflow drafts a known Complex request, conducts the
five-pass interview when the idea is materially ambiguous, and resumes the
exact selected revision when work already exists. A read-only request such as
“explain the invitation flow” does not enter Empirical, and missing or invalid
configuration never triggers implicit initialization.

## Bounded autonomous mode

> Implement and integrate the approved invitation feature
> autonomously through `integrated`; stop before external delivery.

YOLO stores standing authorization through `integrated`, then continues without
routine preference questions. It still stops for an unresolved product choice,
missing host permission, conflict, branch protection, credential boundary, or
other hard safety floor. It cannot authorize publication.

## Optional ticket mirror

> Mirror this feature to our Linear board and create its ticket.

Init starts with OAuth and asks only for fallback environment-variable names,
discovers
accessible teams/projects/states by display name, proposes an editable semantic
mapping, and previews the secret-free result. In ensure mode the first sync
attaches a referenced or marker-matched ticket, or creates one only after a
complete zero-match lookup. After each eligible local journal commit it appends
an idempotent milestone comment with phase, revision, completion, blockers, and
safe receipt evidence. The same flow supports Linear, GitHub, Jira, and Plane without
rewriting user-authored descriptions.

If the provider is unavailable, local SDD work continues and reports tracker
health as `pending` or `failed`. A later ordinary continuation request resumes
the durable pending operation. If ticket creation has an ambiguous outcome,
Empirical performs bounded reconciliation using the persisted create marker. If
no unique ticket matches, it stops until the developer attaches the possibly
created ticket or explicitly confirms another create attempt that may create a
duplicate.

That is the default `best-effort` enforcement. A team can explicitly select
Tracker Policy v2 `strict`. For deterministically required work, Empirical then
commits only the feature identity revision and returns a blocked mutation gate.
No specification, source edit, evidence, integration, delivery, or publication
continues until authentication, binding, and the exact current revision
converge. Optional unreferenced and off work remain local/zero-I/O. If a strict
feature finishes locally before final provider acknowledgement, exact feature-
addressed sync remains available after terminal compaction and new work is
refused until recovery completes.

## Parallel work

Starting an unrelated request while a feature is selected returns a complete,
read-only Git worktree proposal. Literal approval creates exactly the displayed
branch and path from the displayed base commit. The original feature remains
selected only in its checkout; shared capability claims prevent conflicting
behavioral integrations.

## Delivery

When Policy v2 names a GitHub target and authorization covers `delivered`,
Complex integration can continue to Deliver. Empirical creates or converges one
source PR, waits for declared checks, merges normally, then creates and merges a
separate evidence PR bound to the source merge. No admin merge or force path is
available.

Publishing a package or release requires a separate explicit request containing
the exact package, version, dist-tag, merged commit, exact-request authorization,
and literal approval. Empirical queries the remote tag, GitHub release, npm
version, and dist-tag both before and after acting; a conflicting immutable
artifact blocks the operation.

## Upgrade

```bash
empirical update
```

This upgrades the package, reconciles the single managed `empirical-init` skill,
and removes marker-owned legacy global Empirical entrypoints. Run Init once in
each existing `0.22.x` repository to install automatic local activation. A
Schema 4 repository migrates atomically to Schema 5 on its first mutating
workflow operation.

## Uninstall safely

```bash
empirical uninstall
```

Interactive uninstall displays its complete scope and defaults to cancel.
Automation uses `empirical uninstall --yes` or `empirical uninstall --yes
--json`. Empirical removes marker-owned skills from every unique global catalog
root, removes valid owned selection metadata, and runs `npm uninstall -g
empirical-sdd` last. It preserves every project's `.empirical` history and
repository MCP/agent configuration, plus any unmanaged or unsafe global target.
