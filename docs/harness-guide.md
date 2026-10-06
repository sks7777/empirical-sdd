# Working with Empirical

Empirical keeps a feature's agreement, progress and evidence in your repository so a new session can continue it. You choose when to use it. Ordinary development can continue while another feature waits for tests or a decision.

## Choose how much process you need

- **Direct:** edit normally. No spec or workflow gates. Say “without Empirical.”
- **Fast:** keep a small spec and progress history. Completion means implemented; verification is skipped unless you request it.
- **Complex:** use a contract, review, tests and integration for changes that need those assurances. During iteration, edit first and request tests when ready.

Explicit activation is the default. Automatic activation is a team choice. Direct mode can pause an existing feature; it does not delete that feature's history. Configure these choices with your agent or see the [configuration reference](configuration.md).

## What verification means

A **receipt** records an actual check: what ran, which code and criteria it covered, and its result. A content digest detects changes; it is not a signature tied to a particular computer. “Pending” means the evidence is missing, not that the implementation failed.

Three checks answer different questions:

| Check | What it establishes | When it matters |
| --- | --- | --- |
| Tests and visual checks | The requested behavior works in the tested environment. | Verify; UI outcomes still need the configured browser/screenshot evidence. |
| Fresh-context review | Another context inspected the committed diff and acceptance criteria. | Complex Review. A configured bot can provide independent forge review; an isolated agent is not a GitHub approval. |
| Integration | The change fits the current target branch and capability definitions. | Integrate, after implementation and feature verification. |

For non-UI Complex work, a current approved review also covers the extra fresh-context Verify check when no separate fresh-context command is configured. Status says **covered by review; no separate execution**. This does not claim another test ran. A stale review, a UI criterion or a configured acceptance command still requires its own proof. Fresh-context QA never substitutes for code review.

## What can continue while something is pending?

| Action | What can block it |
| --- | --- |
| Edit, commit, push your feature branch, open a draft PR | Repository/forge permissions and your authorization; pending tests do not impose a workflow gate. |
| Start an independent feature in another worktree | Its own setup and ownership; another feature's review, tests or closure do not block it. |
| Mark this feature verified | Its applicable checks and current review. |
| Integrate this feature | Its evidence, preserved comparison data and actual conflicts with the target. |
| Merge or publish | Required CI, repository protections and explicit authority. Opening a PR does not grant these permissions. |

After local and visual checks pass and the changes are committed, open the PR. You can also open a draft earlier. No final regression run is required just to create it. Full regression normally belongs to PR CI; a local full-suite run requires approval of that run.

## Small adjustments

Ask for the affected tests. Commands configured with `testFiles: "changed"` follow relative JS/TS imports and filename mappings, including changed tests themselves. The plan names the test files and why they were selected; receipts preserve the executed selection. Later runs can narrow from a passing run of the same command. Unrelated scoped evidence remains valid; delta review checks the follow-up diff. No elapsed-time estimate is invented when there is no timing history.

This selector is not a complete language build system: aliases, generated dependencies and dynamic imports may need explicit test files or a broader configured command. An empty selection never silently runs the entire suite. Full regression remains the final check.

## Checkpoints and common warnings

A checkpoint is a deliberate pause when Empirical truly needs a user decision, such as a time budget being exceeded with no standing authorization to continue. Review findings identify the exact failed criteria and blocking finding IDs. Non-blocking findings are deferred automatically and never start another fix lap. One repair round is the budget: when a second review still requests changes, the agent stops and you choose, converging first (open or merge the pull request and track what remains as follow-up tickets), one more fix lap with its cost, or stop. When a real checkpoint is required, choose an exit: continue with a new budget, ship a draft PR, split the work, defer nonblocking findings, or stop. Budgets measure active time: the gaps between journal events count as work up to 30 minutes each, so an overnight pause costs at most 30 minutes. Continuing adds the new minutes on top of the time already used. Budgets are configurable.

| Message | Meaning and next action |
| --- | --- |
| Missing evidence / unrun check | Keep editing, ask for that check, or use another independent worktree. |
| No applicable QA route | Configure a command. For an inapplicable package-consumer, clean-clone or cross-platform check, record a policy exclusion with a reason. Never write a pretend passing receipt. |
| Stale review or receipt | Relevant inputs changed. Re-review the delta or rerun the affected check. |
| Missing environment | Provision the named environment or defer this feature; it does not block another feature. |
| Timed-out check | Inspect the result; run in the background, change the configured timeout within its limit, defer, or stop. |
| Feature owned by another live checkout | Continue there or use the explicit transfer operation. |
| Legacy capability claim unavailable | The old spec lacks portable comparison data. Return to its original checkout to preserve that data, or reconcile/close already-merged work. Do not invent a comparison base. |
| Setup or integration drift | Run `empirical doctor`; ask your agent to preview Doctor fixes. |
| `HOST_CONFIG_CREDENTIAL` | A tracked host MCP config holds what looks like a secret; Doctor names the file and key, never the value. Move it to `bearer_token_env_var`, `env_http_headers`, an environment reference or OAuth, and rotate it if it was ever committed. |

## Resume on another machine

Commit and push the feature's `.empirical/specs/<feature>/` history with the code. Use a full clone on the other machine, pull that branch, and select the feature. New approvals retain original capability comparison data in the spec state; Integrate restores a missing local claim from that exact data. It never substitutes the new machine's HEAD as the original base. Old local ownership, locks and credentials are not copied.

Legacy specs without portable comparison data can still be read and verified; integration may need their original checkout. Already-merged work can be reconciled or explicitly closed without creating new passing evidence. See [repository identity](protocol.md#repository-identity).

## Understand how a feature ended

For an ordinary feature PR, finish local artifacts **before merging**. Once
Complex work passes Verify and Review, commit the current implementation and
workflow files, then run:

```sh
empirical __internal feature-finalize --revision <revision> --target-root <independent-worktree>
```

This rechecks the current scoped evidence and review, validates affected tests
in the independent worktree, and prepares the completion records and capability
projections on the feature branch. It does not require full CI or merge a PR.
The result is `prepared`: inspect its `pendingPaths`, commit the feature files,
and push them to the same PR. Explain unrelated files and let the user decide
what to do with them; do not silently commit, discard or stash them.

Confirm with the returned revision and explicit feature id:

```sh
empirical __internal feature-finalize --id <feature> --revision <returned-revision>
```

`finalized` means the local artifacts are committed and their source and authored
artifact bindings are still current. Confirmation writes nothing and runs no tests, including after
merge. Satisfy the PR's required checks and review before merging; no additional
feature-close operation is needed afterward. Local `integrated` completion
means the capability projections were validated, not that a remote PR merged.
Explicit automated Deliver/Publish operations retain their promotion gates.

Fast completion and explicit abandoned/superseded closure also write their
records before the commit. Use the same confirmation operation for them.
`feature-close --preview` lists every outstanding path; applying a terminal
closure refuses unresolved staged, unstaged or untracked files. Finalization
also refuses source, contract, policy or capability-projection edits committed
after completion: iterate or start a new feature and verify those changes.
Historical records without source and artifact bindings remain readable but
cannot provide this new confirmation.


Each newly completed or explicitly closed feature has `completion.md` beside `spec.md`, backed by its journal and `state.json`. It names the implementation actor, completion actor, supplied decision maker, method, reason, time and proven completion level. Unknown identities say “not recorded.” A closed or externally merged feature does not acquire verification it never performed.

Agents pass `decisionBy` only when the user supplied that identity; it is attribution, not authentication or permission. CLI adapters also accept `--decision-by`. Historical records are not retroactively attributed. Iteration keeps earlier completion events in the journal.
