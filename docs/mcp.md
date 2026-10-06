# MCP usage

Empirical exposes its registry-backed internal API over stdio:

```json
{
  "mcpServers": {
    "empirical": {
      "command": "empirical",
      "args": ["mcp"]
    }
  }
}
```

The single explicit `empirical-init` skill can be installed across 73 global
agent targets. Initialization defaults to an explicitly invoked local workflow
skill. Only saved `activationMode: "automatic"` installs shared routing blocks;
`activationMode: "explicit"` removes owned blocks while preserving other content.
The init and configure tools accept either value. Missing values resolve to
explicit without rewriting config on read. Unrelated repairs retain saved values.
Codex explicit invocation metadata disables implicit skill selection; reload or
start a new host session after changing modes.
It reconciles only expected, owner-controlled regular files at approved roots;
it does not recursively discover or execute arbitrary repository skill files,
and unsafe symlinks or repository-escaping paths are rejected. Instruction
inspection accepts direct sibling aliases between canonical instruction files,
such as `AGENTS.md -> CLAUDE.md`, when the target is a regular file in the same
validated directory. Init never replaces or writes through the link; it repairs
the canonical target by its own path. External targets, arbitrary filenames,
link chains, loops and unsafe ancestors remain unsupported. When removing an
automatic block, an otherwise empty canonical file stays present if a supported
alias needs it, so opting out does not leave a dangling link.

The recommended setup keeps one instruction file: write `CLAUDE.md` and commit
`AGENTS.md` and `GEMINI.md` as relative links to it (`ln -s CLAUDE.md AGENTS.md`).
Every agent then reads the same text, and there are no copies to keep in sync.
On Windows, links need Developer Mode and `git config core.symlinks true`
before cloning. Without them, Git writes each link as a regular file that
contains only `CLAUDE.md`. Doctor reports that as
`PROJECT_ACTIVATION_SYMLINK_CHECKED_OUT_AS_FILE`, a checkout-only warning, and
Init never writes into such a file, so it cannot replace the repository's link.
Integration reports distinguish current artifact bytes from host loading,
which remains `unverified` until the agent-specific discovery or reload check
succeeds. Skill-file compatibility does not imply MCP configuration or
executable handoff support.

## Important tool groups

- Setup and context: `empirical_init`, `empirical_adopt`,
  `empirical_configure`, `empirical_policy`, `empirical_context`,
  `empirical_doctor`, `empirical_doctor_fix`, `empirical_migrate`.
- Resolving Doctor findings: every warning and error in `empirical_doctor`
  carries a structured `fix` with a `kind`:
  - `safe` only regenerates Empirical-owned files (integrations repair,
    context refresh);
  - `confirm` changes durable state (migration, cleanup of the orphans Doctor
    named, retrying a tracker sync);
  - `decision` needs the user's choice among `actions`, each with the `inputs`
    it needs, for example attach a ticket or waive a finished feature's
    projection;
  - `none` has no automated fix, and its `summary` is the guidance.

  `empirical_doctor_fix` without `approved` previews one plan with a `digest`.
  With `approved: true`, it applies every safe and confirm entry under that one
  approval, plus the `choices` (`{ entry, option, inputs }`) the user made. It
  then returns a fresh Doctor report. Unchosen decisions are left alone. A
  changed finding set refuses the stale digest (`DOCTOR_FIX_PLAN_CHANGED`).
  Cleanup entries carry the cleanup plan digest, so the apply removes exactly
  the previewed orphans. Journals, receipts, credentials and user-owned files
  are never repaired automatically. Form elicitation binds the approval to the
  plan shown; a host without forms must relay the previewed `planDigest`.
  Prefer this tool over interpreting remediation text.
- Closing out stuck work: `empirical_feature_close`, `empirical_cleanup`. Both
  preview by default and act only when called with `approved: true`, and both
  require the reason or classes that make the override auditable. Neither can
  fabricate evidence: `empirical_feature_close` records no completion fact and
  writes no receipt, and `empirical_cleanup` acts only on orphans the current
  read-only `empirical_doctor` report already named. Form elicitation binds the
  apply to the plan shown there; a host without forms must relay the previewed
  `revision` for closure or `planDigest` for cleanup.
- Reconciling merged work: `empirical_reconcile` lists every unfinished feature
  with the merged pull request that carried its specification into the target
  branch, found from the spec's last commit without a pull request number, and
  closes only the approved `closable` ones as `merged-externally` without
  selecting them. Features before Implement, without proven merge evidence, or
  owned by another live checkout are listed and never closed. It previews by
  default, applies only with `approved: true`, and binds the apply to the
  previewed `planDigest` on a host without forms.
- Discovery and routing: `empirical_explore`, `empirical_discovery`,
  `empirical_route`, `empirical_fast`, `empirical_complex`, `empirical_yolo`.
- Exact workflow: `empirical_loop`, `empirical_next`, `empirical_status`,
  `empirical_explain`, `empirical_consult`, `empirical_review`,
  `empirical_review_defer`, `empirical_complete`, `empirical_retry`,
  `empirical_promote`, `empirical_checkpoint`.
- Direct mode: `empirical_direct` (`pause`, `resume`, `track`).
- Size guardrail: `empirical_split_decision` (`keep` with a reason, or `split`).
- External ticket mirror: `empirical_tracker_discover`,
  `empirical_tracker_suggest`, `empirical_tracker_preview`, `empirical_tracker_configure`,
  `empirical_tracker_bind`, `empirical_tracker_sync`.
- Evidence and integration: `empirical_qa_plan`, `empirical_qa_execute`,
  `empirical_qa_start`, `empirical_qa_status`, `empirical_qa_cancel`,
  `empirical_qa_record`, `empirical_evidence_execute`,
  `empirical_evidence_collect`, `empirical_verify`, `empirical_integrate`,
  `empirical_capabilities`.
- External ceilings: `empirical_deliver`, `empirical_publish`.
- Isolation and handoff: `empirical_handoff`, `empirical_worktree_propose`,
  `empirical_worktree_create`, `empirical_worktree_prepare`, `empirical_sync_target`, `empirical_select`,
  `empirical_transfer`, `empirical_overview`, `empirical_integrations`.
- Native sub-agents: `empirical_delegation_discover`,
  `empirical_delegation_prepare`, `empirical_delegation_accept`,
  `empirical_delegation_status`.

Tool names, descriptions, profiles, modes, internal CLI verbs, and skill entry
operations are derived from one registry and checked for exact parity. The
legacy `empirical_archive` boundary remains callable only to return the explicit
Schema-5 integration requirement.

## Agent contract

1. Invoke `empirical-init` explicitly for setup or repair. Inspect without
   writing, show the complete settings, and persist only after confirmation.
   Init stops without creating feature state. Set `questions` to `concise` or
   `detailed`; every returned action exposes the same value at
   `interaction.questions`.
2. Enter the local workflow only for an explicit Empirical request, or when a
   valid completed config saves `activationMode: "automatic"` and the user has
   not opted out. Missing configuration or a generic coding request in explicit
   mode must not trigger initialization, workflow state, or an adoption prompt.
   Read-only prompts stay outside the workflow. Once the user chooses Empirical,
   resume the selected non-terminal work before treating request text as new work.
3. Use five-pass discovery only for material ambiguity or explicit Socratic use.
4. Call `empirical_route`. Honor explicit Complex. Explicit Fast covers small,
   self-contained behavioral and UI changes; a sensitive, migration or
   publication signal still routes it to Complex, while integration or delivery
   wording keeps Fast and reports its gates (`matchedFloors` lists every matched
   floor). Work on an existing foundation that will be integrated uses
   `empirical_complex` with `iterative: true`. Preserve the request's actual
   impact classification. New Fast has no mandatory tests, formal review or
   Context and completes as implemented with verification skipped.
5. In YOLO, obey the recorded ceiling and ask only for a product blocker,
   missing permission, or hard safety boundary. `empirical_yolo` accepts
   `profile`; explicit `profile: "fast"` records an `implemented` ceiling when
   none is given and refuses `verified`, `integrated` or `delivered` with
   `PROFILE_CONFLICT` before writing a feature.
6. If start returns a worktree proposal, display and obtain literal approval
   before creation, reusing authorization already given for that exact proposal.
   Creation uses the committed base and preserves any dirty source files.
   After approved creation, enter its path and resume the
   returned action without asking for another confirmation; a required host
   restart is not a new consent boundary.
7. QA matrices are plans, not permission to run tests. During Fast and Complex
   iteration, execute tests only when the user requests them, scoped to the active
   feature and requested criteria. Inspect configured argv/scripts; do not silently
   substitute a repository-wide suite when focused coverage is missing. A request
   covers one run, not later edits. Keep unrun checks pending and return control
   without repeatedly asking. Required evidence gates remain unsatisfied until
   real receipts exist; review remains separate from fresh-context QA.
   Ship early: open a draft pull request at the first coherent commit of feature
   work and push every commit. Commits and pushes never wait on test runs; run
   the change's tests in the background and continue. Heavy or full-suite runs
   belong to pull-request CI, or run locally only with explicit approval. This
   push authority covers only the agent's own feature branch and draft pull
   requests: never merge, never push to a protected or target branch, never
   force push. Without a remote or `gh`, say so and continue locally.
8. New Complex features and promoted Fast work run Review before Verify;
   existing features retain their saved order. Verify preserves the approval
   and returns `REVIEW_STALE` if the reviewed commit changes.
   During Review, call `empirical_review` without a submission first. It returns
   the exact committed `base...HEAD` packet and bot readiness or fresh-context
   instructions. Run a new isolated reviewer invocation and call the same tool
   with the structured criterion-complete result; credential values are never
   tool inputs.

   **Delta re-review.** After a review is recorded, the next packet from
   `empirical_review` carries `reReview` and a `diff` that holds only
   `previousHeadCommit..HEAD`. The packet also includes:
   - `previousReview`: the previous canonical body, so criterion verdicts carry
     forward;
   - `openFindings`: findings to re-check. Repeat the id while a finding is still
     open, and omit it once fixed;
   - `deferredFindings`: already tracked elsewhere, so don't report them again.

   A full review is used instead when:
   - the base commit moved;
   - the previous head is not an ancestor of HEAD;
   - there is a merge between the previous head and HEAD, or the merge base
     changed;
   - the criteria, decisions or contract amendments changed;
   - the review mode changed.

   The Review and Verify gates rebuild the same packet from the context recorded
   in `review-result.json`. They refuse it when it no longer matches the stored
   previous result. Recorded triage adds `findingHistory`.

   **Findings and exits.** The result may carry `findings`, each with an id
   (`F-1`), a `severity` (`critical`, `high`, `medium`, `low`), a
   `category` (`security`, `acceptance`, `correctness`, `design`,
   `maintainability`, `tests`, `docs`) and a one-line `summary`.
   - Critical and high findings, `security` findings rated `medium` or above,
     and any `acceptance` finding block. A `low` security finding is hardening
     advice: it is deferred like other non-blocking findings. Reviewers rate
     an exposed credential or an authentication bypass at least `high`.
   - Empirical derives the recorded verdict: `CHANGES_REQUESTED` when a
     criterion fails or a finding blocks, `APPROVED` otherwise. The
     submission's `verdict` is optional and advisory, so a label that
     disagrees with the criteria and findings never rejects the review.
   - A result without `findings` keeps its previous digest.
   - The recorded result returns `triage`: the round of `maxRepairAttempts`,
     blocking and open non-blocking finding ids, and the `exits`:
     1. `fix`: its `cost` lists the Verify checks a fix invalidates, with
        estimates, plus a new review.
     2. `defer`: open non-blocking findings go to a ticket, with no re-run.
        Offered only when nothing blocks.
     3. `follow-up`: when a tracker is configured and findings were deferred,
        offer the user one follow-up ticket for them; create it only on a yes,
        then record it with `empirical_review_defer` and its `ticket`.
     4. `open-pr`: open a draft pull request and hand full proof to CI.
     5. `stop`.
   - Non-blocking findings are deferred automatically when the review is
     recorded, so they never start another fix lap; `openNonBlockingFindingIds`
     is then empty and `deferredFindingIds` lists them.
   - The round counts only recorded review results that requested changes;
     Verify failures never count.
   - One repair round is the budget. When a second review still requests
     changes, `triage.mustChoose` is true and the exits start with converging:
     `open-pr` (open or merge the pull request and track what remains), then
     one more `fix` lap with its cost, then `stop`. The agent presents them and
     waits for the user's choice; it never starts a further lap on its own.
   - `empirical_review_defer` takes `findingIds`, a `reason` and a
     `ticket` (tracker id or URL). It is written to
     `review-deferrals.json` and bound to the current result digest.
     - Blocking findings return `FINDING_BLOCKING`.
     - Unknown ids return `FINDING_NOT_FOUND`.
     - Repeated ids return `FINDING_ALREADY_DEFERRED`, except that a finding
       deferred automatically without a ticket can be deferred again with one.
   - Deliver appends a "Non-blocking review findings" section to the source
     pull request body, listing each non-blocking finding and whether it was
     deferred.
9. If tracking is configured, commit the local transition first and then call
   `empirical_tracker_sync`. Follow rule-backed `changeType` and
   `ticketRequirement` status: do not ask about an optional missing ticket, and
   do not call a provider for optional unreferenced or off work. Required work
   establishes the one feature ticket. A remote failure is reported and retried
   from the durable unacknowledged effect; it never rewinds local state.
10. When Context is returned, call `empirical_context`, refine every reported
   placeholder topic from inspected evidence, remove its managed marker, call
   context again, and complete only when `refinementRequired`, `stale`, and
   `missing` are empty.
11. For Complex work, follow the promotion route on the roadmap's full-CI
   check. On route `ci` never run full CI locally: pull-request CI proves it at
   Deliver. On route `local`, show the command, estimate, revision and reason,
   ask, record the user's yes with `empirical_qa_approve`, then run one clean
   `full-ci` QA receipt for the exact promotion revision. Integrate committed
   feature differences against an independent target worktree.
   `receiptIds` is optional on `empirical_integrate` and `empirical_deliver`.
   Deliver only when Policy and authorization cover it and promotion proof
   exists: an exact clean full-CI receipt for the Deliver revision, the receipt
   Integrate recorded (carried over for an identical candidate), or required
   pull-request checks on the exact head. Delivery may return `setup-required`, a source/evidence
   `review-required` packet, or `promotion-proof-required` while its owned PR
   remains draft; resume with the matching structured result. Never infer
   publication.
12. Report with the Empirical status card, built only from the returned
   `roadmap`, in this fixed order: the header
   `Empirical · <feature> · <profile> · <phase> (<index>/<total>) · rev <n>`,
   `Done:`, `Not done:`, `Next:`, `Waiting on you:` and `Verification:`, writing
   `none` for an empty section. Show it at start or resume, at every phase
   change, at every stop (Done, Blocked, Awaiting Human or pending
   verification), and before any run whose summed `estimateMs` is over 60
   seconds or unknown, where it also states the estimate and offers to defer.
   Blockers belong in `waitingOn` items, not in paragraphs of prose, and the
   card authorizes nothing. When `roadmap.time` is present the card ends with
   `Time: <elapsed> of <budget> budget`. `roadmap.time` is
   `{ elapsedMs, phaseElapsedMs, budgetMs, over }`, the active time derived from
   the feature's journal timestamps, where each gap between events counts at
   most 30 minutes so idle time does not consume the budget; `budgetMs` is the
   lane budget from the optional config
   `budget` (minutes per lane; defaults Fast 30, Quick 60, Complex 120) plus
   recorded extensions. When `over` is true, or Review sent the work back to
   Implement, `waitingOn` starts with a `decision` checkpoint and `nextAction`
   names the exits: ship as is (draft PR), split, defer non-blocking findings,
   continue with a new budget, or stop. Stop there and wait for the user's
   choice. `empirical_checkpoint` with `revision` and `extendMinutes` (1 to
   10080) records the continue choice as one journal event and sets this
   feature's budget to the active time already used plus `extendMinutes`; the
   other exits are ordinary actions.
13. For authorized native delegation, discover the actual host tools, prepare a
   bounded assignment before spawning, execute its returned intent and accept
   only the observed normalized result. Reconcile uncertain launches and retain
   reservations until cancellation is confirmed. Child messages never provide
   verification or advance workflow state by themselves.

Init and Configure accept `reviewMode` as `bot` or `fresh-context` and
`reviewerTokenEnv` as an uppercase environment-variable name. Recommended
guided setup uses `bot` plus `EMPIRICAL_REVIEWER_TOKEN`; existing Schema-5
configuration without a review block reads as `fresh-context` without a rewrite.

Read operations, proposals, and Doctor do not mutate. Worktree creation,
configured command execution, integration, delivery, and publication are
explicitly effectful and retain their own safety gates.

### Fast completion and promotion

New Fast actions expose `verification: "skipped"`, `requiredEvidence: []` and
`verificationMatrix: null`. A passing Implement transition reaches Done with
`completionLevel.highest: "implemented"` and `completionLevel.verified: false`.
`empirical_verify` still validates integrity; its returned verification and
completion level distinguish valid records from tested behavior. A deliberate
request for the formal QA workflow requires promotion. Historical Fast records
retain their prior proof and completion semantics.

Call `empirical_promote` with `{ "id": "feature", "revision": 3,
"reason": "This feature now needs the full verification workflow" }` at the
feature's root. The exact revision is mandatory; `id` may be omitted for the
selected feature. Promotion enters Complex Specify on the same feature, preserves
its journal and receipt files, retains the original Fast impact in
`fast-impact.json`, and resets current approval/proof references. It grants no
new delivery or publication authority. Promotion is the only operation that
changes a Fast feature to Complex, and it is accepted from a failed Fast block.

### Fast iteration

`empirical_iterate` also accepts a Fast feature: pass `revision`, `request` and,
for a Done feature that is no longer selected, `id` (a feature id; invalid ids
are rejected before the project opens). From Implement or implemented Done it
returns the same Fast feature to Implement, increments `lifecycle.iteration`,
records `Iterate: <request>` in the journal, clears optional receipt references
and runs nothing. The next `empirical_complete` returns to Done with verification
skipped; an iterated Fast feature keeps its full journal instead of compacting it.
Fast iterate fails without changing state with `STALE_REVISION`,
`WORKFLOW_BLOCKED` (blocked or awaiting human), `SPEC_CHANGED`,
`PROFILE_CONFLICT` (`reviseContract: true` or `amendContract: true`), or `PROMOTION_REQUIRED` when the
adjustment reaches the sensitive, migration or publication floor. Fast
`empirical_consolidate` fails with `PROMOTION_REQUIRED`, and Fast
`empirical_integrate`, `empirical_deliver` and `empirical_publish` fail with
their not-ready codes plus `details.guidance: "PROMOTION_REQUIRED"`.

`complete` with outcome `failed` on Fast Implement keeps the feature Fast and
sets `status: "blocked"` with a message naming `empirical_retry` and
`empirical_promote`. Starting Fast creates `decisions.md` from the template; it
never gates Fast. `empirical_status` and `empirical_explain` list its Accepted
decisions and report format issues as `decisionWarnings`.

## OAuth and host fallback boundary

Tracker authentication is OAuth-first. Explicit embedding
`TrackerOAuthResolver` implementations remain highest priority. Otherwise the
installed `empirical mcp` process supplies a Linear-only in-memory OAuth client
for Linear's pinned official remote MCP endpoint. It uses DCR/PKCE, a random
state-bound loopback callback, and negotiated URL-mode elicitation; registration
and token material are never persisted or returned through MCP.

When GitHub Copilot is selected, `empirical install` reconciles an exact local
stdio entry in `~/.copilot/mcp-config.json`, making Empirical operations
available before repository initialization. Start a new session after install
or update. If the bridge or URL elicitation is unavailable, use the guarded
fallback below; do not probe private CLI commands for browser OAuth.

### Codex and direct Linear OAuth

Codex supports OAuth for directly configured Streamable HTTP MCP servers. It
does not document nested URL-mode elicitation as a feature of local STDIO MCP
servers. Therefore restarting Codex reloads MCP configuration, but it does not
by itself add `elicitation.url` to the Empirical session.

For direct Linear tools in Codex, configure and authenticate Linear's official
remote MCP server through the Codex host:

```bash
codex mcp add linear --url https://mcp.linear.app/mcp
codex mcp login linear
codex mcp list
```

Restart the Codex app, CLI session, or IDE extension after changing MCP
configuration, then verify that the `linear` server is connected before the
demo. This OAuth credential stays inside Codex. Empirical does not read Codex's
private credential store, so a direct Linear connection does not authorize
Empirical's direct HTTP adapter. It can still power Empirical tracker mirroring
through the explicit agent-mediated Policy v2 mode `connection: "linear-mcp"`.
In this mode no `credentialEnv` is persisted. Init collects complete bounded
team/project/status discovery through Linear list tools, submits it through
`empirical_tracker_linear_mcp_discover`, and previews the policy with
`empirical_tracker_linear_mcp_preview`.

For ticket binding and synchronization, call
`empirical_tracker_linear_mcp_prepare`, execute only its exact returned
`linear.*` tool and arguments, normalize the documented safe result, and submit
it through `empirical_tracker_linear_mcp_accept`. Repeat until health is
`synced`. Mutation intents are persisted before dispatch; lost create/comment
results reconcile deterministic markers before another mutation. OAuth tokens,
authorization codes, and raw MCP responses never enter Empirical. Use the
guarded host-only fallback below only when the sibling Linear tools are absent.

```ts
import { createMcpServer } from "empirical-sdd/mcp";

const server = createMcpServer(repositoryRoot, {
  trackerDependencies: { oauthResolver: trustedHostResolver },
});
```

If the resolver reports that authorization is required, Empirical validates a
secret-free HTTPS handoff and inspects the connected client's negotiated
capabilities. It calls `elicitation/create` only when `elicitation.url` is
explicitly declared and sends only `mode: "url"`, a message, an opaque ID, and
the URL. A form-only declaration, legacy empty `elicitation: {}`, absent
capability, decline, cancellation, or handoff failure never causes a form or a
credential request. Resolution then continues through the host fallback.

> **Never paste credentials into chat.** Raw credentials are not valid MCP
> arguments or results. If OAuth is unavailable, edit the host file directly:
> `${XDG_CONFIG_HOME:-$HOME/.config}/empirical/secrets.env` on POSIX or
> `%APPDATA%\Empirical\secrets.env` on Windows. Do not put a value in a command,
> shell history, process argument, repository file, assistant message, or tool
> call.

New setup names `LINEAR_SECRET_KEY`, `GITHUB_TOKEN`, `PLANE_API_KEY`, and the Jira pair
`JIRA_EMAIL` plus `JIRA_API_TOKEN`. Resolution is atomic by source: connected
OAuth, then a complete injected environment set, then a complete checked file
set. The file must be outside the repository, at most 64 KiB, a regular
non-symbolic-link file, strictly formatted, and owner-only on POSIX. Existing
policies naming `LINEAR_API_KEY` or another valid variable remain unchanged.

## External ticket mirror

With no `.empirical/tracker.json`, tracker setup is unconfigured while status
remains `local-only` and tracker operations perform no network requests. The
strict provider-free disabled record represents an explicit No tracking choice
with the same runtime behavior. Policy v2 with `ticket:
"off"` reports `off` and also branches before credential resolution or provider
access. `empirical_tracker_configure` accepts a strict Tracker Policy v1 or v2
document, or `null` to persist No tracking.

User-facing Init first requires Track work by type (recommended) or No tracking
when no prior choice exists. Setup then uses the same contract in every client:

1. Start with the trusted host OAuth connection for Linear, GitHub, or Jira.
   For Plane, ask for its credential-free API origin and workspace slug, then
   use the host-only Personal Access Token named by `PLANE_API_KEY` (or the
   saved custom environment name). For the OAuth providers, if this host lacks
   the tracker MCP operations or trusted URL-mode resolver, recommend continuing browser
   OAuth in an OAuth-capable Empirical host. In Codex, offer the directly
   configured official Linear Streamable HTTP MCP server for direct Linear
   tools, while explaining that its OAuth does not authorize Empirical tracker
   mirroring. Also offer the exact host file path
   and fallback variable names above; private CLI fallbacks can use that guarded
   file but cannot initiate browser OAuth. Pause while the human edits the file
   outside chat, and resume only after host-side confirmation. Then call
   `empirical_tracker_discover` with a provider and
   fallback environment-variable names. Jira also needs its credential-free Cloud site
   origin. The result contains named workspaces/sites, teams/repositories,
   projects, issue types, fields, states, parent relationships, and adapter
   capabilities; no catalog is persisted.
2. Call `empirical_tracker_suggest` with the same discovery input and the
   selected team/status-field/project parent ID. Linear state `type` and
   lifecycle `position` are primary; familiar names only refine compatible
   candidates. Explicitly resolve ties or incompatible-only results. Reusing a
   state across phases is valid.
3. Call `empirical_tracker_preview` with the complete policy. Preview repeats
   discovery, validates permissions and every selected target/state, expands
   display names, and returns a canonical secret-free digest without writing.
4. Apply with `empirical_tracker_configure`, or pass the strict `tracker`
   preserve/disabled/apply change to `empirical_init`. The private CLI has
   equivalent `tracker-discover`, `tracker-suggest`, `tracker-preview`, `tracker-configure`, and
   `init --tracker-input <json-file|->` surfaces.

The common state map is required for every provider:

```json
{
  "specification": "provider-status-id",
  "planned": "provider-status-id",
  "in-progress": "provider-status-id",
  "verification": "provider-status-id",
  "review": "provider-status-id",
  "blocked": "provider-status-id",
  "done": "provider-status-id"
}
```

Tracker Policy v2 adds behavior without changing provider target shapes:

```json
{
  "schemaVersion": 2,
  "provider": "linear",
  "target": { "teamId": "discovered-team", "projectId": "discovered-project" },
  "credentialEnv": { "apiKey": "LINEAR_SECRET_KEY" },
  "states": { "specification": "todo", "planned": "todo", "in-progress": "started", "verification": "qa", "review": "qa", "blocked": "started", "done": "done" },
  "ticket": "ensure",
  "visibility": "milestones",
  "ticketRules": {
    "feature": { "fast": "required", "quick": "required", "complex": "required" },
    "fix": { "fast": "optional", "quick": "required", "complex": "required" },
    "chore": { "fast": "optional", "quick": "optional", "complex": "optional" }
  }
}
```

`ticket` is `off`, `manual`, or `ensure`. `visibility` is `blockers-final`,
`milestones`, or `revisions`. `ticketRules` is optional, is legal only with
`ensure`, and must contain every displayed key with values `required`,
`optional`, or `off`. Init offers `features+large-fixes`, `all`, `none`, or
`custom`; the JSON above is the recommended preset. Provider-specific legacy v1 examples follow; they
remain accepted byte-for-byte and are interpreted as manual binding with the
legacy state/description projection:

```json
{
  "schemaVersion": 1,
  "provider": "linear",
  "target": { "teamId": "team-id", "projectId": null },
  "credentialEnv": { "apiKey": "LINEAR_API_KEY" },
  "states": { "specification": "...", "planned": "...", "in-progress": "...", "verification": "...", "review": "...", "blocked": "...", "done": "..." }
}
```

```json
{
  "schemaVersion": 1,
  "provider": "github",
  "target": { "owner": "org", "repository": "repo", "projectId": "PVT_...", "statusFieldId": "PVTSSF_..." },
  "credentialEnv": { "token": "GITHUB_TOKEN" },
  "states": { "specification": "option-id", "planned": "option-id", "in-progress": "option-id", "verification": "option-id", "review": "option-id", "blocked": "option-id", "done": "option-id" }
}
```

```json
{
  "schemaVersion": 1,
  "provider": "jira",
  "target": { "siteUrl": "https://example.atlassian.net", "projectKey": "ENG", "issueTypeId": "10001" },
  "credentialEnv": { "email": "JIRA_EMAIL", "apiToken": "JIRA_API_TOKEN" },
  "states": { "specification": "status-id", "planned": "status-id", "in-progress": "status-id", "verification": "status-id", "review": "status-id", "blocked": "status-id", "done": "status-id" }
}
```

Linear's `projectId` key is required. Use a provider project id string to pin
the mirror to that project, or the literal JSON value `null` for a team-only
ticket; do not omit the key or use the string `"null"`.

Every `credentialEnv` value is an environment-variable **name**, never a
credential. Names are 3–64 uppercase ASCII letters, digits, or underscores,
start with a letter, and contain at least one underscore. OAuth remains the
preferred runtime source; the named nonblank value is consulted only as a
fallback from injected host state or the guarded host file. The resulting
credential must be authorized for the exact configured target and effects:

- Linear: discover the workspace/team/project/workflow, and read, create,
  update, and comment on issues in the selected team and optional project.
- GitHub: read and write the configured repository's issues and comments, and
  discover/add/update items and the Status field in the selected Projects v2
  project.
- Jira: discover projects, issue types, fields, and statuses; read, create,
  update, and comment on issues; write issue properties; perform configured
  transitions; and add attachments when evidence upload is enabled.
- Plane: discover projects and workflow states in an explicit workspace; read,
  create, reconcile, update, and comment on work items through current
  `/api/v1/.../work-items/` endpoints. Plane Cloud defaults to
  `https://api.plane.so`; validated public HTTPS origins support self-hosted
  instances. Plane uses `X-API-Key` from the host-only `PLANE_API_KEY` reference
  and does not accept credential values in MCP input or chat. A self-hosted
  origin must also appear exactly in the host-controlled, non-secret
  `EMPIRICAL_PLANE_ALLOWED_ORIGINS` comma-separated allowlist.

Empirical does not discover credentials, elevate provider permissions, mutate
the process environment, or serialize runtime values. Missing authentication
is reported with names and the concrete host path only. Linear OAuth uses a
Bearer header while its personal API-key fallback retains Linear's raw
`Authorization` value. Jira OAuth uses Bearer authorization at
`https://api.atlassian.com/ex/jira/{cloudId}`; Jira fallback uses the configured
tenant origin with Basic authorization.

In `manual` mode, `empirical_tracker_bind` accepts `{ "mode": "create" }` or
`{ "mode": "attach", "ticket": "..." }`. Rule-less `ensure` and a resolved
`required` rule use ordinary
`empirical_tracker_sync` first validates one ticket URL referenced by the
feature request, then performs a complete bounded lookup for the stable feature
marker, and creates only after a complete zero-match result. Multiple references
or marker matches persist `TRACKER_BIND_AMBIGUOUS` and stop for explicit
reconciliation. An existing binding is immutable unless the caller explicitly
supplies `replace: true`. Bindings and pending
operations are checksummed, feature-local, and retain digests of the exact
provider target and effective policy. A target change therefore fails locally
until explicit replacement; a same-target state-map change invalidates the
same-revision acknowledgment and projects the committed state through the new
mapping.

A resolved `optional` rule attaches exactly one target-valid request reference.
With no reference it returns `local-only` without OAuth resolution, fallback
credential lookup, provider search, ticket creation, or an agent question. A
resolved `off` rule returns `off` with the same zero-I/O guarantee. Policy v1
and v2 policies without `ticketRules` retain their existing behavior.

Pending work is the durable reconciliation source. Normal synchronization
resumes that exact operation before deriving newer work. A durable `dispatched`
flag distinguishes a create intent that has never been sent from one that may
have reached the provider. Sync may send the first create only while the intent
is durably undispatched; after marking it dispatched, Empirical never sends
that create again automatically. `empirical_tracker_sync` instead performs a
bounded lookup for the exact persisted create marker. If no unique match can be
reconciled, the caller can attach the possibly created ticket. Supplying
`confirmCreateRetry: true` explicitly accepts a new create attempt and its
duplicate-ticket risk; it is not an exactly-once guarantee.

Policy v2 progress is append-only. Linear, GitHub, Jira, and Plane receive idempotent
milestone comments containing phase, revision, progress, completion, concise
summary, blocker, and reviewable receipt artifacts. The visibility policy
selects blockers/final only, phase/status/completion milestones, or every
committed revision. New Linear synchronization changes state and comments only;
it never rewrites user-authored descriptions. Deterministic transition,
comment, and artifact keys include feature, revision, and sorted receipt digest,
and each successful effect is atomically acknowledged before the next.

Sync trusts that local effect ledger, so an update costs at most two provider
calls in steady state: the state update and the comment, or an identity read and
the comment when the state is unchanged.
- **Comments.** A comment records a `dispatch` effect right before its create
  request. Existing comments are listed only when an earlier send of that exact
  comment was never acknowledged, for example after a crash or an interrupted
  host session.
- **Linear transitions** validate team and project from the update result.
  State ids are team-scoped. An issue moved to another project in the same team
  therefore gets its state set before the identity mismatch stops the sync, and
  nothing else is written.
- **Missed revisions.** A revision whose comment was never sent isn't replayed
  on its own. The next comment adds a `Since the last update: …` line listing
  the headlines the visibility policy would have published. A revision whose
  comment was sent but whose evidence is incomplete is still recovered first.
- **Named tickets.** A request that starts with a ticket key names that ticket
  like a ticket URL does. For Linear the key needs a colon (`SDD-168: …`); for
  Jira it needs the project prefix.

Only artifacts already approved by committed collected-evidence receipts are
eligible. Empirical revalidates receipt and file digests, repository containment,
regular-file/non-symlink identity, secret-like names, media allowlists, and size
bounds before any remote request. Jira uses a deterministic attachment marker;
other adapters use a commit-pinned safe repository link when available and
otherwise record a bounded unsupported/pending note. No bytes or credential
values enter pending JSON.

Status and action packets report `local-only`, `off`, `synced`, `pending`, or
`failed` without provider requests. Policy v2 status also shows ticket behavior,
visibility, and remaining effects; rule-backed policies also show change type
and effective ticket requirement. Keep local progress; provide a named missing
credential, explicitly rebind target drift, resolve marker ambiguity, repair an
unsafe artifact, or retry `empirical_tracker_sync` after an outage as reported.

Tracker Policy v2 optionally accepts `enforcement: "best-effort" | "strict"`;
omission and Policy v1 resolve to best-effort without rewriting bytes. Status
also exposes `enforcement` and a structured `gate` (`open` or `blocked`, stable
code, bounded summary, and recovery class). Strict gates only resolved
`required` work and core mutation APIs reject progress until binding and the
current revision are fully acknowledged. Optional unreferenced/off work retains
zero-I/O behavior. `empirical_tracker_sync` accepts optional exact `feature` so
terminal strict state can be reconciled after checkout selection clears; a new
feature start fails closed while its own checkout-local terminal work remains
unsynced. In Git repositories this ownership is recorded in local Git metadata,
not inferred by scanning every feature copied into the worktree. Unrelated
terminal failures remain available through explicit feature sync and Doctor.

The normalized projection is `shape/specify/design → specification`,
`plan → planned`, `implement/context → in-progress`, `verify → verification`,
review/integration/delivery phases → `review`, terminal success → `done`, and
`blocked` or `awaiting_human` → `blocked`. When an approved worktree handoff has
durably marked work started, its early shape/specify/design/plan phases project
`in-progress` after the required local commit rather than regressing to setup.

## Policy v2

`empirical_configure` accepts the strict Policy v2 document:

```json
{
  "schemaVersion": 2,
  "context": ["README.md"],
  "phases": {},
  "verification": {
    "evidence": {
      "required": true,
      "browserForUi": true,
      "screenshotForUi": true,
      "codeReview": true
    },
    "commands": [
      {
        "id": "test",
        "argv": ["npm", "test"],
        "cwd": ".",
        "timeoutMs": 300000,
        "maxOutputBytes": 262144,
        "evidenceKinds": ["test", "review"],
        "checks": ["unit", "integration", "full-ci"],
        "criteria": []
      }
    ]
  },
  "delivery": null,
  "preferredAgent": null
}
```

Set `"testFiles": "changed"` on a test command to append only the test files
that correspond to changed files: changed test files themselves and tests whose
name stem matches a changed source (`src/greeting.ts` selects
`tests/greeting.test.ts`, `test_greeting.py` or `greeting_test.go`). Changes are
branch commits since the configured base plus uncommitted and untracked work.
When nothing matches, execution fails with `NO_CHANGED_TESTS` instead of running
the bare argv, and the receipt records the exact argv that ran. Such a command
cannot declare `full-ci`. Integration replay skips it when other commands are
configured and otherwise runs its bare argv.

Set `"scope"` on a non-full-CI command to bind its Verify-gate QA receipts to
part of the repository instead of the whole tree, for example
`"scope": ["packages/api", "packages/*/src/**"]`. Entries are
repository-relative path prefixes or simple globs (`*` within one segment, `**`
across segments); absolute paths, `..`, `?`, `[]`, `{}` and `!` are refused, and
at most 32 entries of 200 characters are allowed. Entries are normalized
(`/` separators, sorted, deduplicated); a policy without `scope` keeps its digest.

A scoped receipt records `provenance.scope` and `provenance.scopeDigest`. At the
Complex Verify gate, in `empirical_status` and in the roadmap it stays valid
after the whole tree changes as long as that digest still matches. The digest
covers the content of every tracked or unignored file under the scope plus
global files that always apply: `.empirical/policy.json`, every `package.json`,
lockfiles (`bun.lock`, `bun.lockb`, `package-lock.json`,
`npm-shrinkwrap.json`, `yarn.lock`, `pnpm-lock.yaml`), `.github/workflows/**`,
`.github/actions/**`, `.gitmodules`, test-runner, compiler and toolchain
configuration (`bunfig.toml`, `tsconfig*.json`, `jsconfig.json`,
`vitest.config.*`, `vite.config.*`, `jest.config.*`, `babel.config.*`,
`.babelrc*`, `playwright.config.*`, `pnpm-workspace.yaml`, `.npmrc`, `.yarnrc*`,
`.nvmrc`, `.node-version`, `.tool-versions`) wherever it lives, `patches/` at the
root and in the command `cwd`, task-runner manifests in its `cwd`, and every
path named in its argv (including everything below an argv directory). The
scope must include every source, fixture, shared library and setup file the
command loads; imports and files outside the scope are not bound. Deletions
and renames change it, and so does any symbolic link or gitlink anywhere in the
repository. A bound symbolic link also binds the content of its resolved target
(a file, or everything below a directory); if that target is dangling, outside
the repository or in an excluded directory, the receipt records no scope and
keeps whole-tree binding. Changing `scope` itself
changes the policy digest and invalidates every receipt.

Set `"scope": "workspace"` instead to derive the scope from the monorepo
workspace package graph: the target package directory plus the full directory
of every workspace package it reaches, transitively, through `dependencies`,
`devDependencies`, `peerDependencies` or `optionalDependencies` (by
`workspace:` protocol, `file:`/`link:`/`portal:` path to a workspace package,
`npm:` alias, or plain name matching a workspace package). Workspaces come from
`pnpm-workspace.yaml` `packages` (for `pnpm`, and for `turbo` when present) or
the root `package.json` `workspaces` array or `{ "packages": [...] }` (for
`npm`, `yarn`, `bun` and otherwise `turbo`); patterns may use `*`, `**` and a
leading `!` exclusion. The target package is the command `cwd` when it is a
workspace package directory, or the single exact filter in argv:
`pnpm --filter <name>` / `-F <name>` / `--filter=<name>`,
`npm -w <name>` / `--workspace <name>`, `yarn workspace <name>`,
`bun --filter <name>`, or `turbo run <task> --filter=<name>` (also via `npx`,
`bunx`, `pnpm [exec]`, `yarn [exec]` or `bun x`). A filter is an exact package
name or a `./path` relative to `cwd` that names a package directory with no
workspace packages nested below it. Only filters before the script or
subcommand name are read for `pnpm`, `npm` and `bun`, and only before `--` for
`turbo`; a filter spelling forwarded to the script fails closed, as does a
`yarn` `workspace` argument anywhere but first. The graph follows only
`package.json` dependency fields: it does not bind imports resolved through a
hoisted root `node_modules`, `tsconfig` `paths` or project references, relative
imports such as `../../packages/x`, bundler or Vitest aliases, Turbo `pkg#task`
dependencies, or scripts that run other packages. Add a dependency entry or use
an array scope for those.

The receipt records the derived directories (sorted) in `provenance.scope`
with `provenance.scopeSource: "workspace"`, covered by the receipt digest. At
validation the scope is derived again from the current graph and must equal the
recorded one, otherwise the receipt reports `stale workspace scope (dependency
graph changed)`; then `scopeDigest` is compared as above. Derivation fails
closed to whole-tree binding and records `provenance.scopeUnresolved`
(`SCOPE_WORKSPACE_UNRESOLVED: <reason>`) when the tool is not one of `pnpm`,
`npm`, `yarn`, `bun` or `turbo`; a filter matches no package, is repeated, or
uses globs, `...`, `^` or other selector syntax; the command is recursive
(`-r`, `--recursive`, `--workspaces`, `yarn workspaces`, `turbo --affected`),
changes directory (`-C`, `--dir`, `--prefix`, `--cwd`, `-w` for pnpm), or is
`turbo` without a single filter; it runs at the repository root, or in a
directory that is not a package, without a filter; a manifest or workspace
declaration is missing or unparsable; package names are duplicated; a
`workspace:` dependency names no package or a local path dependency leaves the
workspace; or the graph exceeds 2000 packages or depth 64.

After a passing Verify transition records a scoped receipt, subsequent phases
retain it as Verify evidence while its scope remains current. A fresh canonical
review and exact promotion proof are still required independently; an unrelated
edit does not make previously accepted Verify evidence block Review.

Scope never applies to full-CI commands (policy validation refuses it), to
Integrate, Deliver or Publish promotion proof, remote-checks receipts, review
receipts, human `empirical_qa_record` records, collected browser or screenshot
evidence, exact reuse, or retries: all of those keep exact whole-tree binding.
A stale scoped receipt reports `stale scope digest`; an unscoped one reports
`stale tree digest`.

Any command may declare `full-ci` (for example `["pnpm", "run", "ci"]`,
`["make", "ci"]` or `["python", "-m", "pytest"]`); `["bun", "run", "ci"]` also
counts as full CI without declaring it. A changed-file command cannot.

During integration, a full-CI command never executes in the independent
target, on either promotion route. Replay runs only the Verify selection's
commands in policy order; a command left out appears in `replay.covered` when
the selected commands cover every check it declares, and in `replay.notSelected`
with a reason otherwise. A feature
that changes the policy or `package.json` scripts replays every bare non-full-CI
command instead. For a full-CI command other than `bun run ci`, changes to the
task-runner manifests in its `cwd` (`Makefile`, `GNUmakefile`, `justfile`,
`Taskfile.yml`, `turbo.json`, `nx.json`, `noxfile.py`, `tox.ini`) or to a file
named by a relative argv path also replay every bare command and force the
local route. When full CI is the only configured command, nothing replays and
`replay.note` says the promotion route proves it. Declare only checks a command actually exercises.

Shell launchers and shell-control arguments are rejected. Delivery, when
enabled, is `{ "provider": "github", "targetBranch": "main",
"requiredChecks": ["test"] }`.

Policy v2 accepts an optional `"promotion": { "fullCi": "auto" }`,
`{ "fullCi": "local" }` or `{ "fullCi": "remote-checks" }`. Omitted, empty and
`auto` are equivalent and are normalized away, so an unchanged policy keeps its
digest and existing receipts stay valid. An explicit `local` is kept, so a
policy that literally contains it changes digest once. `remote-checks` requires
GitHub delivery, at least one `requiredChecks` entry and a configured full-CI
command; any other value fails with `INVALID_POLICY` before the file changes.
`auto` selects route `ci` only when GitHub delivery pins at least one required
check, a full-CI command is configured, no local-forcing reason applies, and
the feature's standing authorization reaches at least `delivered` (otherwise
`DELIVERY_NOT_AUTHORIZED`, because nothing would ever run PR CI);
otherwise it selects route `local` and lists every reason (see the
[promotion route protocol](protocol.md#promotion-route)). `empirical_policy` and policy-mode
`empirical_configure` return the policy plus a read-only top-level
`"effective": { "promotion": { "fullCi": "auto" } }`. Configure input may
include that object only when it matches the submitted policy; committed policy
files never contain it. Empirical versions before this release reject a policy
that sets `promotion`.

Route `ci` under `auto`, like `remote-checks`, also requires, on the target branch: branch protection
or rulesets that require every policy check name with a concrete app pin (legacy
`contexts[]`, `app_id` null or -1 and ruleset entries without `integration_id`
fail with `REMOTE_CHECK_SOURCE_UNPINNED`); the same `auto` or `remote-checks`
policy committed on the target; and workflow or composite-action `uses:` references
pinned to a full commit SHA or Docker digest, with local actions only under
`.github/actions/` or `.github/workflows/`. See the
[remote-checks protocol](protocol.md#remote-required-check-proof).

### Select or resume work in a checkout

Use `empirical_select` with `{ "id": "existing-feature" }` (and optional `root`)
to select an existing non-terminal unclaimed spec and receive its current action.
The equivalent private adapter is `empirical __internal select --id existing-feature`.
Durable checkout selection requires Git; non-Git calls return `GIT_REQUIRED`
without claiming successful selection.
Selection does not advance a revision, cancel the previous feature, or move any
spec out of `.empirical/specs/`. A different live worktree cannot claim the same
feature; different features can be selected concurrently.

To move a live owner's unfinished spec, use `empirical_transfer` at the
destination root with `{ "feature": "existing-feature", "sourceRoot":
"/absolute/source-checkout", "revision": 7 }` and optional `actor`. Both
worktrees must belong to the same registered Git repository, and the destination
must already have matching validated history. Transfer keeps the original
capability bases and immutable receipts; it does not move uncommitted files.
Stale or mismatched histories fail before ownership changes.

Use `empirical_overview` with optional `root` for a read-only inventory of specs
and registered worktrees, including ownership, branch, profile, phase,
verification status, next action and per-entry diagnostics. It never selects,
moves or removes specs. Routine feature work validates addressed claims; the
repository-wide Doctor still reports all damaged capability records.

Multiple unclaimed specs are valid repository work. `init`, `integrations` and
`context` do not need to choose among them. An explicitly identified new start
selects its own feature when the checkout has no selected active work. A
Git checkout without selection stays idle. A legacy non-Git ambiguous call returns `MULTIPLE_ACTIVE_FEATURES` and
`structuredContent.details.features`, with the explicit selection operation.

Ignored, untracked local environment files are discovered by default for
worktrees. `empirical_init` and `empirical_configure` accept optional
`localFiles: { discover?, include?, exclude? }` (defaults: `discover: true`,
include `**/.env` and `**/.env.*`, exclude `.env.example`, `.env.sample`,
`.env.template` and backups matching `*.bak*`) and optional `copyFiles`, an array of at most 100 literal
repository-relative paths that are always required. Send only the fields you
change; they merge with saved values. `localFiles: { discover: false }` opts out.
Patterns use `/`, `*`, `?` and whole-segment `**`; invalid entries return
`INVALID_CONFIG` and save nothing.

Every worktree proposal's `localFiles` lists the exact ordered copy list, its
`discovered` subset and `refused` `{ path, reason }` entries. Show that list;
approving the proposal approves exactly those copies. Pass the proposal's
`localFiles` unchanged to `empirical_worktree_create`. The handoff reports
`localFiles: { copied, skippedExisting, missingOptional, unapproved, refused }`
with paths only; `unapproved` paths appeared after the proposal, were not copied,
and carry `remediation` to run prepare. More than 200 candidates fails the
proposal with `WORKTREE_LOCAL_FILES_LIMIT`.

`empirical_worktree_prepare` fills a registered worktree that a host tool,
`git worktree add`, delegation or transfer produced. Inputs are
`{ root?, source?, target?, approvalToken?, approved? }`; `target` defaults to the
invoking checkout and `source` to the main worktree. Call it without
`approvalToken` for a read-only preview, show the listed paths, then call it again
with the returned `approvalToken` and `approved: true` in the same turn without
asking for another confirmation; repository configuration is standing consent.
Apply copies only previewed missing paths, is idempotent, and reports the same
`localFiles` shape. Invalid roots return `WORKTREE_PREPARE_INVALID_TARGET` and a
mismatched token `WORKTREE_PREPARE_INVALID_TOKEN`, both with the code in
`structuredContent`. See [local environment files](protocol.md#local-environment-files-in-worktrees)
and [preparing an existing worktree](protocol.md#preparing-an-existing-worktree)
for syntax, refusal reasons, limits and interrupted-copy recovery.

### Stay current with the target branch

`empirical_sync_target` keeps a feature branch current with its target. Inputs
are `{ root?, target?, fetch? }`; `target` defaults to `isolation.baseBranch` (or
the detected base when it is `auto`), and a local target with an upstream is
compared against that remote-tracking ref. Only `fetch: true` contacts the
remote. When the branch is behind, the worktree has no uncommitted tracked
changes and `git merge-tree --write-tree` predicts no conflicts, it merges the
target into the current branch (a merge commit, never a rebase, reset or
force) and returns `status: "merged"` with `changedFiles` and `mergeCommit`.
Otherwise it changes nothing and returns `status: "current"` or
`status: "refused"` with `reason` (`conflicts`, `conflicts-unknown`,
`dirty-worktree`, `on-target` or `detached-head`) and the conflicting file
list. It never pushes. The CLI form is
`empirical __internal sync-target [--fetch] [--target <ref>]`.

Action packets read the same freshness from local refs only, so repeated reads
are stable and never fetch. When the branch is behind with predicted conflicts,
or more than `staleness.maxBehind` commits behind (default 10), the roadmap adds
a `waitingOn` item of kind `decision`, for example
`Branch is 12 commits behind develop; conflicts in: src/core.ts`, and
`nextAction` suggests syncing. It never blocks a gate. The optional project
configuration `staleness: { enabled?, maxBehind? }` is written only when set;
invalid values return `INVALID_CONFIG`. Agents sync at each checkpoint and
before opening or updating a pull request, push the merge, report conflicting
files immediately and re-run only the tests for the conflicted files.

Approved worktree creation is retryable using the exact original input. After
Git creation, a handoff error returns structured recovery details rather than
requiring a second worktree. Retry verifies the recorded path, branch, common
repository and base, then binds/resumes the approved feature. Unrelated unclaimed
specs and dirty source edits remain in place. The new checkout starts from the
exact approved committed base. See the [protocol](protocol.md#recovering-an-approved-worktree-handoff)
for recovery and compatibility details.

### Native sub-agent delegation

This bridge dispatches through real host-native agent tools. It is separate from
`empirical_handoff`, which prepares an explicitly approved external executable
handoff. Empirical does not infer host support from installed skills or a guessed
command name.

Discover the host's exposed registry and any available tool search/lazy-loading
path. `empirical_delegation_discover` accepts `host` metadata describing its
identity, instance, provider, capabilities and actual spawn, lookup, status and
stop tools. Each tool includes its name, provider, description, input schema and
canonical-to-native field bindings. `capabilities` distinguishes `readOnly`,
`isolatedCwd`, `idempotentSpawn` and optional `fencedCancellation` (absent means
false). These declarations must reflect actual host
guarantees; a prompt requesting read-only behavior is insufficient.

The direct bridge requires a host that accepts a stable idempotency key,
isolated cwd, prompt, read-only flag and path scope for spawning, plus lookup by
that key and status by agent id. Ordinary hosts bind stop to `agentId`; hosts
declaring `fencedCancellation: true` bind stop to `dispatchId` instead and must
atomically prohibit all future launches under that key. Native schemas requiring
nested arguments
or additional translation need an explicit compatible host adapter. Hosts that
only expose a prompt-taking spawn tool cannot use this bridge directly.

After the user's authorization covers the bounded work, call
`empirical_delegation_prepare` with:

```json
{
  "id": "settings-filter-worker-1",
  "approved": true,
  "parent": { "feature": "settings-improvements", "revision": 4 },
  "worker": {
    "root": "/absolute/settings-filter-worktree",
    "feature": "settings-filter",
    "revision": 2
  },
  "role": "implement",
  "instruction": "Implement the approved settings filter criteria.",
  "scope": ["src/settings", "tests/settings.test.ts"],
  "host": "<the discovered host descriptor>",
  "maxConcurrency": 4
}
```

The `host` value is the descriptor object, abbreviated in this example. Roles
are `consult`, `specify` and `implement`. Writable roles require a separate
registered worktree with the exact child spec selected in Specify or Implement
respectively. Create and prepare that child workflow before dispatch; spawning
does not silently create its spec or worktree. Consult requires actual
host-enforced read-only support. Scope paths are repository-relative; the stable
assignment id and exact feature revisions bind retries to the same assignment.
Set `approved: true` only when existing user authorization covers that assignment;
do not request another permission prompt for already authorized work.

Preparation reserves the feature/root slot before returning an intent. Execute
that intent's actual tool name and arguments using the host, then pass its
normalized observation to `empirical_delegation_accept` with `id`, `intentId` and
`result`. Copy the exact returned intent id and digest-based dispatch id; the
caller-chosen assignment `id` is a separate identifier. Results bind `hostId`,
`instanceId`, `dispatchId`, operation, outcome,
agent identity and confirmed termination; they are observations, not workflow
evidence. Never acknowledge a spawn that has not been observed.

`empirical_delegation_status` lists assignments when `id` is omitted. With an
`id`, `action: "observe"` or `action: "cancel"` prepares the next observation or
stop intent. Execute and accept it through the same bridge. After a lost spawn
response, reconcile the stable identity with lookup; do not blindly retry a
spawn. Cancellation retains its reservation until the native runtime confirms
termination. For an unknown launch on an ordinary host, even an authoritative
`not-found` result cannot release the reservation: a delayed spawn request may
still arrive. Keep observing until an actual child or terminal record is known.
A host declaring `fencedCancellation` can stop the stable dispatch key, prevent
delayed/retried spawns, and confirm cancellation with a null `agentId`. Merely
failing to find a child does not prove this guarantee. Unknown outcomes remain
reserved and visible.

Library callers can use `runDelegation` and `advanceDelegation` with an injected
runtime exposing the same `host` descriptor and `execute(intent)` function.
Neither runtime execution nor MCP acceptance advances a child's workflow phase,
creates a receipt, or proves acceptance criteria. Read its durable state and
inspect its actual changes, then complete the exact revision through the normal
Fast or Complex contract. Existing tracker gates and delivery/publication
boundaries remain in force.

## On-demand feature QA

`empirical_qa_plan` is read-only. Agent phase transitions and edits do not authorize
`empirical_qa_execute`: that call is an explicit execution request from the caller.
Select a bounded command for the feature and criteria the user requested. The API
does not infer consent from chat or discover test dependencies inside arbitrary
scripts; the host agent must honor the user's scope and inspect command contents.

Full-CI commands are excluded from ordinary check candidates, even when they also
advertise unit or integration coverage. If only full CI is configured, focused
coverage remains missing. Fresh full CI must select `qa-full-ci` explicitly; its
receipt still covers declared checks. Exact receipt reuse across those checks
remains available without executing again and retains all provenance validation.

### Verify selection

Without a profile, `empirical_qa_plan` (and private `qa-plan`) returns the
unchanged matrix with a sibling `selection` array; the matrix body and `digest`
are the same as before. Each automated Verify-gate check gets one entry:
`{ checkId, commandId, estimateMs, sharedWith, reason }`. `commandId` is one of
the check's `commandIds`, chosen as the minimum-cost cover: fewest unknown
estimates, then lowest summed `estimateMs`, then fewest commands, then earliest
policy order (exact up to 16 candidates, a deterministic greedy fallback above).
Full-CI commands are never candidates, and changed-file commands are candidates
only when a changed test file matches. `estimateMs` is the command's median
over its last three completed attempts, or null; `sharedWith` lists the other
checks that run in the same command; `reason` is at most 160 characters, for
example `cheapest cover (~1m 12s); also covers qa-integration, qa-unit`. A check
no candidate covers has `commandId: null` and keeps its existing
`uncoveredCriteria` issue. Equal policy, matrix, tree and receipts produce
byte-identical selections. A profile plan marks each `executable` entry
`selected`. The selection is advisory for execution only: any passing applicable
receipt still satisfies a check. Run a command outside it only when the user
explicitly asks. Roadmap Verify checks name `selectedCommandId`, and
`nextAction` reads, for example,
`Run focused-qa for qa-unit, qa-integration at revision 42 (~1m 12s) when you request tests`.

Action packets stay compact. `roadmap.verificationSelection` entries carry
`testCount` instead of the `tests` list and its per-test reasons, and
`verificationMatrix` is present only during Verify; every other phase returns
`null` there and summarizes the checks in `roadmap.checks`. Call
`empirical_qa_plan` when you need the full matrix or the affected test paths.

### Full-suite approval

A fresh `empirical_qa_execute` (or `empirical_evidence_execute`) run of any
full-CI command refuses with `FULL_SUITE_APPROVAL_REQUIRED` before any process
starts unless a current approval matches the feature, workflow revision, Git
commit, tree digest, policy digest, command id, argv digest and the estimate that
was shown. The error's structured `details` carry `{ commandId, estimateMs,
revision, route }`. Reusing an existing receipt with `reuseReceiptId` needs no
approval.

`empirical_qa_approve` takes `{ revision, commandId, estimateMs }` (`estimateMs`
null when unknown) and records an immutable approval only when all three match
the current packet; otherwise it fails with `STALE_REVISION`,
`QA_COMMAND_NOT_APPLICABLE` or `FULL_SUITE_APPROVAL_MISMATCH` (with the current
estimate). A dirty source checkout fails with `QA_CHECKOUT_DIRTY`. When the
client advertises `elicitation.form`, the server first asks the user
`Run full suite <command> at rev N (~estimate)? Reason: …` and records
`confirmation: "elicited"` only on an explicit yes; a decline or cancel returns
`APPROVAL_DECLINED` and records nothing. An empty `elicitation` capability counts
as form support; one that advertises elicitation without forms fails with
`FULL_SUITE_APPROVAL_FORM_REQUIRED`. Only a host that advertises no elicitation
records `confirmation: "agent-relayed"`, so call it only after the user's
explicit yes in the conversation. Approving never changes workflow state or the
revision, and a repeated approval converges on the first record. The private
CLI is `empirical __internal qa-approve --revision N --command ID
--estimate-ms MS|unknown`: an interactive terminal confirms with `y/N` (recorded
as `cli`), and non-interactive input requires `--yes` (recorded as
`cli-unattended`), passed only after the user's explicit yes and never after a
declined form. Each approval authorizes one fresh run: its use is recorded before
the command starts, and approving the same identity again after that creates a
renewed record. The roadmap's local full-CI check shows the marker as
`approval`. No phase, loop, consolidate, complete or promote call records or
implies an approval, and lifecycle observation (`empirical_tracker_record` with a
command receipt) refuses full-CI commands.

At the publication boundary (a delivered, not yet published Complex feature),
pass the explicit publication authorization to `empirical_qa_execute` as
`publicationAuthorization: { authorization, packageName, version, distTag }`.
When it verifies, has ceiling `published`, and is bound to the repository,
feature, version, dist-tag and the checkout's current commit, it is the approval
for Publish's own full-CI run: execution records `confirmation:
"publication-authorization"` with the authorization digest and asks no second
question. Anywhere else, or when any binding differs, it is ignored and the run
refuses as above.

A request to skip tests never creates a passing receipt or bypasses Verify or a
promotion gate. Leave the feature pending and resume the same revision when the
user requests tests or more changes. The full suite runs only as pull-request CI
or as an approved local run; an explicit no-tests constraint must instead leave the
conflicting gate pending. No phase read, loop, iterate, consolidate, complete,
promote or retry executes a command.

### Host progress notifications

When an `empirical_qa_execute` or `empirical_integrate` request carries a
`progressToken`, every existing verification heartbeat also sends
`notifications/progress`: `progress` is strictly increasing elapsed
milliseconds, `total` is the known estimate when one exists, and `message` is
the check id (QA) or command id (integration replay), its status, and the
feature's phase position while it runs. QA messages read like
`[empirical qa] qa-unit: command; …; phase 6/8 verify` and end with the command
outcome, for example `finished; command passed; exit 0; …`. Integration replay
messages read like
`qa-unit: finished: passed (exit 0) (inspect command result) (phase 7/8 integrate)`.
The phase and its total come from the same derivation the roadmap uses,
including the review-first Complex order; Deliver and Publish report the full
total, as the roadmap does. The facts travel in the message text; the
notification itself keeps only the standard `progressToken`, `progress`,
`total` and `message` fields. The pass/fail mark reports how the command exited
(exit 0, no timeout or signal); the receipt remains what decides whether a check
is proven. Without a token no
notification is sent. Stderr heartbeats, structured results, receipts and gate
outcomes are the same either way, and the notification carries no argv,
environment value or command output.

### Verification profiles

`empirical_qa_plan`, `empirical_qa_execute` and `empirical_evidence_execute`
accept an optional `verificationProfile` (private CLI: `qa-plan --profile`, or
the field in `--input` JSON). Map "run the changed tests" or "run the affected
tests" to `iterate` and "now run it", "run everything" or "ready to close" to
`final`.

- `iterate` executes only commands configured with `testFiles: "changed"`,
  including under `reuseReceiptId`; full-CI and other commands fail with
  `QA_COMMAND_NOT_APPLICABLE`, and a changed-file command with no matching test
  keeps `NO_CHANGED_TESTS`.
- `final` on Complex covers the matrix; a Verify request runs its selection, and
  the promotion full-CI check still needs its route (PR CI or an approved local run).
- On Fast a profile is required. Fast `final` runs configured non-full-CI
  commands against an optional matrix whose receipts never make Fast verified.
  A Done Fast feature is no longer selected, so `empirical_qa_plan`,
  `empirical_qa_execute`, `empirical_evidence_execute` and
  `empirical_evidence_collect` accept its `id` (CLI `--id`) while it is
  implemented and not integrated; its completion level does not change, and
  evidence execution for it needs an explicit profile. Any other feature passed
  by id fails with `QA_NOT_READY` before migration or execution.

With a profile, `empirical_qa_plan` returns a read-only
`verification_profile_plan` with `executable`, `refused` and `deferred` commands;
the matrix digest is identical for both profiles. `executable` lists each command
once with the `coveredCheckIds` a single run covers. Before Integrate, a command
covering a promotion check such as `qa-full-ci` is `deferred` as a whole rather
than executable, and `verificationProfiles.final` omits it, because Integrate
accepts only an exact receipt for its own revision and commit. Omitting the profile keeps the previous
behavior (Complex `final`, Fast `QA_NOT_READY`). Action packets report
`verificationProfiles` with the command ids each profile allows and the profile
an omitted request uses. Each request produces receipts for that request only; a
later `iterate` clears them without scheduling another run.

### Background verification jobs

`empirical_qa_start` accepts the `empirical_qa_execute` request fields except
`reuseReceiptId` and `artifacts`, validates them identically (matrix, command,
profile, criteria, pause and tracker gates), and returns immediately with
`{ jobId, status, estimateMs }`. It refuses a dirty source checkout with
`JOB_WORKTREE_DIRTY` because the job verifies a snapshot of the committed `HEAD`,
not the working tree.

Each job is a durable record at
`<git-common-dir>/empirical-sdd/jobs/<jobId>/job.json` with a bounded
`output.log`. Records hold the feature, workflow revision, commit, tree digest,
check and command identity, argv and cwd, originating checkout, and policy and
matrix digests; never environment values or secrets. The shared runner opens
that checkout's named feature and executes the saved argv. Jobs queued by an
older version without these bindings report `JOB_STALE`; start them again.
A detached worker (`empirical __internal qa-worker`) takes the repository runner
lock, so one job runs at a time and later starts report `queued`. For each job
it creates `git worktree add --detach` of the exact commit in a temporary
directory, links the source `node_modules` when present (a package manifest
declaring dependencies without `node_modules` fails with
`DEPENDENCIES_UNAVAILABLE`), runs the configured command with the normal runtime
limits, and appends an ordinary QA receipt to the source feature's evidence
bound to the job's commit. A snapshot tree that differs from the tree recorded
at start fails with `JOB_TREE_MISMATCH`; a feature revision that moved before
the job ran, or a changed policy or command, marks it `stale` without a receipt.
Policy changes during execution leave the receipt bound to the original policy,
so it cannot satisfy the new policy. The snapshot worktree is always
removed, unlinking the dependency link first.

Job statuses are `queued`, `running`, `passed`, `failed`, `cancelled`, `stale`
and `error`. `empirical_qa_status` (read-only, optional `jobId`) lists jobs in
creation order with elapsed time, estimate, exit code, receipt id, a bounded log
tail, and `stale: true` with a `staleReason` when the selected feature, its
revision, policy, or the source commit/tree no longer match the job. A stale job's
receipt remains immutable but cannot satisfy gates for the new revision; start
a new job. A `running` job whose worker has exited reports `error` with
`JOB_WORKER_LOST`. `empirical_qa_cancel` marks the job `cancelled`, aborts its
detached command group before terminating the worker, removes its snapshot, and lets the queue
continue.

The worker rewrites `output.log` while the command runs, at most every 500 ms,
with the same output caps and redaction as the final log, so the `logTail` of a
`running` job shows current progress.

When a job fails, the worker reads the command output for failing test files:
bun test `(fail)` lines under their file header, node `--test` `not ok` entries
and their `location`, and vitest/jest `FAIL <path>` lines. Paths resolve from
the command `cwd` and are kept only when they are tracked test files in the
repository (at most 50, repository-relative, sorted); they appear as
`failingTestFiles` in `empirical_qa_status`. Nothing is guessed from other
output.

To rerun only those files, pass them as `testFiles` to `empirical_qa_start`
with a command configured with `testFiles: "changed"`:

```json
{ "checkId": "qa-unit", "commandId": "unit-changed", "criteria": ["AC-1"],
  "summary": "Rerun failing tests", "testFiles": ["tests/sample.test.ts"] }
```

The files replace the changed-file selection and are appended to the configured
argv. A command without `testFiles: "changed"` refuses them with
`TEST_FILES_UNSUPPORTED`; an empty list, too many files, an absolute or `..`
path, a non-test path, or a file that is not tracked fails with
`INVALID_TEST_FILES` before any job is recorded. `userApproved: true` records
on the job that the user explicitly said yes in chat to this run; the guidance
sets it for a full regression started without CI. It is a marker, not a
standing approval. Full-CI jobs also require the exact approval recorded by
`empirical_qa_approve`: `qa_start` checks it before queueing, and the worker
consumes it once before execution. Missing or already-used approval returns
`FULL_SUITE_APPROVAL_REQUIRED`; the chat marker cannot bypass that guard.

Action packets list the active feature's five most recent jobs in
`roadmap.jobs`, newest first, with stable fields only:
`{ id, checkId, commandId, status, receiptId, stale, estimateMs, failingTestFiles }`
(`failingTestFiles` is a count). Elapsed time is never in the packet. A
`running` or `queued` job that is not stale adds one informational
`test-request` item to `waitingOn`; it never blocks and never replaces
`nextAction`. The CLI status card adds a `Regression:` line for the newest job,
for example `running (job ab12, qa-full-ci) · ~18m estimate`,
`passed (job ab12, qa-full-ci) → receipt qa-…` or
`failed (job ab12, qa-full-ci) → 3 failing test files`.

## Avoiding repeated final QA commands

For an explicitly requested verification, read `empirical_qa_plan` and execute
each selected command once for all criteria it covers. For an approved local
full-suite run, start with `qa-full-ci`: promotion requires a receipt originally
executed as full CI from a clean checkout. Its `coveredChecks` can also satisfy other matrix rows. Keep
fresh-context acceptance and independent review separate.

When another request needs the **same command** for an already covered check,
pass `reuseReceiptId` to `empirical_qa_execute`. The operation returns the original
immutable receipt after revalidating the exact repository, feature, workflow
revision, Git commit, source tree, specification, policy, matrix, host runtime,
resolved configured executable path and bytes, command configuration, criteria
and artifact bytes. It does not issue a new
receipt or move evidence to a later revision. Stale, failed, retried, unavailable,
tampered or incompatible evidence causes an error; omit `reuseReceiptId` to run
the required command again. Reuse cannot be combined with `retryOf` or new
artifacts. Legacy receipts without an executable fingerprint remain readable
but require fresh execution before using this reuse path. Unresolvable or
changed executable fingerprints also reject reuse. QA runs the resolved
fingerprinted executable, retaining configured arguments; a selected executable
that cannot be fingerprinted never borrows a later PATH entry’s identity. It cannot replace a different command just because both advertise
similar checks.

QA execution and independent integration replay emit bounded command-id,
start/completion and 15-second heartbeat progress on stderr, including the reason
for execution and the feature's phase position. Child output and environment
values are not streamed; structured stdout remains unchanged. Completion
messages mark whether the command passed or failed, identify timeouts, signals
and exit codes, and direct operators to inspect the command result; a timeout or
signal is never marked passed. Command timeout
cleanup is bounded to two additional seconds, including inherited output pipes;
captured output retains the latest bytes rather than the start of a long log.
QA also measures preparation, command execution, finalization and reuse
separately. A requested MCP progress token receives these phase updates via
`notifications/progress`. Result `_meta["empirical/qaExecution"]` carries the
final timing summary separately from the original structured receipt and its
digest. Notification flushing waits at most one second for a slow client.

**When a command times out.** A timeout records a failed `timed-out` attempt, never a passing one, and never locks the feature. The roadmap marks the check with `timedOutAfterMs` and adds a `Waiting on you` decision naming the exits, and the agent offers them instead of rerunning the same command in the foreground:

- run it in the background with `empirical_qa_start` and keep working;
- run a smaller configured command that covers the check (Verify needs one command per check, not the full suite);
- hand the full suite to pull-request CI;
- raise that command's `timeoutMs` in the policy, up to the maximum (15 minutes); this changes the policy, so earlier receipts need a new run;
- stop, or ship as is with a draft pull request (the checkpoint exits).

A later passing attempt clears the decision. Before a run estimated near its timeout or longer than ten minutes, the agent offers the background run first.
Receipt `attempt.durationMs` continues to measure the command itself, so it must
not be compared with total tool-call or conversation time as if they were equal.
An unavailable initial runtime fingerprint or a non-passing command skips the
second runtime scan; the receipt remains ineligible for reuse. Invalid retry
history is rejected before command execution and revalidated afterward.
Explicit reuse reports its validation reason. Independent integration and
changed release candidates still rerun their checks.

Deliver does not need a second full-CI run for an unchanged candidate. Without
an exact current-revision receipt it accepts the full-CI receipt Integrate
recorded when the verified journal head is exactly that Integrate completion and
the commit, tree, spec revision and digest, policy, command argv, runtime inputs,
executable and platform are identical and the checkout is clean. Any mismatch
fails with `QA_PROMOTION_REQUIRED` and `details.mismatch` naming it (for example
`git-commit`, `tree-digest`, `policy-digest`, `command`, `runtime-inputs`,
`journal-head` or `journal-transition:<revision>:<summary>`). `reuseReceiptId`
keeps exact workflow-revision matching and Publish never carries over.

On route `ci` under `auto`, Integrate needs no full-CI receipt and records
`promotionRoute` in its integration receipt. Under explicit
`promotion.fullCi: "remote-checks"`, Integrate can accept passing required GitHub
checks for an exact commit that is already pushed. Without a local receipt under
either mode, Deliver may push and open the source pull request, then returns
`{ "outcome": "promotion-proof-required", "stage": "source", "pullRequest", "reasons", "route" }`
until the checks pass on the exact head; it requests no review, ready transition,
merge or evidence pull request before that. `route` is `ci` while waiting. Under
`auto`, when remote proof is ineligible (an unreadable, unpinned or disagreeing
required set, a target policy mismatch, or a local-forcing reason), `route` is
`local` and `approval: { commandId, estimateMs, revision }` names the full-suite
run to ask the user about; the fallback is recorded for that Deliver revision, so
status and the roadmap show the approval item instead of the PR CI note; after approval, the local receipt at the Deliver
revision satisfies the exact local path. Explicit `remote-checks` refuses before
any push instead. Reasons are structured codes such as
`REMOTE_CHECK_PENDING`, `REMOTE_CHECK_MISSING`, `REMOTE_CHECK_FAILED`,
`REMOTE_CHECK_SOURCE_UNPINNED`, `REMOTE_CHECK_SOURCE_AMBIGUOUS`,
`REMOTE_CHECK_HEAD_MISMATCH`, `REMOTE_REQUIRED_SET_UNREADABLE`,
`REMOTE_REQUIRED_SET_DISAGREES`, `REMOTE_READER_ERROR`, `REMOTE_HEAD_LAG`,
`REMOTE_NOT_PUSHED`, `REMOTE_REPOSITORY_UNRESOLVED`,
`REMOTE_TARGET_BASE_UNRESOLVED`, `REMOTE_TARGET_POLICY_NOT_REMOTE`,
`REMOTE_TARGET_POLICY_MISMATCH`, `REMOTE_CONFIGURATION_CHANGED` (with `paths`),
`REMOTE_MUTABLE_WORKFLOW_REF`, `REMOTE_CHECKOUT_DIRTY` and, for Publish,
`REMOTE_PUBLISH_REJECTED`. A different proof binding for the same head fails with
`DELIVERY_PROMOTION_PROOF_CONFLICT`. In-process hosts and tests inject a GitHub
checks reader through `EmpiricalMcpServerOptions.promotionProofDependencies`.

For repeatable timings and the supported comparison workload, see
[verification performance](verification-performance.md).

### Preferred Linear connection and legacy recovery

Check the host's authenticated Linear MCP tools before attempting Empirical's
legacy credential path. Sibling tools are available to the agent, not discoverable
by the Empirical MCP server itself. When available, prefer Policy v2
`connection: "linear-mcp"`; no API key is needed.

For a legacy Linear policy, `empirical_tracker_linear_mcp_prepare` returns a
credential-free migration candidate. Collect authenticated MCP discovery, preview
the candidate, then configure it and resume the same feature. The candidate
preserves team/project, all seven state mappings, ticket rules, visibility and
enforcement. Policy v1 maps its manual/best-effort behavior to manual tickets,
milestone comments (one per phase change) and best-effort enforcement; its legacy description projection
is replaced by comments. Existing binding and pending recovery identities are
retained. Do not re-create a ticket to change transports.

New MCP tickets use the specification heading and curated problem, outcome,
scope, non-goals, acceptance criteria and verification sections. Explicit create
titles and descriptions take precedence. Request transcripts and capability
metadata are excluded. Later Policy v2 synchronization does not write descriptions.

The deterministic recovery URL is stored as an issue attachment via `links`,
separate from the rendered description. Normalize `get_issue` attachments into
`attachmentUrls`, including an empty array when the hydrated issue has none.
Linear can normalize Markdown; creation acknowledgement validates the recovery
attachment rather than exact description bytes. Reconciliation (`find-issues`)
is one intent per listing page. The intent's `limit` is 50, and every page
after the first carries the `cursor` to pass. Include archived issues, hydrate
each issue on the page with `get_issue`, and submit
`{ "kind": "issues", "issues": [...], "nextCursor": <the listing's next cursor or null> }`.
Empirical keeps only the issues whose recovery identity matches the lookup,
reduced to their identity fields and marker lines, and returns the next page's
intent until `nextCursor` is null. It then settles the lookup from those
matches alone. Neither the core provider response nor the committed bridge
record grows with team size, so a team of any size stays under the 1 MiB
response cap. The limit is 200 pages (10,000 issues), and no other issue's
description is written to the repository. A repeated cursor, more than 200
pages, missing attachment hydration, and ambiguous matches fail closed.
Hosts from v0.37 and earlier may still submit one complete listing
(`complete: true`, at most 500 issues), which is reduced the same way. The
next prepare scrubs a bridge record written by an earlier version that cached
a whole listing. A lost create is never automatically repeated when no unique
recovery identity is found. Older description markers remain readable for
existing pending operations.

Package upgrades do not rewrite repository-local managed skills. Run the
`empirical_integrations` repair operation after an upgrade; inspection reports
stale skills, and repository regression tests compare checked-in skills to fresh
generation so packaged guidance cannot silently outpace this checkout again.

Linear MCP results also have an aggregate serialized-response budget of
8 MiB of UTF-8. Oversized results are rejected before replacing the current intent; a
size error must never leave the bridge record unreadable. Per-issue and
pagination limits still apply independently.

A finished feature can't be selected, so `empirical_tracker_bind` accepts an
explicit `feature` to attach its existing ticket (link-only, no transition or
comments). `empirical_tracker_waive` closes a selected or terminal feature's
pending projection without a provider call and records the audited reason. See
[Lifecycle tracking](tracking.md#required-ticket-semantics).

## Direct mode

Direct work is an ordinary agent turn: no specification, state, journal event,
decision, receipt, tracker update or worktree proposal, no reading of
`.empirical/specs/**`, decisions, capabilities or context pages, and no test,
lint, typecheck or build unless the user asks for one. Direct turns make no
Empirical call at all; `empirical_direct` exists only for the three transitions
below and never returns an action packet with criteria, never executes a
configured command, and never pushes, merges, tags or publishes. The agent
itself follows the Ship early rule of the agent contract in direct turns too.

`empirical_direct` accepts `action` (`pause`, `resume` or `track`), `revision`
(required for `pause` and `resume`), `profile` (`fast` by default, or `complex`,
for `track`), optional `id` and optional `actor`.

- `pause` ("go direct") records `pause: { since, baseCommit }` on the selected
  feature with one `Pause: direct mode` journal event, keeping phase, status,
  approvals, receipts and completion. A feature that is Done or awaiting a human
  cannot pause; a second pause fails `FEATURE_PAUSED`.
- `resume` ("back to Empirical") clears the pause and lists the paths changed
  between `baseCommit` and the working tree, excluding `.empirical/`. With no
  path it records `Resume: no direct changes`. Otherwise Fast work in Implement
  or implemented Done, and iterative Complex work in an iterate-eligible phase,
  receive exactly one `iterate` without contract revision summarized
  `Direct work: <n> files: <paths>` under iterate's own guards; any other feature
  records that summary as one journal event and keeps its phase, status and
  receipts. `SPEC_CHANGED`, selection and tracker gates leave the feature paused
  so the user can clear them. A guard that a paused feature cannot clear
  (`WORKFLOW_BLOCKED`, `ITERATION_NOT_READY`, `PROMOTION_REQUIRED`,
  `CONTRACT_REVISION_REQUIRED`) records the resume as one journal event naming
  the unmet guard instead, because `retry` and `promote` refuse a paused feature.
  The summary is generated from changed paths, so its wording never routes the
  risk floor; real floors stay enforced at completion, promotion, integration,
  delivery and publication.
- `track` ("track this") rebuilds direct history from Git: commits after the
  tracked commit recorded in `<git-dir>/empirical-sdd/direct-tracked` (or, without
  such an ancestor marker, commits on no remote-tracking ref), plus uncommitted
  and untracked paths not already tracked with identical content, all excluding
  `.empirical/`. It starts a Fast or Complex feature under the existing start
  rules whose request lists those entries, then advances the marker. An empty
  range fails `NOTHING_TO_TRACK`, and a paused feature fails `FEATURE_PAUSED`.

While a feature is paused, `empirical_loop` and `empirical_next` return only the
paused action naming `resume`, `empirical_status` and `empirical_overview` report
the pause, and `empirical_complete`, `empirical_iterate`, `empirical_consolidate`,
`empirical_promote`, `empirical_retry`, `empirical_qa_execute`,
`empirical_qa_start`, `empirical_qa_cancel`, `empirical_qa_record`, `empirical_evidence_execute`, `empirical_evidence_collect`,
`empirical_integrate`, `empirical_deliver` and `empirical_publish` fail with
`FEATURE_PAUSED` without changing state.

`empirical_configure` accepts an optional team `defaultMode` (`empirical` or
`direct`, or `null` to clear) and `scope: "personal"`, which writes or clears
`{ "defaultMode" }` in `<git-dir>/empirical-sdd/preferences.json` without touching
`.empirical/`. The agent resolves the lane from the request phrase, then a
selected feature, then the personal override, then the team default, then
`empirical`; `activationMode` semantics are unchanged.

## Development, iteration, and consolidation

`empirical_complex` accepts `iterative: true` for a larger feature with an explicit
feedback stage. The first implementation ends with `lifecycle.awaitingFeedback`
and remains selected. `empirical_iterate` accepts `revision`, `request`, optional
`reviseContract`, optional `amendContract`, and optional `actor`; it starts an
adjustment in that same feature. Combining `amendContract` with `reviseContract`
fails with `INVALID_ARGUMENT`. `amendContract` on a feature not started as
iterative fails with `CONTRACT_AMENDMENT_UNAVAILABLE` and changes nothing.
`empirical_consolidate` accepts `revision`, optional `summary`, and optional `actor`;
use it after an explicit ready-to-close request to enter the required QA/review flow.
Consolidation itself runs no tests and authorizes none; "ready to close" is the
explicit request to run the Verify-gate checks once with
`verificationProfile: "final"`. Full CI runs once at Integrate, which accepts only
an exact full-CI receipt for its own revision and commit.
Fast features iterate through the same operation (see Fast iteration above) but
cannot consolidate without explicit promotion.

Complex Implement actions carry a bounded deterministic `contractSummary` (goal,
criterion ids, accepted decisions, open risks) whose `references` list
the full spec, design, decisions and plan as optional reading, and
`capabilityContext` lists only the capabilities the feature's deltas declare. The
criteria text travels once, in `acceptanceCriteria`. An
iteration action adds `adjustmentRequest`, which overrides conflicting earlier
criteria and decisions.

Size guardrail: a Complex action in Specify through Implement whose contract has
more than 6 acceptance criteria or more than 2 capability deltas carries
`featureSize` (`criteria`, `capabilities`, `over`, `reasons`, per-capability
`slices`, `decisionPending`). While a decision is pending, `roadmap.waitingOn`
adds a `decision` item ("Feature is large: N criteria across M capabilities —
split into slices?") and `nextAction` names both options. It never blocks a
gate. `empirical_split_decision` (`__internal split-decision --revision N --keep
--reason <text>` or `--split`) records the choice at the exact revision as one
journal event: `keep` requires a reason and covers that contract size (a larger
contract asks again); `split` returns guidance to start each slice as its own
feature in a separate checkout. Keep the first slice in the current feature:
in Specify, narrow the unapproved contract directly; in Design or Plan (as well
as later development phases), call `empirical_iterate` with
`reviseContract: true` and the returned revision before editing the approved
contract. The previous contract is retained and the narrowed contract must pass
Specify again. Nothing is split automatically. Limits are configurable with the
optional `sizeGuardrail` block in `.empirical/config.json` (`enabled`,
`maxCriteria`, `maxCapabilities`); invalid values are `INVALID_CONFIG`.

During an iteration of a feature that started with `iterative: true`, behavior
changes at the same risk floor amend the contract in
place: edited criteria, declared requirement contents and decisions are accepted
and re-approved when the Implement revision completes, with the approved contract
kept in `contract-revisions/<revision>.baseline.json` and the change recorded in
`<revision>.amendment.json`. Ordinary Complex work that enters the iteration loop
keeps the strict approved-contract errors. Consolidation, Review and
`empirical_explain` list those amendments. When the change raises the risk floor or changes the declared
capability scope, the amendment fails with `CONTRACT_REVISION_REQUIRED` and
`reviseContract: true` is the only path: it retains the previous contract version
and returns to specification and design without dropping the original comparison
base. Worktree proposal/create inputs accept `iterative`; approval
binds it alongside local-file preparation. See the
[protocol lifecycle](protocol.md#iterative-feature-development) for exact semantics.

## Automatic lifecycle projection

Policy v2 core mutations synchronize after committing local state. For Linear
MCP, `tracker.intent` contains the exact host operation; submit its normalized
result with `empirical_tracker_linear_mcp_accept`. An injected trusted
`TrackerDependencies.linearMcpExecutor` can drain the bridge automatically.
Strict gates remain active, and read-only operations dispatch nothing.

`empirical_tracker_record` accepts `sourceFeature` and either `receipt:
"publication"`, `receipt: "execution"` with `receiptId`, or `receipt: "command"`
with a configured `commandId`. See [Lifecycle tracking](tracking.md) for the
explicit completion policy and observer output contract.


## Workflow clarity and diagnostics

Users can run `empirical doctor [--options] [--json]` directly, including before
setup. MCP `empirical_doctor` also returns the configuration catalog and effective
values. Unknown fields and credential values are not reported. See the complete
[configuration reference](configuration.md) and [short harness guide](harness-guide.md).

`empirical_complete`, `empirical_integrate` and `empirical_feature_close` accept optional `decisionBy`
for user-supplied decision attribution. The actor performing the operation is
separate. Omitted attribution remains unknown. A terminal transition writes
`completionRecord` and the readable `completion.md` beside the spec.

A current approved review covers `qa-fresh-context` only for non-UI review-first
Complex work without a configured fresh-context command. The roadmap reports
“covered by review; no separate execution.” Never manufacture a human QA record
for this case. UI outcome checks, stale reviews and configured commands retain
their existing requirements. The reverse substitution (QA for code review) is
not supported.

Verification plans expose affected test paths and selection reasons. A passing
command's committed baseline can narrow its next run. Relative imports and name
mapping are supported; aliases and dynamic dependencies may need an explicit
selection or broader configured command. Reruns never silently become full CI.
