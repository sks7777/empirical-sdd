# Empirical protocol

## Shared contract

Schema 5 uses strict runtime schemas from `empirical-sdd/protocol`. CLI, MCP,
skills, storage, and the TypeScript API share the same workflow, phase, risk,
receipt, authorization, impact, policy, and completion definitions. Canonical
JSON and prefixed SHA-256 digests make durable documents independently
verifiable.

Every current action is an `ActionPacket` bound to one feature and exact
revision. Its essential fields are:

```json
{
  "kind": "action",
  "protocol": "empirical-sdd",
  "schemaVersion": 5,
  "feature": "add-team-invitations",
  "profile": "complex",
  "mode": "normal",
  "riskFloor": "behavioral",
  "interaction": { "questions": "concise" },
  "review": {
    "mode": "bot",
    "reviewerTokenEnv": "EMPIRICAL_REVIEWER_TOKEN"
  },
  "phase": "verify",
  "status": "waiting",
  "revision": 5,
  "completionLevel": { "highest": "implemented" },
  "tracker": {
    "health": "synced",
    "provider": "linear",
    "url": "https://linear.app/example/issue/ENG-42",
    "committedRevision": 5,
    "lastSyncedRevision": 5,
    "pendingRevision": null,
    "changeType": "feature",
    "ticketRequirement": "required",
    "failure": null
  },
  "completion": {
    "available": true,
    "mcpTool": "empirical_complete",
    "requiredFields": ["revision", "outcome", "summary", "receiptIds"]
  },
  "roadmap": {
    "schemaVersion": 1,
    "progress": { "index": 6, "total": 8 },
    "phases": [{ "phase": "verify", "state": "current", "needs": ["qa-unit QA receipt"] }],
    "checks": [{
      "id": "qa-unit",
      "gate": "verify",
      "state": "unrun",
      "receiptId": null,
      "lastDurationMs": null,
      "estimateMs": 130000
    }],
    "waitingOn": [{ "kind": "test-request", "text": "Ask to run 1 check (~2m 10s), or keep iterating" }],
    "nextAction": "Run qa-unit at revision 5 (~2m 10s) when you request tests",
    "verificationLeft": { "remaining": 1, "total": 2, "knownEstimateMs": 130000, "unknownEstimates": 0 }
  }
}
```

All mutations require the exact revision. A stale caller receives
`STALE_REVISION`; it cannot overwrite newer state.

Project Schema 5 stores `interaction.questions` as `concise | detailed`.
Action packets always expose the normalized effective value. Missing fields in
existing Schema-5 configuration normalize to `detailed` without a read-time
rewrite; new recommended setup explicitly persists `concise`.

Project Schema 5 also stores `review.mode` as `bot | fresh-context` and
`review.reviewerTokenEnv` as an uppercase environment-variable name. New
recommended setup persists `bot` and `EMPIRICAL_REVIEWER_TOKEN`. A historical
Schema-5 config with no review block normalizes to `fresh-context` without a
read-time rewrite. Credential values are runtime-only and never configuration
or tool input.

## Roadmap and the status card

The public `empirical status` command is checkout-aware. Its human and JSON
forms include the current symbolic Git branch, the checkout-local selected
feature, and a global SDD lifecycle projection. Active work is `in progress`.
When delivery has opened a source pull request, status also reports its number,
URL, branch, exact head, and durable `draft`, `ready`, or `merged` state.
Readiness stays `verification required` until exact verification and current-head
review proof both pass; only then is it `ready to merge`. Delivery rechecks that
proof immediately before removing draft status. A terminal feature is reported
as `done`. Status is read-only and never selects work from another checkout.

Action packets, `empirical_status` and `empirical_explain` return the same
derived `roadmap`, recomputed on every read from persisted state, the
verification matrix, immutable receipts, policy and decisions. Equal inputs
produce an identical roadmap, and an idle checkout returns `roadmap: null`.
Nothing about it is stored, and neither it nor its estimates change a gate or a
transition.

- `progress` and `phases[]` come from the engine's single phase order per
  profile: Complex has 8 non-terminal phases, Quick 5 and Fast 2. `deliver` and
  `publish` need separate authorization, so they stay outside `progress.total`
  and appear as phases only once the feature enters them. Only the current phase
  lists `needs`, and it lists only unmet ones.
- `checks[]` has one entry per matrix check, in matrix order, with its `state`
  (`passed`, `failed`, `unsupported`, `missing-environment` or `unrun`), the
  `receiptId` that proves it and its `lastDurationMs`. `passed` binds the same
  proof the completion gate requires, including the current repository tree
  digest, so any tracked edit after a run returns that check to `unrun`. `timed-out` and
  `cancelled` read as `failed`; `skipped`, stale and absent receipts read as
  `unrun` with `receiptId: null`.
- `estimateMs` on an unrun or failed check is the median duration of the last
  three or fewer completed attempts in this checkout with the same check id and
  a matching configured command, or `null`. A passed check has no estimate.
- `waitingOn[]` classifies everything that needs the user as `decision`,
  `authorization`, `environment`, `policy-gap` or `test-request`, each with one
  line of at most 160 characters. The full text stays where the engine already
  records it: `rationale.reason` for a blocked or awaiting-human state, and the
  phase `instructions` for a blocking consult finding or mockup divergence.
- `nextAction` names the concrete artifact, check, decision or tool and the
  exact revision; `rationale.nextAction` repeats it.

`rationale.missingContext` lists only unmet requirements: it excludes existing
artifacts, evidence kinds proven by accepted receipts at the current revision,
and QA checks whose roadmap state is `passed`. `requiredContext` is unchanged.

The CLI renders the same facts as one status card for `status`, `explain`,
`next` and `loop`, and the generated agent skills require that card at start or
resume, at every phase change, at every stop, and before any run whose summed
estimate is over 60 seconds or unknown:

```
Empirical · add-team-invitations · Complex · verify (5/7) · rev 5
Done:           specify, design, plan, implement
Not done:       verify: qa-unit unrun, qa-browser missing-environment
Next:           Run qa-unit at revision 5 (~2m 10s) when you request tests
Waiting on you: [test-request] Ask to run 1 check (~2m 10s), or keep iterating
                [environment] qa-browser needs isolated-consumer
Verification:   2 of 4 checks left (~2m 10s known; 1 unknown)
```

Empty sections read `none`, the sections always appear in this order, and
`--json` output carries `roadmap` with no rendered card text. The card reports
facts only; it authorizes no test run, push, merge or publication.

`empirical_overview` stays read-only and adds a bounded `roadmap` summary
(`progress`, `phase`, `nextAction`, a `waitingOn` count and a remaining-check
count) to each readable spec copy. An unreadable copy keeps its bounded
diagnostic and reports `roadmap: null`.

## Routing and modes

Public routing first selects `flow-direct`, `flow-delegated`, or `formal-sdd`.
Explicit delegated work selects Flow Delegated, an explicit SDD request selects
Formal SDD, and a negated SDD request cannot accidentally start Formal SDD.
Exploration facts may select Flow Delegated when the work benefits from fresh
context, broad research, or coordinated non-trivial writes. Flow Direct creates
no artifacts; Flow Delegated creates no artifact unless one bounded Flow Record
has recovery value; Formal SDD uses `.empirical/specs/<feature>/`.

Independently, routing calculates the strongest matching safety floor:

```text
contract-neutral < behavioral < sensitive < migration
                 < integration < delivery < publication
```

Explicit Fast may use the contract-neutral or ordinary behavioral floor for
small, scoped, reversible work, including UI features. Choosing Fast does not
erase actual behavioral impact. Routes report `matchedFloors`, every floor whose
signal matched. An explicit Fast request moves to Complex (`promoted: true`,
`fast-request-promoted`) when any matched floor is sensitive, migration or
publication, even if delivery wording ranks higher ("push the credentials").
Integration or delivery wording alone keeps explicit Fast and still reports its
floor and its `integration`, `delivery-authorization` and `protected-merge`
gates. Explicit Complex is always honored, and routing without an explicit Fast
request is unchanged. Normal and YOLO share the same risk classifier and safety
floors.

Routing signals are keyword heuristics that rewording can defeat, so they never
grant or deny authority. The boundary is the Fast profile guard (Fast cannot
consolidate, integrate, deliver or publish without explicit promotion), standing
authorization ceilings and the promotion proof gates. The safety-floor check in
Fast `iterate` follows the same rule.
YOLO additionally records one immutable authorization document bound to the
repository, feature, request digest, ceiling, target branch, agent permission,
and optional expiry. Publication cannot be inferred or granted by YOLO.

## Workflows

New Fast work is lightweight and explicitly unverified:

```text
implement → done (implemented; verification skipped)
```

Fast requires no test writing, test execution, formal review, or Context phase.
It preserves a short specification, truthful impact and its durable journal.
Without verified integration it does not promote canonical capability contracts.
Historical Fast records retain their original completion and evidence semantics;
reading them does not rewrite history or retroactively skip their gates.

New Complex features, including explicitly promoted Fast features, use:

```text
specify → design → plan → implement (refreshes context, projects capability deltas) → review → verify → integrate (standard binding: waits for the merge)
                                                            ├─→ done (integrated)
                                                            └─→ deliver → done (delivered)
```

The feature records `reviewFirst: true` when it starts or is promoted. Existing
features without the marker retain Verify → Review; reopening them does not
rewrite their state or rerun completed phases. Verify retains the approved
review receipt and rejects a changed reviewed commit with `REVIEW_STALE`.
Route that failure through Implement and Review before completing Verify again.

Delivery exists only when Policy v2 and standing authorization cover it.
Publication is a separate explicit, immutable operation after delivery.
`implemented`, `verified`, `integrated`, `delivered`, and `published` are
derived states; callers cannot assert them directly.

Fast iterates without leaving Fast:

```text
implement → done (implemented) → iterate → implement → done (implemented) → …
```

`empirical_iterate` on a waiting Fast Implement, or a Done Fast feature that is
implemented but not integrated, keeps profile and workflow `fast`, returns to
Implement, increments `lifecycle.iteration`, records the request as the
`Iterate: <request>` summary, clears optional receipt references, resets any
YOLO mode, and executes nothing. From Done it reacquires the checkout selection
in the same locked transaction, so a feature claimed by another checkout fails.
It refuses stale revisions, blocked or awaiting-human status, a changed spec,
`reviseContract` or `amendContract` (`PROFILE_CONFLICT`) and adjustments that reach a safety floor
(`PROMOTION_REQUIRED`). An iterated Fast feature (iteration at least one) keeps
its full verified journal at Done instead of compacting it, and Doctor exempts
exactly that case from `JOURNAL_TERMINAL_UNCOMPACTED`. Fast starts create
`decisions.md` from the template; Fast transitions never read it, and status and
explain report its format issues as warnings.

Outcomes are `passed`, `failed`, `awaiting_human`, and `blocked`. A failed Fast
Implement stays Fast: profile, phase, spec, approval and receipts are unchanged,
status becomes `blocked`, and the message names `empirical_retry` (resume Fast
Implement) and `empirical_promote` (continue through Complex Specify) as the
recovery paths. Explicit `empirical_promote` is the only operation that changes
a Fast feature to Complex; it requires the exact revision and a reason, is
accepted from that failure block, and preserves feature identity and immutable
history. Verify or Review failure returns to Implement within the configured
repair limit. Canonical reviews count recorded changes-requested results,
excluding Verify failures; at `maxRepairAttempts` (default 2), both triage and
the failed Review transition require a human choice. Older failure paths without
a recorded review retain their bounded automatic-repair behavior.

## Direct mode

Direct mode has no phases, gates, receipts or tracker effects, and records
nothing per turn. Its only persisted shapes are an optional `pause:
{ since, baseCommit }` on a feature's workflow state, emitted only while paused,
and two checkout-local files that are never committed:
`<git-dir>/empirical-sdd/direct-tracked` (the tracked commit, feature, time and
tracked uncommitted digests) and `<git-dir>/empirical-sdd/preferences.json`
(a personal `defaultMode`).

`empirical_direct` has exactly three actions. `pause` requires the exact revision
and a selected feature that is not Done and not awaiting a human; it checks no
specification, delta, decision, receipt or tracker gate. `resume` requires the
exact revision and folds the paths changed since `baseCommit`, excluding
`.empirical/`, into the feature as one `iterate` (Fast in Implement or implemented
Done, iterative Complex in implement, context, verify, review or integrate) or
otherwise as one journal event. A guard the user can clear without losing work
(`SPEC_CHANGED`, feature selection, tracker gates) leaves the pause in place; a
guard a paused feature cannot clear (`WORKFLOW_BLOCKED`, `ITERATION_NOT_READY`,
`PROMOTION_REQUIRED`, `CONTRACT_REVISION_REQUIRED`) records the resume as one
journal event naming that guard, since `retry` and `promote` refuse a paused
feature. The generated summary never routes the risk floor.
`track` rebuilds commits and uncommitted paths from Git and starts a Fast or
Complex feature under the existing start rules before advancing the marker. No
action packet, status, context or tracker projection reads the marker or rebuilds
direct history, and no action executes a configured check, test or build.

Paused features refuse every phase, lifecycle, QA, evidence, promotion, Integrate,
Deliver and Publish operation with `FEATURE_PAUSED` and expose only a paused action that
names `resume`. A state without `pause` normalizes to identical bytes.

`.empirical/config.json` accepts an optional team `defaultMode` of `empirical` or
`direct`; absence means `empirical` and never rewrites an existing file, and any
other value fails `INVALID_CONFIG`. The effective lane resolves as request phrase,
then continuation of a selected feature, then the personal `defaultMode`, then the
team `defaultMode`, then `empirical`. `activationMode` is independent and unchanged.

## Iterative feature development

For a larger feature that needs feedback before final QA, start Complex with
`iterative: true` (library: `complex(request, { iterative: true })`; private CLI:
`complex --iterative`). Existing starts without this option retain their behavior.
Fast remains available for small self-contained work and iterates on its own (see
Workflows); promote it explicitly before consolidating through this lifecycle.

The action and status expose optional `lifecycle` metadata:

```text
development: specify → design → plan → implement
iteration:   implement → wait for feedback → implement → wait for feedback
consolidation: context when needed → verify → review → integrate
```

Completing an implementation in this mode records it as implemented, keeps the
same feature selected, and waits for feedback. It does not execute tests or claim
verification. The returned action has `lifecycle.awaitingFeedback: true` and no
ordinary completion action. Repeating `complete` cannot silently close the feature.

Use `empirical_iterate` with the exact `revision` and an adjustment `request` to
start another implementation pass. It preserves the feature id, worktree and
journal, records the adjustment, and clears active evidence references and completion
claims. Immutable prior receipts remain available for audit. Tests remain on demand.
Ordinary Complex work may explicitly enter this loop from implementation or a
pre-integration assurance phase; completed/integrated work cannot be reopened.

When the user says "ready to close", call `empirical_consolidate` with the exact
revision and optional summary. Only a completed iteration can consolidate. This
returns the existing Context/Verify action; it does not execute commands and does
not authorize tests itself. "Ready to close" is the explicit final verification
request, so the agent runs the required Verify-gate QA once with
`verificationProfile: "final"`, then review and local integration, where full CI
runs once: Integrate accepts only an exact full-CI receipt for its own revision
and commit. Existing
receipt, risk, tracker and approval gates remain in force. Remote delivery and publication require their own authorization. QA or
review failures return to adjustments within the existing repair limits.

### Bounded implementation context

Every Complex Implement action carries `contractSummary`: a deterministic extract
built from the feature's own artifacts without a model call, holding the goal,
every acceptance criterion id (the text travels once, in the action's
`acceptanceCriteria`), one line per accepted non-superseded
decision, and the specification's open risks. It is bounded to 6,000 characters by
fixed shortening steps; criterion and decision ids are never dropped, a shortened
section names the document to open, and an ids-only form that still exceeds the
budget is reported with `overBudget: true`. `contractSummary.references` lists the
existing spec, design, decisions and plan documents as optional reading, never as
required context, and `capabilityContext` lists only the capabilities the feature's
own deltas declare. During an iteration the action also carries
`adjustmentRequest`, the newest request verbatim and outside the budget; it is
authoritative over conflicting earlier criteria and decisions. The agent implements
it first and records the superseding decision afterwards; a missing superseding
entry does not block Implement completion, and Review still rejects it.

### Amending the contract during iteration

While a Complex feature that started with the iterative opt-in
(`lifecycle.iterative`) is at its iteration stage, edits to acceptance criteria, to
the contents of already declared delta requirements, and to decisions are an
amendment by default. Ordinary Complex work that explicitly enters the iteration
loop never gains that opt-in: it keeps the strict approved-contract guards and
receives no baseline snapshot. `empirical_iterate` and the Implement completion accept them
without `SPEC_CHANGED` or `DELTA_CHANGED`, without returning to Specify and without
a human confirmation gate; `amendContract: true` (`--amend-contract`) is the
explicit equivalent and cannot be combined with `reviseContract`
(`INVALID_ARGUMENT`). On ordinary Complex work it is refused before any state
change with `CONTRACT_AMENDMENT_UNAVAILABLE`. Completion validates the amended criteria, delta structure
and decision links, re-approves the amended specification and delta digests in one
journal event, and keeps the original approved specification revision and
capability claim.

History is retained under `contract-revisions/`. The approved contract, its parsed
deltas, decisions and digests are snapshotted to `<revision>.baseline.json` when an
iterative implementation starts waiting for feedback and again after each
amendment. `<revision>.amendment.json` records the request, the baseline revision,
previous and current text per criterion id, and the decision ids the amendment
retired; replaced decisions stay in `decisions.md` as `Superseded` with reciprocal
links. Consolidation and Review actions, the Review packet and `empirical_explain`
list every amendment since the last full approval.

An amendment is refused with `CONTRACT_REVISION_REQUIRED`, and nothing is
re-approved, when the request or the amended criteria raise the risk floor, when a
delta capability is added or removed, when a requirement block is added, removed or
renamed or changes operation, or when `impact.json` changes. The error names the
baseline snapshot and `reviseContract: true`. The risk limit compares the resulting
risk level over criteria and declared requirement text, so rewording, reordering or
lowering the floor is not an escalation. A crossed limit refuses re-approval but never
blocks recording a `failed`, `blocked` or `awaiting_human` outcome. Outside the
iteration stage — Fast, non-iterative Complex, first development implementation,
consolidation, and Verify onward — contract edits keep failing with `SPEC_CHANGED`,
`DELTA_CHANGED` or `IMPACT_CHANGED`.

Retained history is authenticated: a baseline snapshot is trusted only while it still
reproduces the approved specification and capability delta digests, and a missing or
malformed amendment record fails with `CONTRACT_HISTORY_MISSING` or
`CONTRACT_HISTORY_INVALID` instead of silently shortening the listing Review reads.

### Revising the contract during iteration

For a raised risk floor or changed capability scope, call `empirical_iterate` with
`reviseContract: true` **before editing the frozen specification or deltas**.
Empirical retains the prior contract, parsed deltas, approval identity and evidence
references under `contract-revisions/<revision>.json`, then returns the same feature
to Specify, Design and Plan. Source edits and earlier journal entries are preserved.
An ordinary adjustment that raises the detected risk floor requires this explicit
revision. Risk from the adjustment and newly approved criteria is retained for
subsequent QA and specialist routing; revising scope grants no new YOLO authority.

Reapproval keeps the original capability claim and comparison commit. Newly touched
requirements are compared against that commit, preserving conflict detection against
concurrent work. If an original uncommitted capability baseline cannot prove newly
touched requirements, reapproval fails explicitly; retain the prior scope or start
separate work. A behavioral feature cannot be relabeled non-behavioral to discard
its original capability obligations.

Both lifecycle operations require an exact positive revision and the current
unblocked Complex feature. Concurrent calls against one revision admit a single
transition. Required tracker recovery and human blockers cannot be bypassed.
Private CLI equivalents are `iterate --revision N --request "adjustment"
[--amend-contract] [--revise-contract]` and `consolidate --revision N`. Worktree proposals bind
`iterative: true` into their approval identity, and creation/recovery preserve it.

## Design and mockups

Design happens twice, and both moments sit before code.

At onboarding, `.empirical/context/design-language.md` settles colors,
typography, spacing, and component character. Representative app screens are
offered there rather than required, and the choice is recorded either way in
`.empirical/mockups/decision.md`, so a later reader can tell a deliberate
decision from an unanswered question.

At Complex Specify, a feature with any `[UI]` acceptance criterion needs an
approved mockup before its contract freezes when `mockupsBeforeCoding` is enabled.
Disabling the saved preference removes the requirement for new mockups; existing
approved designs retain fidelity checks. One to three clickable directions live under
`.empirical/specs/<feature>/mockups/`, entered through `mockups/index.html`, and
`empirical mockups` serves them on a loopback address so whoever approves can
click through instead of reading a description. Both the entry screen and the
approval are required, because an approval naming a direction nobody built is a
signature on nothing. The timing is the point: a mockup seen while the contract
is open can add acceptance criteria, while one produced after the freeze can only
comply with them.

```text
.empirical/specs/<feature>/mockups/approval.md
- Chosen: <direction, and what makes it the right one>
- Approved by: <who approved it>
- Ruled out: <the other directions, or "nothing, only one was built">
- Styling: tokens or reference
```

`Styling` is exactly `tokens` or `reference`: tokens when the mockup imports the
repository's real stylesheet, reference when it only shows layout. Leaving it
unstated is how a builder guesses and the result diverges. The parsers accept the
shapes people actually write — bullets, numbers, bold labels, headings, values
running onto indented lines — but never a value that would have to be guessed at,
and a field stated twice is an error rather than a first-match win.

At Verify, any feature with an approved mockup owes `mockups/fidelity.md`. An
unaccepted divergence returns the work to implementation. Features approved
before this flow existed have no approval, so they are never retroactively
blocked.

```text
.empirical/specs/<feature>/mockups/fidelity.md
- Verdict: loyal or diverged

### Divergence: <screen>
- Divergence: <what differs from the approved direction>
- Accepted: yes or no
- Rationale: <required when accepted>
```

A document that exists but cannot be read is reported as malformed with the
parser's reason, never as missing, so an author is never told to write a file
they already wrote.

App mockups are entered through `.empirical/mockups/index.html`, the same way
feature mockups are. `empirical mockups --scope app` serves them without
resolving an active feature, so a checkout with parked work can still review its
own design; when that entry screen is absent it answers from the recorded
decision rather than from a missing directory.

The `ui-ux` specialist consult is bound to Specify for the same reason the mockup
is. The preview server binds 127.0.0.1 only, serves read methods only, refuses
paths that escape the mockup directory before and after resolving links,
redirects a directory request that lacks a trailing slash so relative links
between screens work, blocks the page from making outbound requests, and stops
itself after a lifetime bound so a forgotten preview cannot hold a port.

## Impact and capabilities

Complex Specify freezes a digested impact manifest. Behavioral work must name
capabilities and provide valid ADDED, MODIFIED, or REMOVED delta documents.
Non-behavioral work must name no capability and provide a regression rationale.

Behavioral capabilities are claimed below the repository Git common directory,
so linked worktrees see the same provenance. Claims are non-exclusive by default:
multiple specs can pass Specify and progress in separate worktrees even when
they affect the same capability. Each checkout still selects one active feature.
A claim records each capability's base digest. Integrate replays the reviewed delta against the current target,
detects conflicts, validates the candidate in an independent worktree, commits
the canonical projection transactionally, and writes an immutable receipt.
Independent validation never executes a full-CI command. With coverage it runs
the Verify selection's commands (computed without changed test files) in policy
order. Every other bare non-full-CI command is `covered` (with the selected
commands) when they cover every check it declares, and `notSelected` with a
reason otherwise; an empty selection runs every bare non-full-CI command. Coverage is disabled, so
every bare non-full-CI command executes, when the source overlay changes the
target's `.empirical/policy.json`, a `package.json` `scripts` object or a file a
non-`bun run ci` full-CI command runs. Changed-file commands are skipped whenever
other commands exist. When only full-CI commands are configured nothing replays:
the plan carries a `note` that the promotion route proves full CI, and one
receipt digest binds that plan. The deprecated `integrationReplayPlan` export keeps
the 0.36 planner for existing callers; Integrate no longer uses it. When validation runs, the integration result's
`replay` lists the `executed` ids, `covered` ids with their `coveredBy` commands,
skipped `changedFiles` ids and whether `coverage` applied; each executed command's
receipt digest input includes this plan. The integration receipt records the
optional `promotionRoute` Integrate used; readers tolerate its absence. Resuming from an existing receipt omits `replay`.
Direct Schema-4 Archive is retired.

## Repository identity

A repository is identified by its lineage: the root commit of HEAD's
first-parent history, hashed. Every clone agrees on it, at any path, on any
machine, so a durable artifact written in one checkout is recognised in another.
It ignores roots that other refs bring in (`refs/notes/*`, an orphan `gh-pages`
branch) and histories merged in through a second parent, so those never change
it. A repository with no commits, or a shallow clone that cannot see its root,
has no lineage and falls back to its own path.

Every place that verifies a stored record accepts this repository's accepted
ids: the lineage id, this checkout's path id and any recorded predecessors.
Nothing in progress at upgrade time is stranded, including receipts, claims,
QA retries, standing authorizations, tracker lifecycle evidence and pending
transfers. Delivery and publication keep using the id their standing
authorization was created with. That keeps request digests, publication
receipts and pull-request idempotency markers written before the upgrade
matching, so delivery resumes instead of opening a duplicate pull request. New
authorizations use the lineage id.

Sharing a lineage does not make two copies share state. Locks, capability claims
and transfer intents live in one checkout's Git directory, so integration
targets still require a linked worktree in the current clone. Explicit transfers
between live owners remain local; fresh-clone recovery uses portable comparison
data and creates local ownership without copying locks.

Newly approved features also keep `capabilityBase` in their journal/state: the
original claim and comparison snapshots. A fresh full clone may restore a missing
local claim from those validated snapshots with its own worktree identity. The
original comparison commit must exist and match its recorded tree; unrelated
repositories and altered snapshots are refused. Existing local claims are never
overwritten. Legacy specs acquire this data on a subsequent mutation in their
original checkout. Without it, legacy integration still requires that checkout.

A working copy is identified separately, by the canonical path of its checkout.
That identity is deliberately local: it records which copy owns a capability
claim and means nothing elsewhere. The delegation ledger sits beside the Git
directory and coordinates one machine's checkouts, so it stays keyed by the
path-derived repository identity throughout and never travels.

Before this, both identities were the absolute path of the checkout's Git
directory. Receipts and claims written then carry the writing machine's path
identity, which no other machine can recompute. A repository records those in
`.empirical/identity.json`:

```json
{
  "schemaVersion": 1,
  "repositoryId": "sha256:<lineage identity of this repository>",
  "priorRepositoryIds": ["sha256:<a path identity this repository was known by>"],
  "recordedAt": "<ISO-8601>",
  "reason": "<why these identities are this repository's own>"
}
```

The record is committed and reviewed like any other contract, and widens nothing
by itself: it is honoured only when its `repositoryId` is the lineage identity of
the repository reading it, so a record copied into another repository is ignored
rather than trusted. An artifact is accepted when its recorded repository id is
the lineage identity, this checkout's own path identity, or one the record names
— never merely because it is unrecognised. Removing the record re-refuses the
artifacts it admitted; it is the basis on which they are accepted, not a cache.

## Evidence receipts

New Fast packets expose `verification: "skipped"`, no required evidence and a
null verification matrix. Completion reaches `implemented` with `verified:
false`; integrity validation is not a claim that tests ran. Complex and
historical evidence-backed histories expose their actual pending or verified
status. Explicit promotion preserves receipts as historical artifacts without
carrying old proof references into the new Complex contract.

`empirical_evidence_execute` runs one exact Policy v2 argv without a shell.
`empirical_evidence_collect` fingerprints repository-contained artifacts.
Both produce immutable receipts containing criteria, evidence kinds, source
provenance, command or artifact results, timestamps, and a canonical digest.

`empirical_qa_plan` derives a canonical verification matrix from the approved
criteria, routed risk floor, impact capabilities/surfaces, and Policy v2 command
`checks`. Rows select focused unit, integration, adapter-contract,
fault-injection, package-consumer, clean-clone, end-to-end, cross-platform,
fresh-context, live, and full-CI acceptance only when applicable. Each criterion
must have an executable command or explicit human route; unavailable rows remain
visible and block verification.

`empirical_qa_execute` and `empirical_qa_record` create the additive `qa`
receipt variant. It binds the matrix, workflow revision, Git commit, source tree,
specification, policy, repository, feature, platform/runtime, bounded command or
human attempt, duration, artifacts, cleanliness, and every retry/anomaly. A
failed, timed-out, cancelled, skipped, unsupported, missing-environment, dirty,
mutating, or retried attempt cannot silently become verified. Fresh-context QA
does not carry review evidence and cannot replace independent review. In the
opposite direction, a current approved canonical review covers non-UI
fresh-context acceptance when no acceptance command is configured. Verify records
a `verificationCoverage` entry of kind `review-derived` in the journal/state,
binding the review receipt, matrix, specification and revision; it is not an
executed QA receipt. The roadmap names that review receipt.

Policy `verification.notApplicable` may exclude package-consumer, clean-clone or
cross-platform checks with a 20–500-character reason. Exclusions remain in the
matrix and policy digest; essential unit, fresh-context, UI/live acceptance and
full-CI checks cannot be excluded. See [configuration](configuration.md).

When the executed policy command declares `scope`, the `qa` receipt provenance
also carries `scope` (the normalized declared entries) and `scopeDigest` (a
digest of the content under that scope plus global configuration and
argv-named paths, computed before execution); both are covered by the receipt
digest and must appear together. Only the Complex Verify gate and the status and
roadmap reads that mirror it accept such an executed, non-full-CI receipt when
`scopeDigest` matches although `treeDigest` does not. Once recorded by a passing
Verify transition, that receipt remains scoped Verify evidence when carried
through Review and later phases; it does not become review or promotion proof.
Review artifacts, full-CI receipts and other receipt kinds still compare
`treeDigest` exactly. Receipts without these fields are unchanged.

**Recorded scope.** An executed receipt's recorded `scope` must still equal a
current policy command's declared scope. That command must have the same
`cwd` and an argv that is a prefix of the attempt's argv. A `"workspace"`
declaration requires `scopeSource: "workspace"`, and a declared list requires
its absence. A receipt narrowed or relabeled after recording is stale.

**Paths.** Scope entries and matched paths are NFC-normalized, and repeated
`**` segments collapse.

**Human records.** A human `qa-record` may declare `assessedPaths`. The
record then carries `scope` and `scopeDigest` computed with no runner files,
so it binds those paths plus global configuration. Every entry must match at
least one repository file. During the Verify phase it stays valid while that
digest matches; carried into later phases it needs the exact tree again. Without
`assessedPaths` it binds the whole tree.

**Line endings.** New `qa` receipts also carry `textTreeDigest`: the tree
digest with CRLF normalized to LF in text files (no NUL byte in the first 8,000
bytes). Scoped digests normalize the same way. Line-ending-sensitive files keep
exact bytes: shell, batch and PowerShell scripts, files starting with `#!`,
snapshots, patches, CSV/TSV data, makefiles and Dockerfiles.
- **Where it applies:** the Verify gate and the status reads that mirror it.
  There, a receipt that doesn't cover full CI stays valid when `treeDigest`
  differs but `textTreeDigest` matches, meaning only line endings changed.
- **Where it doesn't:** full-CI, promotion, Integrate, Deliver and Publish proof
  keep exact byte binding.
- **Limitation:** a line-ending-only behavior change in any other text file is
  not caught at Verify. It is caught by the exact full-suite proof at promotion.
- **Upgrade note:** scoped receipts recorded before this change on a CRLF
  checkout no longer match their scope digest and must run again (fail closed).

Evidence-backed completion accepts receipt IDs only. It validates digests, criterion coverage,
required test/review/UI kinds, artifact containment, source binding, and phase
applicability. A copied boolean such as `passed: true` is never evidence.
On the local promotion route, Integrate and Deliver additionally require an
explicit passing `full-ci` QA receipt for their exact current workflow revision,
Git commit, and source tree before the first overlay or remote effect, with the
carry-over exception below; on route `ci` pull-request checks prove the exact
head before Deliver merges. Publish always requires its own such receipt.
`reuseReceiptId` always keeps exact workflow-revision matching, and Publish
accepts only its exact local receipt.

**Full-suite approval.** A fresh local full-CI execution requires an immutable
approval at `.empirical/specs/<feature>/full-suite-approvals/<id>.json`:
`{ schemaVersion: 1, id, feature, workflowRevision, gitCommit, treeDigest,
policyDigest, commandId, argvDigest, estimateMs, route, confirmation,
authorizationDigest, createdAt, digest }`. `id` is
`full-suite-approval-<24 hex>` from the digest of every field except `id`,
`schemaVersion`, `confirmation`, `createdAt` and `digest`; `digest` covers the
rest. `confirmation` is `elicited`, `agent-relayed`, `cli`, `cli-unattended` or
`publication-authorization`; an optional `renewal` (part of the id) distinguishes
a new approval of an identity whose earlier approval was used. Writes are
idempotent (content other than time and confirmation converges; different content
under the same id raises `FULL_SUITE_APPROVAL_CONFLICT`) and change no workflow
state. Each approval authorizes one run: a use record is written exclusively at
`.empirical/specs/<feature>/full-suite-approval-uses/<id>.json` before the
command starts, and a used approval never matches again. Execution matches every identity field including the
estimate; unreadable records never match. Without a match it refuses with
`FULL_SUITE_APPROVAL_REQUIRED` before any process starts. At the publication
boundary a verified publication authorization with ceiling `published`, bound
by `publicationRequestDigest` to the repository, feature, package, version,
dist-tag and current commit, is the approval and is recorded with its digest.

QA planning and execution take an explicit `verificationProfile`. `iterate`
executes only `testFiles: "changed"` commands; `final` is the full configured
scope, except that Fast `final` excludes full CI. The profile filters commands
and never enters the matrix, so receipts from either profile share one matrix
digest. Fast receipts stay optional and never make Fast verified.

**Integrate-to-Deliver carry-over.** Deliver accepts the full-CI receipt that
Integrate recorded, unchanged, when all of these hold: the verified journal
(`readJournal`) head state equals the `state.json` projection byte-for-byte in
canonical form; the head is a `transition` whose consecutive states are exactly
the Integrate completion (integrate/waiting to deliver/waiting, revision plus
one, derived integrated completion, a single added receipt id, an `Integrated`
message and every other state field identical); that added id is a `qa` receipt
recorded at the preceding revision; repository, feature, Git commit, tree digest,
spec revision and digest, policy digest and matrix match; the latest attempt's
argv, cwd, timeout and output bound equal the configured full-CI command; its
runtime and executable digests and platform equal the current values; and the
checkout is clean. There is no other admitted transition: retry, iterate,
consolidate, promote, contract revision, delivery review repair, transfer or any
state-neutral transition after Integrate requires new proof. Failures return
`QA_PROMOTION_REQUIRED` with `details.mismatch`. Tracker synchronization writes
outside the journal, so it never intervenes; a future journaled tracker event
would need its own explicit decision.

**Delivered-head binding.** For exact, carried-over and remote proof alike,
Deliver compares the source pull request head with the proven commit once the
head is known (after push, draft repair, resume, or for an already merged source
pull request) and before check polling, review, ready or merge. Only
`.empirical/specs/<feature>/` files and `.empirical/capabilities/<name>/spec.md`
projections whose content has the integrated receipt digest may differ; any
other path fails with `QA_PROMOTION_REQUIRED` and
`details: { mismatch: "delivered-head", paths }`, so a new Deliver commit
requires new proof.

## Promotion route

Each feature has a deterministic `promotionRoute`
`{ mode, route: "ci" | "local", reasons[] }` derived only from committed policy
and local Git, with no network reads. An omitted `promotion.fullCi` is `auto`,
which checks, collecting every failure:

- `REMOTE_CHECKS_NOT_CONFIGURED`: delivery is not GitHub or `requiredChecks` is empty.
- `FULL_CI_COMMAND_MISSING`: no full-CI command is configured.
- `REMOTE_TARGET_BASE_UNRESOLVED`: no target branch, or the last-fetched
  `origin/<targetBranch>` ref is missing, already contains the candidate, or Git failed.
- `REMOTE_CONFIGURATION_CHANGED`: the eligibility paths below changed from the
  merge base to `HEAD`.
- `REMOTE_MUTABLE_WORKFLOW_REF`: a mutable `uses:` reference on either head.

With no reason the route is `ci`, otherwise `local`. A `ci` result also needs a
verified standing authorization reaching at least `delivered`; without one the
route is `local` with `DELIVERY_NOT_AUTHORIZED`, because PR CI proves full CI only
at Deliver. After Deliver's `auto` fallback,
`.empirical/specs/<feature>/delivery-promotion-route.json` records the local route
and reasons for that exact Deliver revision. An explicit `local` returns
`local` with `LOCAL_MODE_EXPLICIT`; an explicit `remote-checks` returns `ci`,
reports its reasons and never falls back. The target branch is the authorization
target, else `delivery.targetBranch` in the strict policy at the capability claim
base, else the current policy's. Any unexpected failure fails closed to `local`.
The roadmap's promotion full-CI check carries `route` and `reasons`; on `auto`'s
`ci` route it is noted `proven by PR CI at Deliver` and is never a test request,
and on route `local` an unapproved run is one `authorization` waiting item naming
the command, estimate, revision and first reason. Deliver re-checks eligibility
with GitHub reads; under `auto`, ineligibility switches its result to route `local`
without merging.

## Remote required-check proof

Remote proof applies under `promotion.fullCi` `auto` (its route `ci`) and
explicit `remote-checks` (which requires GitHub delivery, at least one required
check and a configured full-CI command). It applies only to Integrate (explicit
`remote-checks`) and Deliver.

**Receipt.** Passing proof is an immutable `remote-checks` receipt
(`remote-checks-<24 hex>`). It records repository, feature, spec revision and
digest, tree and policy digests, workflow revision, the exact commit, the GitHub
repository (`owner/repo` from the `origin` push URL), gate, matrix digest, the
full-CI command id and argv digest, the target branch and its source
(`authorization` or `integration-target`), the target base, merge base and remote
head commits, the pinned required set, and for each required check its name, app
id and slug, check suite id, run id, head SHA, workflow run id and attempt (null
outside GitHub Actions), `completed` status and `success` conclusion. Only passing
proof is written; it contains no token, header, stderr or response body, and a
backstop scan rejects credential-like text before persisting. Qa-only consumers
(Verify, reuse, Publish selection) ignore the kind; `empirical_verify` counts a
passing remote receipt at the current revision toward the promotion full-CI check
under `auto` or `remote-checks`.

**Repository and reader.** The GitHub repository is parsed from
`git remote get-url --push origin` (`https://github.com/<owner>/<repo>` or
`git@github.com:<owner>/<repo>`); anything else is `REMOTE_REPOSITORY_UNRESOLVED`.
The default reader runs only `gh api <path>` or `gh api --paginate <path>` against
fixed read-only endpoints with literal repository segments, per-segment encoded
branch names and 40-hex SHAs, without `GH_REPO` or `GH_HOST`. Failures carry only
a code, HTTP status and endpoint template. Hosts inject another reader for tests.

**Target and eligibility.** The target branch comes from a source the candidate
cannot edit: for Deliver the immutable `authorization.targetBranch`; for
Integrate the checked-out branch of the independent target root, which must equal
`authorization.targetBranch` or, without one, `delivery.targetBranch` in the
strict policy at the capability claim base commit. Remote proof is refused, and
local exact full CI is required, when the target head cannot be read or is
missing locally, the merge base equals the candidate head, the target-base policy
is not `auto` or `remote-checks` or differs from the branch policy digest, the branch
changes `.empirical/policy.json`, `package.json` scripts, `.github/workflows/**`,
`.github/actions/**`, `scripts/**`, a lockfile (`bun.lock`, `bun.lockb`,
`package-lock.json`, `npm-shrinkwrap.json`, `yarn.lock`, `pnpm-lock.yaml`),
`.gitmodules`, any symlink or gitlink entry, or a file a non-`bun run ci`
full-CI command runs (task-runner manifests in its `cwd` such as `Makefile`,
`justfile`, `Taskfile.yml`, `turbo.json`, `nx.json`, `noxfile.py`, `tox.ini`,
and relative paths in its argv) relative to the merge base, the
target's workflows use a `uses:` reference not pinned to a full SHA or Docker
digest (or a local action outside `.github/actions/` and `.github/workflows/`),
or the checkout is dirty.

**Evaluation.** Every policy check name must be required by the target's enforced
branch protection or rulesets with one concrete app pin. Only check runs from
that app count; commit statuses never do. Every run must be for the exact head,
which must equal the remote branch head and the clean local HEAD. Runs group into
execution units, the workflow run for GitHub Actions and the check suite
otherwise, and the latest attempt of every unit that emits the name must have
completed with `success`; an honest re-run replaces its failed attempt, while a
separate run never outranks a failed one. Missing, pending, failed, cancelled,
timed-out, skipped, neutral, action-required, stale or startup-failure results,
checks that are not required, a head mismatch, an unreadable or disagreeing
required set, ambiguous sources and reader errors produce no receipt and a named
reason.

**Integrate** on `auto`'s route `ci` needs no proof. Under explicit
`remote-checks` it uses remote proof only for an exact commit already on its
remote branch: one read, no push, fetch or polling, before any overlay or
capability write. Independent integration replay still runs in the target, without full CI.

**Deliver** resolves exact local proof, then carry-over, then remote eligibility.
Explicit `local`, or no GitHub delivery, stops at the missing local receipt.
Explicit `remote-checks` checks eligibility before any push. Under `auto`,
Deliver may push and open the source pull request either way. It then polls for
proof before check waiting, review, ready and merge, returning
`promotion-proof-required` with the reasons and `route: "ci"` while it is not
satisfied (terminal reasons stop polling). Under `auto`, an ineligible result
(eligibility failure, or `REMOTE_REQUIRED_SET_UNREADABLE`,
`REMOTE_REQUIRED_SET_DISAGREES`, `REMOTE_CHECK_SOURCE_UNPINNED`) returns
`route: "local"` with `approval: { commandId, estimateMs, revision }`. Passing proof is bound per head at
`.empirical/specs/<feature>/delivery-promotion-proof/<headCommit>.json`
(`schemaVersion`, `githubRepository`, `headCommit`, `receiptId`, `receiptDigest`,
`digest`), created exclusively; a review-repair push gets a new binding. A binding
is valid only when its digest verifies, its head equals the requested and pull
request head, its receipt passes validation with the recorded digest, is a
`remote-checks` receipt for the Deliver gate with that remote head and
repository, and its provenance matches the current candidate. A merged source
pull request without a valid binding fails closed before evidence work. The
delivery receipt records `promotionProof` for remote proof, and the delivered
transition adds its receipt id.

**Publish** rejects `remote-checks` receipts (`REMOTE_PUBLISH_REJECTED`) and
keeps requiring its exact local full-CI receipt.

**Residual trust.** Under remote proof these remain trusted, at parity with a
local full-CI run unless noted: install-time and runner configuration
(`bunfig.toml`, `.npmrc`, `.yarnrc.yml`, `.pnpmfile.cjs`, `pnpm-workspace.yaml`,
and `package.json` fields other than `scripts`), named as candidates for a future
decision; `tsconfig`, test runner configuration, tests and sources, where review
is the control; workflow behavior that depends on branch content (`paths`
filters, step `if:`, `hashFiles`, `vars.*`), which can succeed with skipped
steps; `.gitattributes` filters and LFS pointers; existing base symlinks into
unlisted directories; files outside the listed paths that workflow `run:` steps
execute; GitHub run history, since deleting a failed workflow run removes its
check runs (which requires repository administration rights); the Integrate
target root beyond its branch binding; and GitHub itself, including the pinned
app, branch protection and rulesets. Journal events, snapshots, receipts and
proof bindings are unkeyed self-digests: their integrity assumes no local
filesystem writes outside Empirical, and anyone able to rewrite them could
equally forge a current-revision receipt, so carry-over adds no capability.

Code-review evidence additionally requires `empirical_review`. Its preparation
form returns a packet bound to the exact committed `base...HEAD` diff, ordered
criteria, and accepted decisions. Its recording form accepts a structured
result from an isolated reviewer invocation and renders one canonical body:
verdict heading, one ordered PASS/FAIL bullet per criterion,
security/correctness, then design/maintainability. Bot mode first uses one
readiness definition to require a runtime credential, repository access, and a
login distinct from the author. Fresh-context mode uses no second credential
and does not claim independent forge approval.

Authorized delivery opens source and evidence PRs as drafts and returns an
exact remote review packet before either can become ready. Request changes
leave the PR draft. Approval is current-head-bound; bot mode accepts GitHub
`reviewDecision == APPROVED` or an effective latest non-author approval with no
superseding changes requested, covering repositories where the aggregate
decision remains empty. Draft, stale-head, failed-check, force, and admin merge
paths remain forbidden.

After Complex Implement, Empirical inspects context freshness from Git history. Source-neutral work advances
normally; source changes that leave knowledge stale, missing, invalid, or
placeholder-only route to the persisted `context` phase. Context completion
requires an explicit refresh, evidence-backed topic refinement, managed-marker
removal, and a second refresh whose report has empty `stale`, `missing`, and
`refinementRequired` lists.

## External tracker projection

Tracker setup is an optional sidecar to Schema 5. An absent file means no setup
choice has been recorded and retains historical `local-only` runtime behavior;
the strict `{ "schemaVersion": 1, "mode": "disabled" }` record means the user
explicitly chose No tracking. Neither state triggers a workflow schema
migration or provider access. Tracker Policy v1/v2 records choose one GitHub,
Linear, Jira, or Plane target, store the complete normalized `specification`, `planned`,
`in-progress`, `verification`, `review`, `blocked`, and `done` map, and
reference fallback credentials by environment-variable name only. Credential
names use the strict uppercase runtime grammar. Policy stores neither values,
OAuth connection identity, tokens, nor provider authorization.

Authentication is a runtime-only concern. A trusted host OAuth resolver is
queried first and returns only a strictly typed, in-memory provider credential.
Plane is the exception: Plane Personal Access Tokens do not use this OAuth
resolver and are read only from the complete host environment or guarded
host-only secrets file named by policy.
When authorization is needed, its secret-free descriptor may cross MCP only by
explicitly negotiated URL-mode elicitation. Form elicitation and ordinary tool
input/output are never credential channels. If OAuth is unavailable or
declined, resolution checks one complete injected environment source, then one
complete guarded user secrets file source; it never combines a partial Jira
identity across sources. The fallback file is outside the repository at
`${XDG_CONFIG_HOME:-$HOME/.config}/empirical/secrets.env` on POSIX or
`%APPDATA%\Empirical\secrets.env` on Windows. **Never paste credentials into
chat.**

Policy v1 remains readable and byte-preserved. Its effective behavior is manual
ticket binding plus the legacy provider projection. Policy v2 adds `ticket` as
`off | manual | ensure` and `visibility` as `blockers-final | milestones |
revisions`. `off` performs no provider access. `ensure` binds one valid request
reference, one exact stable-marker match, or a newly created ticket only after
a complete zero-match reconciliation. Ambiguity is durable failure state, never
a selection heuristic.

Policy v2 may add a strict complete `ticketRules` matrix only when `ticket` is
`ensure`:

```json
{
  "ticketRules": {
    "feature": { "fast": "required", "quick": "required", "complex": "required" },
    "fix": { "fast": "optional", "quick": "required", "complex": "required" },
    "chore": { "fast": "optional", "quick": "optional", "complex": "optional" }
  }
}
```

Each cell is `required`, `optional`, or `off`. Resolution uses the persisted
workflow profile and the same request classifier as worktree routing. Required
uses the existing attach/reconcile/guarded-create path. Optional attaches one
explicit reference but, with none, returns local-only before credential or
provider resolution. Off returns before provider access. Rule-less v2 and all
v1 policies keep their prior semantics. Rule-backed status adds `changeType`
and `ticketRequirement` without changing the existing `ticket` field.

Discovery is ephemeral and provider-neutral: strict input names a provider and
fallback credential-variable names, while runtime resolution remains
OAuth-first; output contains canonical/display identities, parent
relationships, state semantics/positions, capabilities, completeness, and a
digest. Mapping suggestions rank provider semantics and lifecycle position
before name refinements, allow shared provider states, and leave tied primary
ranks unresolved. Preview repeats discovery and validates the entire selected
hierarchy and map before atomic policy persistence.

The local journal commits first. A tracker sync then writes a checksummed
feature-local pending operation keyed by feature and revision, converges one
target-bound ticket, and advances the binding only after remote success. Policy
v2 pending records additionally acknowledge deterministic state-transition,
milestone-comment, and artifact effects separately. Effect keys bind provider
target, feature, revision, sorted receipt digest, kind, and artifact digest, so
partial retry skips confirmed effects. The
binding and pending operation retain digests of the exact provider target and
effective policy. Reconfiguring the target therefore fails locally instead of
combining an old remote identity with a new destination. Changing the status
map for the same target invalidates the synchronized fast path and reprojects
the committed revision through the new mapping.

Durable pending work is the reconciliation source after interruption. Normal
retry resumes that exact operation before deriving newer work. A persisted
`dispatched` flag separates a create that has never been sent from one that may
have reached the provider. Sync may send the initial create only while the
intent is durably undispatched. Once it is marked dispatched, retry performs a
bounded lookup for the exact persisted create marker and never sends that
attempt again automatically; without one unique match, explicit attachment is
required unless the caller confirms a new attempt while accepting duplicate
risk.

Policy v2 milestone comments append phase, revision, progress, completion,
summary, blocker, and reviewable artifacts without editing human descriptions.
Artifacts can originate only in committed immutable collected receipts and are
rechecked for digest, containment, symlinks, media type, secret-like path, count,
and size before upload or a commit-pinned durable link. Artifact bytes and
credential values are never persisted in tracker state. Existing v1/v2 policy
bytes and valid names such as `LINEAR_API_KEY` remain compatible; only new
Linear setup suggests `LINEAR_SECRET_KEY`.

The remote system is never read as workflow authority. Provider failures
therefore change only tracker health (`pending` or `failed`) and cannot alter
the phase, revision, criteria, or completion level. Status reports policy
behavior, remaining effects, committed/last-synchronized/pending revisions, and
bounded credential-safe failure context without contacting the provider.

## Persistence

```text
.empirical/config.json                         # Schema 5
.empirical/policy.json                         # Policy v2
.empirical/tracker.json                        # disabled setup record or Tracker Policy v1/v2
.empirical/context/reviews/<page>/<id>.json    # context review records; freshness comes from Git
.empirical/capabilities/<capability>/spec.md
.empirical/mockups/decision.md                 # app mockups adopted or declined
.empirical/specs/<feature>/state.json
.empirical/specs/<feature>/closure.json        # written once, only by a forced closure
.empirical/specs/<feature>/mockups/approval.md # approved before the contract freezes
.empirical/specs/<feature>/mockups/fidelity.md # what was built against what was approved
.empirical/specs/<feature>/impact.json
.empirical/specs/<feature>/evidence/receipts/executed-<id>.json
.empirical/specs/<feature>/evidence/receipts/collected-<id>.json
.empirical/specs/<feature>/evidence/receipts/qa-<id>.json
.empirical/specs/<feature>/tracker/binding.json
.empirical/specs/<feature>/tracker/pending.json
.empirical/specs/<feature>/events/snapshot.json
.empirical/specs/<feature>/events/NNNNNNNN.json
```

Events contain sequence, previous-event digest, before/after state digests, and
the resulting state. Terminal completion transactionally promotes a verified
snapshot and retains one linked compaction-boundary event. State JSON remains a
recoverable projection of that authoritative chain.

### Forced closure

A feature that cannot satisfy its next gate is closed explicitly rather than
left selected forever. `feature-close` either terminates the feature or
advances exactly one stage past the gate, against a required bounded public
reason. It is an ordinary recorded transition with the distinguishing actor
`empirical-force-close` or `empirical-force-phase`, so the override is visible
in the same hash chain as every other change. Approval is bound to the
previewed workflow revision; if the feature changes before apply, closure
refuses and requires a new preview. Cleanup uses the same rule with a digest of
the exact orphan entries.

A terminal closure reuses `phase: "done", status: "done"` and adds one optional
`closure` field naming the outcome — `abandoned`, `superseded` or
`merged-externally` — the phase it stopped at, the completion level it had
reached, and, for an observed external merge, the pull request and merge commit.
Reusing the terminal phase and status keeps selection release, recovery
bookkeeping and journal compaction unchanged; the field is emitted only when a
closure exists, so every earlier state keeps identical bytes and Schema 5 needs
no migration.

Closure records nothing about what the feature achieved. It carries completion
facts through unchanged, re-derives them, and refuses any change of rank, so a
feature closed at Implement stays at completion `none`. Observed external merge
facts sit beside completion in the same way confirmed tracker delivery facts do:
they are real, and they do not replace the digest-verified delivery receipt that
defines `delivered`. This is the operation the Schema 5 `archive` stub never
provided; `archive` itself still refuses in favour of `integrate`.

### Reconciling merged work

When review and merge happen on the forge, the session that merged a feature
often never returns to record it, and the feature stays unfinished. `reconcile`
plans closure for every unfinished feature in the checkout without selecting it. It
reads the last non-merge commit that changed `.empirical/specs/<feature>/` on
the target ref (the remote-tracking branch when present), asks the forge which
merged pull request into the target contains that commit, and applies the same
`merged-externally` proof as `feature-close`: merged state, an exact merge
commit that is an ancestor of the target, and a merge-commit diff that changed
the feature's specification. Ownership is proven from that Git diff, never from
the forge's file list, which stops at 100 files.

Each feature is `closable` (Implement or later with proven evidence),
`needs-decision` (before Implement, because a specification can ride along in
another feature's pull request, or without proven evidence), `skipped` (selected
or claimed by another live checkout) or `excluded` by the user. Apply requires
the preview's digest, which binds the target commit, the exclusions and every
candidate's revision, classification and merge facts; any change refuses with
`RECONCILE_PLAN_CHANGED`. Each closable feature closes in its own transaction
with actor `empirical-reconcile`, writing the same closure record as
`feature-close`. A capability claim is released only when it belongs to this
checkout; a claim absent on this machine never blocks closure, and one of a
vanished checkout is left for `cleanup`.

`status` (`mergedNotClosed`) and `overview` flag the likely candidates offline:
an unfinished feature whose `state.json` is byte-identical to the target's copy
merged in that state and never advanced. The hint uses two Git calls and no
forge; reconcile re-proves every candidate before closing it.

## Local finalization before PR merge

`feature-finalize` is the normal non-YOLO action at Integrate. With a clean
checkout, exact revision and independent target worktree, it revalidates the
approved spec, scoped verification and configured canonical review, then
integrates local capability projections and writes all terminal records on the
source branch. Full-CI promotion proof is not needed for this local operation;
Deliver and Publish keep their existing proof requirements. This operation
never pushes or merges, and records no delivered or published fact.

The first result reports `prepared` with outstanding paths. After the caller
reviews, commits and pushes those artifacts, a feature-addressed call at the
new revision reports `finalized` only for a clean checkout with committed
completion artifacts and the same source and authored-artifact digests. Source
binding includes executable modes, symlink targets and submodule commits;
artifact binding includes authored inputs, project policy/config and capability
projections. Concurrent authored changes during validation are also refused.
This confirmation performs
no durable writes or test execution. Existing terminal records remain readable;
new completion records add optional `sourceTreeDigest` and `artifactTreeDigest`
fields to bind confirmation. No schema migration is needed. Historical records
without these bindings cannot
be confirmed by guessing a baseline.

Terminal forced closure inspects all non-ignored paths before applying and
again under its state lock; its own untracked lock is the only transient
exception. Preview reports the paths, and apply refuses them with
`CHECKOUT_DIRTY`. Generated closure records are then committed before merge,
using the same `feature-finalize` confirmation. GitHub delivery independently
checks all non-ignored paths and rechecks local HEAD against the reviewed PR
commit immediately before each merge. Nested project paths resolve against
their enclosing Git repository.


## Isolation and handoff

Git checkouts select execution state through their own Git metadata, at
`git rev-parse --git-path empirical-sdd/active-feature`. Normal open, read-only
status and loop validate only that selected feature. A checkout without this
selector is idle, including a primary checkout or a linked worktree containing
unfinished histories copied through Git. Unrelated malformed, blocked or
mixed-schema histories and other worktrees' selectors do not participate in
local selection. Non-Git projects retain legacy singleton recovery.

Portable specifications, journals, evidence and tracker bindings remain under
`.empirical/specs/<feature>`. Explicit feature APIs such as
`EmpiricalProject.open(root, { feature: "known-feature" })` validate the named
feature without first resolving another selection. They do not silently replace
the checkout's selection. Missing or corrupt selected state requires targeted
repair: restore the named feature from trusted history, or deliberately repair
this checkout's selector after choosing and validating the intended feature.
Do not delete feature journals or copy another worktree's Git metadata to recover.
Existing Git checkouts without selection metadata require this explicit choice;
repository history alone is not proof of local ownership.

The local `empirical-sdd/terminal-features.json` registry retains all completed
feature ownership when terminal completion clears the active selector. A new
strict start checks every unresolved local obligation, even after intervening
best-effort work; acknowledged and non-required obligations are pruned. Registry
updates use an owned local lock and atomic writes. The legacy `last-feature`
pointer is imported before a new selection overwrites it. Other worktrees' terminal
failures do not block it. Feature-addressed tracker sync and explicit Doctor or
migration audits still expose recoverable historical problems. Selected-feature
gates, journal/path integrity and integration conflict detection remain enforced.


An unrelated request returns a read-only worktree proposal bound to the base
commit, branch, path, active feature, and integrity token. Creation requires
literal approval and revalidation. The source may have uncommitted work: the new
worktree starts at the approved committed base and source edits remain untouched.
Successful creation records work started and
returns `continueWithoutApproval: true`; that approval is sufficient to enter
the checkout and resume the returned action across a host restart without a
second "go" prompt. When changing the host's default directory would end the
turn without scheduling a continuation, execute the approved work in the same
turn using shell commands scoped to the handoff path, absolute file paths, and
the target path as the root of every Empirical call. Defer the host directory
switch until the requested stopping point. Only rely on automatic continuation
when the host supports it, preserving the request, approval, path and returned
action before the switch. Creating the worktree does not fulfill an implementation
request; continue the returned workflow within the approved scope. Independent
approval gates remain in force.
The initial journal still commits before tracker sync, and
its early specification/design/plan projection is In Progress. External-agent handoff likewise proposes exact cwd,
prompt, argv, capability class, and approval token; Empirical never launches
that process itself. Native sub-agent delegation uses the separate bridge below.

### Shared specs and checkout selection

Schema 5 stores portable specs, journals and capability contracts in the
repository. Git worktrees have their own checked-out versions of these shared
artifacts; they are not separate worktree-specific specifications. A spec's
non-terminal lifecycle does not mean a checkout currently owns or executes it.
Multiple inactive or unclaimed specs may remain in `.empirical/specs/` indefinitely.
`abandoned` is reserved for an explicit decision to cancel work.

Each live checkout selects at most one feature through its Git-directory
`empirical-sdd/active-feature` file. That selection also claims the feature
against other live worktrees of the same Git repository. Ownership changes are
serialized in the common Git directory; different features may execute in
parallel. Unregistered or removed worktrees do not retain live ownership.
Capability claims preserve each feature's original comparison bases. Overlapping
claims can coexist; integration checks their actual deltas for conflicts.

Checkout operations and individual features use separate locks. Short shared
selector updates and affected integration targets retain serialization, while a
long operation in one worktree does not hold a repository-wide lock over another
feature's progress. Routine claim validation reads addressed claims; Doctor
inventories all records, so an unrelated corrupt claim is reported without
blocking another feature.

`empirical_select { id }` and the private `select --id <feature>` operation
select and resume an existing non-terminal unclaimed feature, returning its
current action without changing the spec, revision or lifecycle. Selecting a
different feature leaves the previous spec inactive in place. Unknown, terminal,
invalid or already-owned features are rejected. Existing selection metadata is
preserved; there is no repository schema migration.

`empirical_transfer { feature, sourceRoot, revision }` is an explicit ownership
transfer, invoked at the destination root. It validates the registered source
and destination, exact source revision and matching immutable histories before
moving ownership. The destination must already contain that history; transfer
does not copy working edits or reset a branch. Original capability bases and
receipt identities stay intact. Stale or divergent destinations fail before
ownership changes, and interrupted transfer effects are recoverable.

`empirical_overview` is a read-only inventory of worktrees and preserved specs,
including owners, branches, profiles, phases, verification status and next action.
It reports malformed entries individually without selecting, moving, deleting or
repairing specs. This is visibility into concurrent work, not a cleanup operation.

An explicitly named new `fast`, `complex` or `yolo` start considers the current
checkout's selection, not unrelated unclaimed specs. Existing selected work
continues to require approved isolation for an unrelated start. Repository
initialization, integration repair and context refresh work without selecting
any of the unclaimed specs. Git checkouts without a selection stay idle and never inherit portable histories.
Legacy non-Git discovery retains single-feature recovery; when several unclaimed
features exist in a non-Git project, it returns
`MULTIPLE_ACTIVE_FEATURES` with structured details:

```json
{
  "kind": "feature_selection_required",
  "features": ["feature-a", "feature-b"],
  "selectionSupported": false,
  "reason": "Durable checkout selection requires Git"
}
```

Durable explicit selection requires Git. Non-Git `select` fails with
`GIT_REQUIRED` rather than returning a non-persistent success.
Discovery never resolves ambiguity by moving, abandoning or rewriting specs.
CLI JSON errors and MCP `structuredContent` retain bounded selection/handoff error
codes and details. Arbitrary provider error details are never forwarded.

### Local environment files in worktrees

Git worktrees contain committed files; ignored local files such as `.env` are
absent by default. Empirical discovers them by default and shows every path
before copying anything. Configuration lives in the `.empirical/config.json`
isolation block:

```json
{
  "isolation": {
    "copyFiles": ["config/local.json"],
    "localFiles": {
      "discover": true,
      "include": ["**/.env", "**/.env.*"],
      "exclude": [".env.example", ".env.sample", ".env.template", "*.bak*"]
    }
  }
}
```

This is a partial configuration example; keep the other project settings. When
`localFiles` or any of its fields is absent, the values above are the effective
defaults, and existing configurations without the key discover by default
without being rewritten. Set `discover: false` to opt out. Ask your agent to
change these values, or use `empirical_configure` with
`localFiles: { discover: false }`. The library accepts
`configure({ isolation: { localFiles: { ... } } })`; the private CLI adapter
accepts `configure --local-files '{"discover":false}'`. Partial updates merge
field by field, and every surface saves identical configuration.

**Discovery.** Candidates come only from files Git reports as both ignored and
untracked in the source checkout (`git status --ignored=matching`), filtered by
`include` and `exclude`. Any path with a `node_modules`, `.git` or `.empirical`
segment is always excluded, and `include` cannot re-enable it. A wholly ignored
directory (for example an ignored `secrets/` or a virtual environment named
`.env/`) is reported by Git as one entry and is not searched; list a file inside
it in `copyFiles` instead. Patterns are repository-relative and use `/`, `*`
(within one segment), `?` and `**` (whole segments only). At most 20 entries per
list and 256 characters per entry are accepted. Absolute paths, `\`, `:`, `.` or
`..` segments, braces, brackets, `!`, control characters, and include entries
whose final segment has no literal character (such as `**` or `**/*`) are
rejected with `INVALID_CONFIG`. Matching ignores letter case. Include entries
match the whole path; exclude entries without `/` match the file name and
entries with `/` match the whole path.

**Explicit copies.** `copyFiles` keeps its literal-path contract: at most 100
safe relative paths, each required to exist and to be ignored and untracked on
both sides. Unsafe, missing, tracked or unignored explicit paths fail with the
path-only `WORKTREE_LOCAL_FILE_UNSAFE` error. An empty list or an omitted setting
means no explicit copies.

**Proposal.** A worktree proposal's `localFiles` is the exact ordered copy list:
explicit `copyFiles` in configured order, then discovered paths in ordinal order.
A discovered path that equals an explicit path ignoring letter case appears once,
as explicit. `localFiles.discovered` lists the discovered subset and
`localFiles.refused` lists `{ path, reason }` for candidates that will not be
copied. The text rendering lists every path marked explicit or discovered, every
refusal with its reason, or states that no local files will be copied. Approving
the proposal approves exactly those copies; no separate confirmation exists.
The approval token binds the ordered list and its discovered subset, never the
refusals. When nothing is discovered or refused, proposal fields and token equal
the previous release for the same configuration. Pass the proposal's
`localFiles` unchanged to `empirical_worktree_create` (library callers that
spread the proposal already do); omitting it after discovery returns
`STALE_WORKTREE_PROPOSAL` with that hint. An explicit `copyFiles` change requires
a new proposal. No proposal field contains contents, content hashes or sizes.

**Creation and drift.** Creation copies the approved list only. A file that
became discoverable after the proposal is never copied and does not fail
creation or make the approval stale; the handoff reports it in `unapproved` with
remediation to run prepare. An approved discovered file that disappeared is
reported in `missingOptional`. Retrying an interrupted handoff uses the saved
list, preserves existing destination files and fills missing ones.

**Limits and refusals.** More than 200 discovered candidates after filtering
fails a proposal or prepare preview with `WORKTREE_LOCAL_FILES_LIMIT`, reporting
`{ count, limit }` and remediation (narrow `include` or `exclude`, or set
`discover: false`) before anything is created; creation and prepare apply never
fail on the count. Individual discovered files are refused, without failing the
operation, with one of these reasons:

| Reason | Meaning |
| --- | --- |
| `unsafe-path` | The path fails the literal path rules (for example `.github/.env`, reserved Windows names, trailing dots or spaces). |
| `case-conflict` | The path differs only in letter case from, or nests under, another selected path or an existing destination directory. |
| `symbolic-link` | The file or an ancestor is a symbolic link, or containment changed. |
| `not-regular-file` | The path is a directory, pipe or other non-regular file. |
| `too-large` | The file is larger than 1 MiB (1,048,576 bytes), including growth during the copy; no partial destination remains. |
| `source-not-ignored` | The source file is no longer ignored and untracked. |
| `destination-tracked` | The destination path is tracked in the target checkout. |
| `destination-not-ignored` | The destination path is not ignored in the target checkout. |
| `interrupted-copy` | A previous copy was interrupted and its destination may be partial. |

**Report.** Every worktree handoff and applied prepare result includes
`localFiles: { copied, skippedExisting, missingOptional, unapproved, refused }`.
The first four are arrays of portable `/` paths and `refused` contains
`{ path, reason }`; every array is present, and a non-empty `unapproved` adds
`remediation`. Text output groups the same paths by outcome.

**Safety floor.** Discovered and explicit files follow the same rules: independent
regular-file copies created exclusively, never overwriting an existing file
(compared case-insensitively), owner-only `0600` permissions on POSIX (Windows
copies inherit the destination directory's ACLs), ignored and untracked on both
sides, path containment with symbolic-link ancestors rejected, and an empty
private crash marker in Git metadata keyed by target and path identity. Contents
are never printed, parsed as environment variables, hashed or saved in Empirical
state, evidence, intents or tracker payloads. Later edits do not synchronize, and
copies do not provision databases, allocate ports or isolate external services.
If execution stopped while writing one file, the marker prevents treating the
partial copy as complete: explicit paths fail and discovered paths are refused as
`interrupted-copy`. Inspect and remove that destination file before retrying;
Empirical will not overwrite it. As with other repository filesystem operations,
these checks assume owner-controlled checkouts, not an OS sandbox against
concurrent hostile replacement of ancestor directories.

### Preparing an existing worktree

Worktrees created by a host tool (for example Claude Code `EnterWorktree` or
sub-agent worktree isolation), by `git worktree add`, delegated worker worktrees
and transfer destinations are not provisioned automatically. Prepare fills them
safely. The library `prepareWorktree(root, input)`, the internal CLI
`worktree-prepare` and MCP `empirical_worktree_prepare` accept
`{ source?, target?, approvalToken?, approved? }`.

`target` defaults to the invoking checkout and `source` to the repository's main
worktree. Both must be distinct registered, non-bare worktree roots that share
one Git common directory; roots compare by canonical path identity, so 8.3 and
differently cased Windows spellings match. Otherwise the call fails with
`WORKTREE_PREPARE_INVALID_TARGET` and `details.reason` of `not-a-repository`,
`missing`, `unregistered`, `bare`, `not-worktree-root`, `different-repository`
or `same-as-source`, copying nothing. Configuration is read from the source.
Prepare works without an active feature and when `isolation.mode` is `off`, and
creates no workflow state, selection, journal event, evidence receipt or tracker
effect in either checkout.

Without `approvalToken` the call is a read-only preview returning `source`,
`target`, `localFiles: { paths, discovered, skippedExisting, refused }`, an
`approvalToken` bound to both canonical roots and the list, and
`applyInSameTurn: true`. Repository configuration is standing consent: after
showing the preview path list, the agent applies it with the returned token and
`approved: true` in the same turn without requesting another confirmation.
`approved: true` without the token fails with `WORKTREE_APPROVAL_REQUIRED`; a
corrupted token or one issued for other roots fails with
`WORKTREE_PREPARE_INVALID_TOKEN`.

Apply recomputes the selection and copies only previewed paths that
configuration still selects and that are missing in the target. A path that
became discoverable after the preview is never copied and is reported in
`unapproved` with remediation to preview again; there is no stale-preview error.
Files created in the target after the preview are `skippedExisting`, and vanished
paths are `missingOptional`. A token can only narrow what configuration selects.
Repeating prepare is idempotent and reports every path as `skippedExisting`, and
an interrupted copy is refused as `interrupted-copy` by any later prepare.

### Recovering an approved worktree handoff

After first-create safety checks pass, creation records the exact approved
proposal in common Git metadata under `empirical-sdd/handoffs/<approvalToken>.json`
before invoking Git. The target starts its proposed feature through explicit
selection semantics, before generic discovery can encounter unrelated specs.

If creation or handoff is interrupted, repeat the same approved
`empirical_worktree_create` input (private adapter: `worktree-create --input`).
An incomplete-operation error contains `details.recoverable`, `details.retry`
and the underlying `details.cause`. MCP retry input includes the resolved `root` and uses `id`; the private/core
input uses `feature`. Retry the original adapter input or its returned retry
object, retaining the source `--root` for the private CLI. Recovery
checks the recorded repository, path, branch and base commit and does not create
duplicate worktrees or branches. A successful retry returns the current handoff
without adding another work-start revision. Tampered inputs, repurposed targets,
and moved branches are rejected. Occupied-path, existing-branch and stale-approval
checks remain enforced. Dirty source files are neither moved nor stashed. Intents are local coordination
metadata, not portable specs or a schema migration, and remain available for
retry while the target still matches the recorded identity.

## Native sub-agent delegation

Delegation binds one exact parent and worker contract, native host instance,
role, scope and stable assignment identity. `consult` needs host-enforced
read-only access. Writable `specify` and `implement` assignments need distinct
registered worktrees with their own selected child specs in the corresponding
phase. The direct bridge validates discovered native schemas and capabilities;
unsupported hosts need an explicit adapter, never guessed executable flags.

Preparation requires established authorization and durably reserves the worker
root/spec before emitting a native spawn intent. Dispatch, lookup, status and
stop results pass through the same exact-intent normalization in MCP and the
injected runtime. No shared coordination lock is held while a native tool runs.
Assignment identity, native dispatch identity and child agent identity remain
distinct and bound to one record.

An uncertain launch keeps its reservation and reconciles by stable native
identity. Only a confirmed absent launch can produce a recovered spawn;
idempotent host dispatch prevents duplicate workers. Cancellation keeps ownership
until actual child termination is confirmed. For an unknown launch, an ordinary
host's confirmed absence still cannot release the reservation because a delayed
spawn may arrive afterward. Optional `fencedCancellation` lets a host stop by
stable dispatch key and atomically reject future launches under that key;
confirmed cancellation may then have no agent id. Without that guarantee, stop
addresses a known agent id and unresolved cancellation stays reserved. Unknown,
stale and mismatched results cannot release reservations or replace an accepted
observation. Read-only status does not dispatch a tool; explicit observe/cancel
actions prepare intents for the host to execute.

Native terminal status reports process lifecycle, not workflow acceptance. A
worker message never becomes a test, review or integration receipt. The child's
actual feature still completes its exact Fast or Complex revision through the
ordinary gates, and delegated work grants no extra tracker, delivery or
publication permissions. See the [MCP bridge](mcp.md#native-sub-agent-delegation)
for host descriptors, assignments and runtime adapters.

## Mockups before coding

`ProjectConfig.mockupsBeforeCoding` is a boolean, configured through
`empirical_init` or `empirical_configure` with the same field. The init wizard
asks **Create mockups before coding?** and retains the saved Yes/No choice on
repeat setup. The private configuration CLI accepts `--mockups on` or
`--mockups off`.

The default is `true`, including older configurations that omit the field.
With `true`, Complex UI features need an approved mockup before Specify completes.
With `false`, that requirement is skipped. Non-UI work is unaffected, and
browser/screenshot evidence settings stay independent. Any existing mockup
approval still requires a fidelity check at Verify, even after disabling the
preference. Reading a legacy configuration does not rewrite it.


## Completion attribution

A terminal transition records `completionRecord` in the journal/state and projects
it to `completion.md` beside the unchanged approved `spec.md`. It records the
implementation actor, completion actor, optional explicit `decisionBy`, method,
reason, timestamp, revision and the already-proven completion level. Its digest
is validated on read. Attribution grants no authorization and raises no completion
fact. Historical records keep unknown identity; new iterations retain the prior
completion in the journal. `complete`, `integrate` and `feature-close` accept optional
`decisionBy` (CLI `--decision-by`) without requiring a new approval prompt.
