# Lifecycle tracking

## Setup

During `empirical-init`, choose a tracker and an accessible team/project.
Empirical discovers that target's actual workflow states and asks you to confirm
each mapping: specification, planned, in progress, verification, review,
blocked, Done, waiting for release, and waiting for production deployment.
Several stages may share a state. Waiting states must remain unfinished.
Empirical never creates provider statuses for you.

Setup also asks when a ticket becomes Done:

| Rule | What confirms Done |
| --- | --- |
| `workflow` | The local workflow completes |
| `release` | A release is confirmed; recommended for a publishable package |
| `deployment` | A successful deployment reaches the configured production environment |

A merge or completed local task stays in the configured waiting state when the
rule requires a release or deployment. For a deployment rule, a staging result
or a deployment of an older released commit cannot satisfy production completion.
Release-based tickets stay Done while later deployments add their own milestone.

The full policy appears before Save. Cancel writes no configuration; repair
preserves the current policy without contacting the provider unless you choose
to configure tracking. Existing v2 policies without `lifecycle` retain their
local-workflow Done mapping. Existing v1 policies retain explicit/manual sync.

## Automatic progress

For enabled Policy v2, core workflow actions attempt sync after durable local
commits. CLI and MCP use the same implementation. Direct-provider connections sync
automatically. Linear MCP connections return the exact prepared operation in
`tracker.intent`; the host executes it and submits its normalized result through
`tracker-linear-mcp-accept`. A trusted embedding can supply
`TrackerDependencies.linearMcpExecutor` to drain this automatically. No separate
prepare decision is needed after each action. Missing/off policy makes no
provider requests. The last acknowledged provider state suppresses redundant
transitions, and milestone visibility suppresses same-phase ordinary comments.
Before new comments or evidence are written, the current issue is read again
to verify its identity and target. Automatic MCP dispatch owns a per-feature
lock across prepare, execution, and acknowledgement. Disabling tracking or
changing its target prevents retained intents from being dispatched.

## Required-ticket semantics

Ticket behavior and enforcement answer different questions:

- **Required** is resolved from `ticket: "ensure"` or the matching
  `ticketRules` entry. The ticket must be created or attached, read back, and
  synchronized before feature mutation, pull-request readiness, or completion
  can proceed. This gate applies even when `enforcement` is `best-effort`.
- **Best-effort** is an explicit non-blocking choice only for work whose
  resolved ticket rule is `optional`. Provider or connector failure remains
  visible, but does not gate that optional workflow.
- **Off** performs no ticket I/O for work that never incurred a required-ticket
  obligation. Turning tracking off later does not erase an unresolved required
  obligation.
- **Explicit waiver** is the only way around an incurred required-ticket gate.
  `empirical_tracker_waive` requires the exact revision, a reason
  (`tracked-elsewhere` or `abandoned`), and a public justification. It records
  a checksummed journal fact before removing the pending intent. It refuses a
  create whose provider outcome is ambiguous, so a possibly created ticket
  cannot be orphaned.

Remote failures leave the completed local commit intact. Required-ticket gates
block the next workflow mutation until sync succeeds or an explicit waiver is
recorded. Workflow resume retries the selected
feature and up to ten known pending tickets, including completed features;
older failures are tried first. Recovery stays within this checkout's known
obligations; it does not select another worktree's inactive features. Resume reports the recovered tickets. It does
not create historical tickets simply because tracking was enabled later.
Pending unfinished features remain queued when you switch to other work.
Recovery checks checkout ownership, and an explicitly created worktree keeps
the parent's trusted tracker connection for its own initial actions.
The last selected checkout stays the tracker owner after completion, preventing
delayed callbacks in an older checkout from overwriting the final status.
An explicit, validated release/deployment event can take over tracking for a
completed feature in its delivery checkout, provided no sibling is actively
working on that feature.
There is no background polling. Status, next, explain, and Doctor never contact
the tracker. Manual remote status edits are not polled; a later changed outbound
state restores the configured mapping.

Lost-response recovery completes unfinished acknowledged effects before the
latest projection. Ordinary intermediate offline revisions may coalesce.
User-authored descriptions and historical comments remain intact.

Only the host agent can run a Linear MCP intent. Every action packet names an
unexecuted intent in its first instruction and in `tracker.intentSinceRevision`.
After three prepares of the same unexecuted intent, or three later revisions
for optional tracking, `nextAction` also asks for it first. Required-ticket
tracking remains blocked at the original workflow revision while the durable
prepare counter escalates.

## Finished features that never synchronized

A feature can reach Done with its tracker projection still pending, for
example after its intent was never run or the work was merged outside
Empirical. Doctor reports `TRACKER_SYNC_FAILED` for it until one of the
following resolves it. A terminal feature can't be selected, so each option
takes the exact `feature` id:

- **Retry**: `empirical_tracker_sync` with `feature`. Reconciliation looks for
  an existing ticket before any create.
- **Attach an existing ticket**: `empirical_tracker_bind` with `feature`,
  `mode: "attach"`, `ticket` and, when a create is still queued,
  `replace: true`. Addressed this way, a terminal feature's attach is
  link-only: one read validates the ticket's identity and target, then the
  binding is recorded as synchronized at the current revision. The ticket gets
  no state transition and no milestone comments. A bind without `feature`
  keeps full synchronization, including final milestones and evidence. A later projection change, such as a recorded
  delivery fact, resumes normal sync. Under a Linear MCP connection the read
  is returned as a `get-issue` intent to submit through
  `empirical_tracker_linear_mcp_accept` with the same `feature`. An explicit
  `feature` is accepted only for a terminal feature or for the feature this
  checkout already selected (otherwise `FEATURE_SELECTION_REQUIRED`).
- **Waive**: `empirical_tracker_waive` with `feature`, the exact `revision`,
  `reason` (`tracked-elsewhere` or `abandoned`), a 20–500 character
  `justification`, and optionally the `ticket` that tracks the work instead. It
  is also available for the currently selected non-terminal feature and is the
  only explicit bypass for an incurred required-ticket gate. It never contacts
  the provider or reads credentials. It records one journal
  event whose state carries a checksummed `trackerWaiver`. That waiver names
  the reason, justification, actor, time, and the key and digest of the pending
  projection it resolved. Then it removes that pending projection and any
  Linear MCP bridge record. Tracker health becomes `waived`, Doctor reports
  `TRACKER_WAIVED` at `ok`, and later syncs do nothing. A later explicit attach
  takes precedence over the waiver. Waive refuses an unselected non-terminal
  feature, one already bound, and one whose create may already have reached
  the provider (`TRACKER_WAIVE_CREATE_AMBIGUOUS`); in that last case, attach
  the ticket it created so none is orphaned. Waive never moves a ticket to a
  canceled state; a create that never ran left no ticket to cancel.

## External release and deployment jobs

Native `empirical_publish` records its own confirmed release automatically.
An external script needs to report what actually succeeded. Configure a
verification command in `.empirical/policy.json` that observes the released or
deployed version and prints **only one complete JSON document** on stdout:

```json
{
  "kind": "deployment",
  "version": "1.2.3",
  "commit": "0123456789abcdef0123456789abcdef01234567",
  "environment": "production",
  "url": "https://example.com/deployments/123",
  "occurredAt": "2026-09-15T12:00:00Z",
  "features": ["original-feature", "another-feature"],
  "generations": { "original-feature": 1, "another-feature": 0 }
}
```

For a release use `"kind": "release"` and `"environment": null`. URLs may be
null; provided links must be HTTPS without credentials, queries, or fragments.
The feature list must be explicit, unique, and limited to completed local
features. The observer is responsible for identifying which changes the exact
release/deployment contains; Empirical never guesses from ticket text.

Each feature starts at tracking generation zero. Iterating or promoting work
increments its `trackerGeneration`, visible in status. Historical delivery
facts stay in the journal, but cannot complete the reopened work. An observer
must report each affected feature's generation and verify that the delivery
contains that iteration. An omitted generation means zero for compatibility;
an old receipt cannot complete a newer iteration. Later delivery observations
must also have a newer event timestamp.

After the external job succeeds, an agent or CI integration calls
`empirical_tracker_record` with this input:

```json
{
  "input": {
    "receipt": "command",
    "sourceFeature": "release-task",
    "commandId": "observe-production"
  }
}
```

`commandId` must identify a configured verification command. `sourceFeature`
identifies an existing feature with the command's acceptance criteria; it may
already be complete. The observer command should inspect the result, not repeat
the deployment. Empirical executes it, saves an immutable evidence receipt,
validates its complete output and provenance, and records facts for the named
features. A failed, truncated, mismatched, or invalid result cannot mark them
Done. Per-feature commits are idempotent, so a retry can finish a partial batch.

For integrations without MCP, the equivalent private adapter is:

```sh
empirical __internal tracker-record --root /path/to/repository --input observation-input.json
```

That JSON file contains the fields inside `input`, without the MCP wrapper.
Alternatively, supply `"receipt": "execution"` and `"receiptId"` to consume
an existing successful configured-command receipt, or `"receipt": "publication"`
with `sourceFeature` to reconcile that feature's native publication receipt.

Only configured observer commands execute. Recording a fact does not publish,
deploy, or upgrade the local workflow's independently proven completion report.

## Opt-in live acceptance

`scripts/live-linear-lifecycle.ts` drives a marked, isolated fixture through
the same core callbacks and MCP bridge. The host dispatches its exact returned
operations to authenticated Linear tools. It uses controlled phase events and
observes an existing GitHub release through the authenticated `gh` CLI; it
does not publish or deploy. Ordinary Bun tests isolate tracker credentials
and host configuration so only this explicit live path reaches real services.
