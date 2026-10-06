# Measuring final verification

Use a clean, committed checkout with Bun, Node and npm on PATH:

```sh
bun run scripts/benchmark-verification.ts phases
bun run scripts/benchmark-verification.ts compare
```

Both modes create disposable local clones, install from the frozen lockfile,
write diagnostic reports and bounded log tails under the printed temporary
directory, and remove their checkouts. Reports persist after failures. Commands
use argument arrays, 45-minute timeouts, bounded captured output, visible progress
and exit/signal/timeout results. No release, review, integration or publication
receipt is fabricated. Timings include process termination and cleanup inside
each measured command.

## Command timeouts and diagnostics

The shared command runner limits each configured execution to `timeoutMs` plus
up to two seconds of termination and output cleanup. On POSIX it starts a
separate process group, sends SIGTERM to the group at the deadline, then sends
SIGKILL after one second even if the wrapper already exited. On Windows it
attempts `taskkill /T /F` before falling back to terminating the direct child.
An inherited output pipe cannot keep the tool call waiting indefinitely: after
the cleanup deadline the runner closes its readers and returns `timedOut: true`.
That result stays non-passing even if the wrapper exited with code zero.

Output capture retains the **last** `maxOutputBytes` of each stream, with the
usual redaction and truncation flags, so noisy image pulls or setup do not hide
the final diagnostic. Progress completion identifies timeouts, signals and exit
codes; child output and environment values are still not streamed.

QA progress measures the entire `qaExecute` operation, with separate
`preparing`, `command`, `finalizing` and `reuse` times. This includes source and
dependency fingerprinting outside the command's own timestamps. CLI progress
and its final timing summary go to stderr. MCP callers that supply a progress
token receive `notifications/progress`; final timings are also returned in
`_meta["empirical/qaExecution"]`, including when execution fails. The structured
receipt and its digest are unchanged. The command outcome in progress describes
the latest command; a successful retry can still have a non-passing aggregate
receipt because of its retained history.

If the initial dependency fingerprint is unavailable, a second scan cannot make
the receipt reusable and is skipped. It is also skipped after failed, timed-out
or cancelled commands. Passing commands with an available initial fingerprint
still require an equal post-execution fingerprint for reuse. Invalid retry
history is rejected before starting another command, with a second provenance
validation after execution to catch changes made by the command itself.

The deadline applies to each command, not the complete QA request or a sequence
of retries. Separately detached processes, Docker daemon workloads and Windows
descendants whose parent already exited may need cleanup by their owning test
script; returning a timeout does not prove those external workloads stopped.

## Benchmark workloads

`phases` measures the full CI components individually (typecheck, coverage,
distribution smoke, clean package consumer, consistency and diff), then local
release contract, dry-run and pack checks. This reveals nested rebuilds and
packaging costs while leaving `bun run ci` unchanged.

`compare` uses one exact source and a Complex diagnostic feature. Each variant
executes full CI, requests integration coverage using the same CI command,
executes separate fresh-context clean-consumer acceptance, replays every policy
command in an independent clone, then runs the local release preparation checks.
The before variant explicitly selects `qa-full-ci` to execute the overlapping CI
request again; full CI is no longer an ordinary feature-check candidate. The after variant
passes `reuseReceiptId` and validates/returns the first receipt unchanged. Target
setup, independent replay and release commands execute in both variants. The
report records duplicate receipt identity, actual reuse, coverage, workflow,
source, policy and matrix digests. The `totals` field records actual elapsed time for each variant, including API
overhead and target setup; individual command durations remain visible separately.

This comparison specifically models repeated requests for an already covered
command. Existing receipt-aware callers that already run each command once gain
no suite speedup. A single receipt already covers all applicable configured check
kinds; the explicit reuse operation makes a later overlapping request validate
that fact without execution. There is no persistent test cache, subset inference,
new skip or policy reduction. Cross-revision evidence reuse has exactly one
exception: Deliver accepts the full-CI receipt Integrate recorded when the only
intervening journal transition is that Integrate completion and the commit,
tree, spec, policy, command, runtime inputs, executable and platform are
identical, so an unchanged candidate runs full CI once instead of twice.
`reuseReceiptId` and Publish keep exact workflow-revision matching. Reuse also hashes
the resolved configured executable, so a changed binary or PATH resolution
cannot borrow old execution evidence; unavailable fingerprints fail closed. A different Git
commit requires new evidence even if the source-tree digest is unchanged.

Local results do not prove live Windows/macOS CI performance, remote release
candidate validity, or protected release authorization. Release Gate and the
publication workflow retain their own exact-candidate checks. Independent replay
is measured as a command workload, without claiming that a reviewed capability
integration took place.

Reuse additionally requires a stable runtime-input fingerprint before and after
execution and at the reuse request. This hashes the effective allowlisted
execution environment and repository files, including ignored dependencies and
generated outputs, along with file permission and ownership metadata. Only the
digest is persisted. Git and Empirical journal
metadata are excluded; commands depending on mutable external services or files
outside this controlled snapshot must be executed again instead of reused.
External symlinks, unsafe file types, unstable reads, or snapshot limits (50,000
entries, 512 MiB, 15 seconds) make a receipt ineligible for reuse. Fresh execution
still works. Older receipts lacking runtime provenance remain readable.

During iteration nothing runs unless requested, and QA requests with
`verificationProfile: "iterate"` run only commands configured with
`testFiles: "changed"`, once per request. Verify runs only the plan's selection:
affected-test commands from the first run when they cover all required automated
Verify checks, otherwise the cheapest covering commands, with shared commands
run once. Missing affected tests do not satisfy coverage. Full CI
runs locally at most once per promotion (an approved run at Integrate, carried
over to Deliver) and zero times on route `ci`, where pull-request CI proves the
exact head before Deliver merges. Independent integration replay never executes
full CI. Publish still runs its own local full CI, approved by its publication
authorization.

The `compare` benchmark is itself the operator's explicit request for its
full-suite runs, so it records an approval bound to the exact revision and shown
estimate before each fresh full-CI execution, and its replay workload omits
full-CI commands as integration does.

The benchmark now records eligibility and explicitly executes `qa-full-ci` when
its first execution changed runtime inputs. Earlier speedup measurements predate
this stronger boundary and must not be presented as measurements of this version.


## Follow-up changes

Changed-file commands now follow static relative JS/TS imports as well as name
mappings. The plan exposes selected paths and reasons; a QA receipt's
`testSelection` records the actual selection. Follow-ups can compare against the
same command's latest passing commit with matching feature, spec and policy.
No matching files still means `NO_CHANGED_TESTS`, never an implicit full suite.
Independent integration replay now selects against the target commit rather
than a command's last passing commit, so a successful Verify does not erase the
feature's affected area. Changed commands receive explicit test paths in the
independent worktree. Their bare argv never runs. Changes to verification
configuration retain broader non-full-CI replay; a changed-only policy with no
safe selection refuses and explains the missing configuration.

Ordinary local completion uses `feature-finalize`: it validates scoped proof and
review, replays the scoped selection and prepares terminal artifacts before
commit. Its subsequent clean-checkout confirmation executes no commands and
writes no tracked files. Full CI remains a separate requirement of explicit
promotion and publication operations, or required remote PR checks.

Checkpoint reporting distinguishes affected tests, carried checks and timing
history. Missing timing history stays unknown. A target sync retains delta review
when the advanced target touches none of the previously reviewed paths; overlaps
or ambiguous history require full review. A current non-UI approved review also
covers otherwise-manual fresh-context acceptance, without claiming a new test ran.
