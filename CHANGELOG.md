# Changelog

All notable changes to Empirical SDD are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
under the alpha rules in [docs/versioning.md](docs/versioning.md).

## [Unreleased]

## [0.42.0] - 2026-10-01

### Changed

- Complex and Quick features no longer stop in a Context phase (C3a). In the
  project's own journals, 18 features spent about 40 seconds each there, and
  each stop still cost an agent round trip, a journal event and a tracker
  update.
  - Completing Implement now refreshes repository context itself, then goes
    straight to Review (or Verify for features that verify first).
  - The refreshed files under `.empirical/context/` come back as
    `pendingPaths`. Commit them with the implementation.
  - If a page still needs a person or agent, completion refuses with
    `CONTEXT_REFINEMENT_REQUIRED` and the feature stays in Implement.
  - A Complex feature now counts 7 phases instead of 8.
  - Fast is unchanged. A feature already parked in Context completes it as
    before and moves on to the phase after Implement.
- Under the default standard binding, nothing runs after Verify (C3b). In the
  journals, 12 of 25 features sat in Integrate or Deliver with nothing left to
  prove.
  - Completing Implement projects the approved capability deltas into
    `.empirical/capabilities/` (returned in `pendingPaths`), so Review sees the
    spec change together with the code. Repeating it is safe.
  - Integrate only waits for the merge of the feature's pull request: no
    `empirical_feature_finalize`, no replay in an independent worktree.
    Pull-request CI proves the merged result. `empirical_complete` there
    answers `MERGE_PENDING`.
  - When Empirical sees the merge, it closes the feature as integrated. The
    `closure.json` merge facts (pull request, merge commit, target branch) are
    the integration record.
  - Work that reached Integrate before this change, strict binding and YOLO
    keep finalization and Integrate as before.

### Fixed

- Transferring a feature to another checkout works on Windows (SDD-133).
  Git for Windows turns on `core.autocrlf` by default, so a file committed with
  LF comes out as CRLF in a new worktree. The transfer compared the two trees
  byte for byte and stopped with `FEATURE_TRANSFER_MISMATCH` even when both
  checkouts held the same commit.
  - The implementation tree is now compared with text line endings
    normalized. Scripts and other files where CRLF matters stay exact.
  - Feature artifacts under `.empirical/` are still compared byte for byte.
  - A transfer left pending by an older version can still finish.

### Migration

No migration required.

## [0.41.0] - 2026-09-28

### Changed

- `empirical_iterate` with `amendContract: true` on a Complex feature not
  started as iterative is refused immediately with
  `CONTRACT_AMENDMENT_UNAVAILABLE`, and the error names both alternatives.
  Before, it was accepted, and completion then failed with `SPEC_CHANGED`.
  Iteration instructions for those features no longer promise an in-place
  amendment.
- Action packets are about 63% smaller. The roadmap's Verify selection carries
  a test count instead of every affected test path and the import reasons for
  each one, and the full verification matrix appears only during Verify. For a
  Complex feature in Implement, the SDD-163 packet dropped from 35.6 KB to
  13.0 KB. `empirical_qa_plan` still returns the full matrix and test list.
  In Complex Implement, the contract summary names criterion ids and no longer
  repeats text that `acceptanceCriteria` already carries.
- Time budgets count active work instead of wall-clock time. Each gap between
  journal events counts at most 30 minutes, so an overnight pause no longer
  turns a two-hour feature into "15h of 2h". A continue checkpoint now sets the
  budget to the time already used plus the requested minutes; before, it added
  to the old cap and could leave the feature still over budget.
- Review verdicts are derived from the criteria and blocking findings. A
  review that failed a criterion but said `APPROVED`, or approved with a
  blocking finding, used to be rejected, and the reviewer had to be run again.
  It is now recorded with the verdict its own content implies. The
  submission's `verdict` field is optional. Which findings block is unchanged.
- A `low` security review finding no longer blocks. It is deferred to a
  follow-up like other non-blocking findings, and security findings rated
  `medium` or above still block. Reviewers are told to rate an exposed
  credential, token or personal data, or an authentication bypass, at least
  `high`.
- A legacy (v1) Linear policy migrated to Linear MCP now posts one comment per
  phase change (`milestones`) instead of one per revision. New repositories
  already defaulted to `milestones`.
- Each tracker update now takes at most two provider calls (SDD-163). The
  EMP-429 pilot spent about 25 Linear calls per feature.
  - Comments are no longer preceded by a full comment listing. Listing happens
    only after an interrupted send.
  - Linear state changes skip the pre-update read.
  - Missed revisions fold into the next comment as one `Since the last update`
    line.
  - A request that starts with a ticket key (`SDD-168: …`) attaches that ticket
    directly, without scanning the team.
  - Milestone comments read as plain markdown, without backslashes on every
    punctuation mark. Only structure-changing characters and autolink-forming
    dots are escaped, and mentions, links and secrets are still neutralised.

### Fixed

- Plane tracker discovery accepts project and state names with spaces, such as
  "In Progress". v0.40.0 validated these display names with the id rule, so
  `empirical init` stopped at Tracking with `TRACKER_MALFORMED_RESPONSE` for
  almost every real Plane workspace. Names still reject control characters
  and are capped at 256 characters, like Linear, GitHub and Jira names.
- Codex no longer triggers Doctor errors that repair can't clear (SDD-168).
  Codex rewrites `.codex/config.toml` and drops comments, which removed
  Empirical's markers, so Doctor kept reporting `PROJECT_ACTIVATION_STALE` and
  `PROJECT_INTEGRATIONS_DRIFTED` after every launch.
  - Empirical now parses the file and checks only that `mcp_servers.empirical`
    has `command = "empirical"` and `args = ["mcp"]`, with or without markers.
  - Repair writes nothing when the bridge is current or the file is invalid
    TOML, and it still never rewrites a user-authored table.
- A pull request merged outside Empirical now closes its feature as terminal.
  Closure checks the merge against the remote target first and falls back to
  the local target only when the remote-tracking ref is missing. A failed
  ancestry check changes nothing and says to fetch and retry. Closure clears
  pending feedback and never invents verification or review results.
- A synchronized tracker ticket no longer goes stale after every metadata-only
  commit. Evidence links used `HEAD`, so any commit changed them; they now
  point to the last commit that touched each artifact, and its committed bytes
  are still checked against the receipt. Terminal recovery in a checkout also
  survives branch switches: histories missing from the current branch are
  skipped, and their obligations apply again when their files return.

### Added

- The Empirical skill reads the current checkout's status before the global
  overview and shows both as Current SDD and Global SDD tables, including idle
  and empty states. Reading status never changes workflow state.

- New Doctor warning `HOST_CONFIG_CREDENTIAL` for a Git-tracked
  `.codex/config.toml`, `.mcp.json`, `.cursor/mcp.json` or
  `.gemini/settings.json` that holds a credential-shaped value (SDD-168).
  - It names only the file and key path, never the value.
  - It recommends `bearer_token_env_var`, `env_http_headers`, environment
    references or OAuth.
  - It has no automatic fix.

### Migration

No migration required.

## [0.40.0] - 2026-09-25

### Added

- `empirical status` shows where SDD work stands, for the current checkout and
  across branches and checkouts. A draft pull request reads as `in progress`,
  and a feature reaches `ready to merge` only once verification proof exists.

### Changed

- A merged pull request closes its feature (SDD-155). In Cortex, 19 of 21
  features with a merged pull request stayed open and needed hand-closure pull
  requests, with a median lag of five days.
  - Under the default `standard` binding, `next`, `select` and starting a new
    Fast or Complex feature close every unfinished feature, at Implement or
    later, whose merge into the target branch the forge proves. No reconcile or
    second approval is needed: merging was the decision. The closure records
    confirmation `merge-observed` and keeps the feature's honest completion
    level. It still applies if this checkout recorded more workflow after the
    merge.
  - Under `standard`, Integrate never enters the two-pull-request Deliver flow:
    one pull request, and its merge closes the feature. Deliver with
    exact-head proof and a separate evidence pull request is `strict` only.
  - Nothing is observed without an `origin` remote. `strict` binding keeps
    reconcile an explicit, approved step.
- Verify asks only for what the change touches (SDD-162). A Cortex UI button
  routed `sensitive` was asked for adapter-contract, fault-injection and a
  thirty-minute end-to-end suite; none of the selected commands ran its code.
  - Under the default `standard` binding the matrix is focused tests, the
    checks the feature's declared capabilities and surfaces imply, a browser
    outcome check for `[UI]` criteria, and full CI at the pull request. The
    risk-floor checks are `strict` only, as is the automated end-to-end check
    for `[UI]` criteria.
  - Changed-file tests win every check they cover. The unit check is no
    longer handed to a broader command because it also covers another check.
- Merged features are found wherever they merged (SDD-161). After a cleanup of
  empirical-sdd's own `develop`, 22 of 150 features were still open with their
  work merged, and the merge observer above closed only 3 of them.
  - The merge is proven on the isolation base first (`develop`, where feature
    pull requests land), then on the delivery target (`main`). Checking only
    the delivery target missed every feature merged into `develop`.
  - Stacked pull requests close. When a feature merged into another feature
    branch, the proof uses the pull request whose merge brought its
    specification onto the target, and that merge's own diff must still touch
    the feature's specification.
  - Doctor reports `FEATURES_MERGED_NOT_CLOSED`, offline, for unfinished work
    whose specification already reached a target. Its fix closes every merge
    the forge proves, in one approved step, under either binding.
  - On empirical-sdd `develop`, one `doctor fix` closed 21 of the 23 open
    features. The other two belong to live local checkouts and are named.

- Proof follows content, not the exact commit (SDD-156). Committing evidence,
  committing other Empirical records, or merging the target branch no longer
  forces a re-test or a re-review; in Cortex this caused REVIEW_STALE laps even
  when every Verify receipt passed.
  - New policy setting `promotion.binding`: `standard` (the default, omitted
    from the file) or `strict`. Existing policies keep their digest, so no
    receipt is invalidated by upgrading.
  - Under `standard`: QA reuse, full-suite approvals, the Integrate proof and
    background jobs compare the tree, spec, policy and command instead of the
    commit and workflow revision. Scope-bound QA receipts stay valid in every
    phase while their scope is unchanged.
  - Under `standard`, a review stays valid across commits that change only
    generated Empirical records, and across target-branch merges that bring
    files this feature never touched. A change to reviewed source or to an
    authored input (spec, design, plan, decisions, impact, config, policy)
    still requires a new review.
  - `strict` keeps today's exact-commit behavior for releases and audits.
- Review converges after one repair round (SDD-157).
  - Non-blocking findings (medium and low, outside security and acceptance)
    are deferred automatically when the review is recorded, so they never
    start another fix, re-test and re-review lap. When a tracker is configured,
    triage offers one follow-up ticket for them (`follow-up` exit), created
    only on the user's yes and recorded with `empirical_review_defer`.
  - The review-round limit is no longer advisory. When a second review still
    requests changes, `triage.mustChoose` is true and the exits start with
    converging: open or merge the pull request and track what remains, then
    one more fix lap with its cost, then stop. The agent never starts a
    further lap without that choice.
  - A finding deferred automatically can be deferred again with a ticket.

### Fixed

- The word "publish" alone no longer routes work as package publication
  (SDD-160). In product repositories it is ordinary vocabulary: "Add a Publish
  report action" was routed `publication`, which added release gates and a
  ten-check verification matrix (package-consumer, clean-clone, cross-platform,
  fault-injection) to a UI button. `publication` now needs its artifact:
  `npm publish`, a dist-tag, `git tag`, a GitHub release, a version number,
  publish or release beside a package, registry or version, or cut, make or
  prepare a release. Explicit release requests keep every publication gate.
- Worktree preparation no longer copies environment backups (SDD-167). The
  default `isolation.localFiles.exclude` adds `*.bak*`, so a `.env.bak-*` file
  beside a real `.env` stays in the source checkout.
- When the Empirical MCP tools are missing from a session, or older than the
  installed package, the skill continues through the CLI fallback and tells the
  user once that a new agent session restarts the server (SDD-166). Users were
  asked to reconnect a server they never configured.
- Evidence settings live in one file, `config.json` `evidence` (SDD-142). The
  copy in `policy.json` `verification.evidence` was synchronized both ways but
  never read by any gate, and adopting repositories had to keep the two in sync
  by hand.
  - Init, adopt, `configure` and the Schema-4 migration no longer write it, and
    `configure policy` no longer copies it into config. A policy input that tries
    to change it is refused with `POLICY_EVIDENCE_RETIRED`.
  - A copy written by an older release stays in `policy.json` unchanged,
    because existing receipts, approvals and promotion proofs are bound to the
    policy digest; nothing needs re-verifying. Doctor warns with
    `POLICY_EVIDENCE_CONTRADICTS_CONFIG` only when that copy disagrees with
    `config.json`, which is the one gates use.
  - The configuration reference lists the evidence options once, under config.
- One `CLAUDE.md` with `AGENTS.md` and `GEMINI.md` as links to it now works on
  Windows too (SDD-143).
  - With `core.symlinks=false`, Git writes a link as a regular file holding only
    its text. Init used to prepend the managed block to that file, silently
    replacing the repository's link with a copy. Init now never writes into it,
    and Doctor reports `PROJECT_ACTIVATION_SYMLINK_CHECKED_OUT_AS_FILE`, a
    checkout-only warning with the steps to restore real links.
  - Link text `./CLAUDE.md` is accepted on every platform, not only where the
    path separator is `/`.
  - Opting out of automatic activation keeps `CLAUDE.md` when another checkout
    links to it.
  - Alias tests run on Windows wherever symbolic links can be created.
- Approved worktree handoffs now direct agents to continue implementation in
  the target checkout before a host directory switch can end the turn and leave
  the task waiting for another user message.

### Migration

Refresh managed Empirical agent instructions after upgrading. Existing
best-effort optional tracking remains non-blocking; required-ticket workflows
must synchronize their ticket before mutation or use the audited waiver path.
No durable Schema 5 conversion is required.

## [0.39.0] - 2026-09-24

### Added

- Prepare all local feature artifacts before PR merge through the API, CLI and
  MCP `feature-finalize` operation; confirm the committed candidate without
  generating another batch of files after merge.

### Changed

- Review round limits are advisory: actionable repairs can continue while
  blocking findings and failed acceptance criteria remain explicit.
- Verification progress includes selected test files and counts alongside the
  current phase, making the affected area visible while a command runs.

### Fixed

- Completion confirmation also binds authored contracts, policy and capability
  projections, plus source executable modes, symlinks and submodule commits.
  Nested projects resolve Git paths correctly, and PR merge rechecks local HEAD
  so a clean but unpushed commit cannot be left behind.

- Local feature finalization prepares capability projections, completion records
  and journal compaction on the source branch before its PR merges (SDD-151).
  `feature-finalize` uses scoped evidence and independent validation without
  requiring full CI. Commit its reported paths, then confirm the exact revision;
  confirmation writes nothing, including after merge. Existing completion
  records remain readable; new records bind confirmation to a source digest.
  No persisted-state migration is required, and historical records without that
  binding cannot provide the new finalization confirmation.
- Terminal forced closure previews all outstanding paths and refuses unresolved
  checkout changes; its new closure artifacts must then be committed before
  merge (SDD-149).
- Independent integration replay preserves affected-test paths against the
  target baseline and never executes changed-test commands with bare argv,
  including changed-only policies (SDD-150).

- Delivery checks the entire non-ignored working tree immediately before each
  PR merge and reports outstanding paths, including Empirical artifacts
  (SDD-149). Commit and push feature changes before retrying; unrelated work
  requires the user's disposition. No persisted-state migration is required.
- Verify prefers affected-test commands on the first run when they cover all
  required automated checks, without requiring repair or passing-run history
  first (SDD-150). Missing coverage retains the broader configured selection;
  promotion and publication checks are unchanged. No configuration migration
  is required.

- Repository context freshness is derived from Git history, so a healthy
  repository stays healthy, real changes are no longer missed, and nothing
  derived is committed (SDD-140, SDD-135).
  - **No manifest, no fingerprints.** A page is stale when a commit changed one
    of its sources and is not an ancestor of a commit that edited the page or
    added a review record for it. Review records are uniquely named files under
    `.empirical/context/reviews/<page>/`, so branches that refresh never
    conflict. The `manifest.json` of earlier releases is obsolete: Doctor notes
    it as `KNOWLEDGE_MANIFEST_OBSOLETE` (`info`) and one safe doctor-fix refresh
    deletes it, whether it was committed or gitignored.
  - **Tracked files only, as Git blob ids.** Untracked files, the checkout
    folder and `core.autocrlf` no longer change repository freshness. A clean
    CRLF checkout on Windows used to report every page stale.
  - **Sources chosen by relevance.** Each page selects its sources by pattern
    (manifests and workspace files, package manifests, source roots, `scripts/`
    and CI) instead of the first 1,200 files in alphabetical order, which left
    `packages/`, the root `package.json` and `scripts/` unhashed in large
    repositories.
  - **History excluded.** `ai/specs`, archive, history, snapshot and CHANGELOG
    paths are excluded by default; add more with `context.exclude` in
    `.empirical/config.json`.
  - **`index.md` is structure only.** It no longer contains the checkout folder
    name or a whole-repository fingerprint, so worktrees write byte-identical
    pages. The repository name comes from `context.name` or the root manifest,
    never a remote. When only the index is out of date, Doctor reports
    `KNOWLEDGE_INDEX_STALE` as `info` and Context is not blocked.
  - **Work in progress.** Untracked files a page would select never make Doctor
    warn; they appear as `KNOWLEDGE_UNTRACKED_SOURCES` (`info`), and the Context
    phase gate (`contextReady`) requires a review, because features create files
    before staging them. Refresh reports them in `untrackedSources`.
  - Shallow clones report `KNOWLEDGE_FRESHNESS_UNKNOWN` (`info`) and never block.
  - Doctor findings gain an `info` severity that never changes Doctor's status.
  - Public API: `RepositoryKnowledgeManifest` is removed,
    `RepositoryKnowledgeFile` drops `size`, and `RepositoryKnowledgeReport`
    gains `reviewed` and `untrackedSources`; its `manifest` field now names the
    reviews directory.

### Migration

- Upgrade participating machines together and refresh the managed Empirical
  agent instructions. Ordinary Complex work now uses `feature-finalize` at
  Integrate: commit existing work, prepare the local artifacts, commit and push
  the returned paths on the same branch, then confirm with the feature id and
  returned revision before merging. Required PR checks and publication gates
  still apply.
- Preserve historical completion records. Records without original source and
  artifact bindings remain readable but cannot provide the new finalization
  confirmation. Use a reviewed iteration or new feature for later changes;
  never invent or backfill an unobserved completion binding.
- Run Doctor after upgrading repositories with the old context manifest. Its
  previewed context-refresh fix removes the obsolete manifest and retains
  authored context pages; future freshness is derived from Git history and
  uniquely named review records.
- API consumers must remove `RepositoryKnowledgeManifest` usage, stop reading
  `RepositoryKnowledgeFile.size`, and handle `reviewed` and `untrackedSources`
  on `RepositoryKnowledgeReport`. Its `manifest` field names the reviews
  directory rather than a mutable manifest file.
- Schema 5 is unchanged; no bulk state conversion is required.

## [0.38.0] - 2026-09-22

### Added

- A recorded way out of a feature that cannot satisfy its next gate.
  - **`feature-close`:** ends a stuck or externally merged feature, or advances
    exactly one stage past a gate, against a required bounded public reason. It
    records no completion fact, writes no receipt, and never merges, pushes or
    publishes, so a closed feature reports honestly afterwards. Outcome
    `merged-externally` observes the pull request and refuses unless it is
    genuinely merged into the target branch; the observed facts are recorded and
    still do not make the feature delivered. A forced advance refuses to enter
    Integrate, Deliver, Publish or Archive. This is the operation the Schema 5
    `archive` stub never provided.
  - **`cleanup`:** prunes the orphans the read-only Doctor report names —
    expired lock leases, stale capability claims, prunable worktree
    registrations, orphan migration scratch and resolved checkout recovery
    entries — one explicitly named class at a time. It refuses live locks,
    invalid claims and every journal, receipt and contract-revision path.
  - **`reconcile`:** finds unfinished features whose work already merged on
    GitHub, from each spec's last commit and without a PR number, and closes
    the approved ones as `merged-externally` in one step without selecting
    them. Features before Implement, without a provable merge, or owned by
    another live checkout are listed and never closed. `status` and `overview`
    flag merged-not-closed features offline.
  - **`merged-externally` accepts large pull requests:** ownership is proven
    from the merge commit's Git diff instead of the forge's file list, which
    stops at 100 files and refused real merges.
  - **Doctor stays read-only** and now names both operations as remediation.
  - Both preview the exact effect first and require explicit confirmation:
    - **CLI:** an interactive terminal.
    - **MCP:** on a form-capable host, Empirical asks the user itself
      (`elicited`); otherwise it accepts the agent's relay of the user's yes
      (`agent-relayed`). YOLO and standing authorization never cover either.
    - **Cleanup:** an approval is bound to the previewed plan's digest.
  - **Safety rules:**
    - A forced advance never skips Shape, Specify, Verify or Review, so a later
      step can never claim unproven work; a feature stuck there is closed.
    - A terminal close releases the feature's capability claim.
    - Overview and the done instructions report a closed feature as closed,
      and an abandoned or superseded one never moves its tracker ticket to done.
    - `merged-externally` must name a pull request that belongs to the feature
      (its head is the current branch, or it changed the feature's spec) and
      that landed in the configured target branch.
    - Cleanup removes a lock only when its lease expired and its owning process
      is gone, re-checked under the recovery lock. It drops a claim only under
      its claim lock and while it is still the planned claim.
    - Under strict tracker enforcement, cleanup never forgets a checkout
      recovery entry.
  - `WorkflowState` gains an optional `closure` field; Schema 5 is unchanged and
    states written before this release keep identical bytes.
- Resolution for finished features whose tracker projection never
  synchronized (SDD-136). A terminal feature can't be selected, so both take an
  explicit `feature`:
  - **`tracker-bind --feature`:** attaches a terminal feature to an existing
    ticket, link-only. One read validates the ticket; the binding is recorded
    as synchronized with no transition, milestone comment or create. Under a
    Linear MCP connection, bind now goes through the agent-mediated bridge.
  - **`tracker-waive`:** closes a terminal feature's pending projection as
    `tracked-elsewhere` or `abandoned`, with a bounded justification and an
    optional external ticket. It makes no provider call. One journal event
    carries a checksummed `trackerWaiver`, health becomes `waived`, and Doctor
    reports `TRACKER_WAIVED` instead of `TRACKER_SYNC_FAILED`. It refuses a
    create that may already have reached the provider.
  - `WorkflowState` gains an optional `trackerWaiver`; states without one keep
    identical bytes.
- Doctor self-healing (SDD-137). Before, a Doctor finding came with free-text
  remediation that the user or agent had to interpret.
  - **Structured fixes:** every warning and error now carries a structured
    `fix`:
    - `safe` regenerates only Empirical-owned files;
    - `confirm` changes durable state;
    - `decision` offers the options the user chooses between, with the inputs
      each needs;
    - `none` means no automated fix exists.

    A test fails if Doctor gains a code without a classification.
  - **`doctor-fix`:** previews one plan and returns its digest. With the
    approved digest it applies every safe and confirm fix under that single
    approval, runs only the decision options the user chose, and returns a
    fresh Doctor report. Cleanup entries stay bound to their own cleanup plan
    digest. Journals, receipts, credentials and user-owned files are never
    repaired automatically.
  - **CLI `doctor`:** now lists each open finding and how to resolve it. Before,
    it always printed "healthy".

- Public `empirical doctor` and `--options` diagnostics, a configuration reference,
  and a short guide to receipts, independent review, iteration and handoff.
- Durable completion attribution beside each spec, including normal completion,
  closure method/reason, the executing actor and an explicitly supplied decision maker.
- Original capability comparison data travels with approved specs. A fresh full
  clone can restore a missing local claim without substituting a new comparison base.
- Reasoned Policy v2 exclusions for repository-inapplicable package-consumer,
  clean-clone and cross-platform checks, retained in the verification matrix.
- Empirical Flow routing exposes Flow Direct, Flow Delegated and Formal SDD while
  retaining the compatible Fast/Complex profile. Explicit opt-outs stay outside
  Formal SDD; delegated work uses bounded task descriptors and an optional Flow
  Record for recovery. Routing and evaluation helpers are exported, and
  `benchmark:flow` records reproducible routing measurements without inventing
  end-to-end timing or delegation results.

### Changed

- Current approved reviews cover non-UI fresh-context acceptance when no separate
  acceptance command is configured; UI and stale reviews still require their own proof.
- Affected-test selection follows relative JS/TS imports, records its reasons,
  and narrows follow-ups from a previous passing command. Checkpoints name the
  reruns and carried checks; unrelated target syncs preserve delta review.

### Fixed

- A record written after a feature finished no longer leaves its journal
  uncompacted. `tracker-waive` (SDD-136) and `tracker-record` append one
  journal event to a terminal feature; neither re-compacted afterwards, so
  Doctor reported `JOURNAL_TERMINAL_UNCOMPACTED` for a feature that was
  perfectly healthy. Both now compact again, exactly as a recorded closure
  does. Found by running the new Doctor against a real repository.

- Linear MCP reconciliation works for teams of any size (SDD-136). Before,
  the bridge folded the whole hydrated team listing into one provider response,
  which exceeded the 1 MiB cap for a team with about 1 MiB of issue text (402
  issues in practice). Every retry then replayed the cached oversized response,
  so the lookup could never succeed. `find-issues` is now one intent per listing
  page with a `cursor`, and only matching recovery identities are kept between
  pages. The old single complete listing is still accepted and reduced the same
  way.
- The Linear MCP bridge no longer commits other issues' descriptions to
  `tracker/linear-mcp-bridge.json`. Listing responses keep only matching
  issues' identity fields and marker lines, and the next prepare scrubs records
  written by earlier versions.
- An unexecuted Linear MCP intent is named in the first instruction of every
  action packet, with `tracker.intentSinceRevision`. After three revisions
  without it, `nextAction` asks for it first. Before, under `best-effort` it
  surfaced only in Doctor.

- A successful affected-test receipt remains reusable after its follow-up baseline
  advances; exact source, command, revision and runtime checks remain enforced.
- Verification plans evaluate every changed-test command against its own baseline.
- Doctor fix approvals are bound to the repository as well as the planned actions.
- Acknowledged link-only tracker attaches remove the transient `linkOnly` intent
  flag so older strict tracker readers can read the durable record.

### Migration

1. Upgrade every participating machine to empirical-sdd 0.38.0 before sharing
   newly written QA receipts or workflow records. Existing Schema-5 histories
   need no bulk conversion; new optional record fields may require the new reader.
2. Refresh the repository's managed Empirical instructions through Init/repair
   or `empirical_integrations`, then restart connected agent sessions so CLI and
   MCP use the same version. Preserve the saved activation and review choices.
3. To move a legacy in-flight feature to another full clone, first perform its
   next normal transition on the original checkout so its original capability
   comparison data is preserved. New approvals save that data automatically.
   Never copy locks or invent a comparison base when the original data is absent.
4. Use `empirical doctor --options` and the configuration reference for the new
   check-applicability settings. Declare an inapplicable check with a reason;
   do not edit receipts or mark an unexecuted check as passed.

## [0.37.0] - 2026-09-18

### Added

- Repository identity now follows the root of HEAD's first-parent history,
  so full clones can recognize the same durable artifacts. The original
  checkout still accepts its old path-derived id; a reviewed
  `.empirical/identity.json` can declare verified earlier ids for other clones.
  Shallow clones retain a path identity until their full history is available.
- A clone with an absent local capability claim can select and verify its
  feature. Integrate refuses with `CAPABILITY_CLAIM_UNREACHABLE` when the
  comparison base is unavailable; locks, delegation and ownership transfers
  remain restricted to linked worktrees of one checkout. Legacy authorization
  and delivery/publication markers retain their original identity bindings.

- A timed-out verification command now shows its way out. The status card marks the check with `timedOutAfterMs` and adds a decision naming the exits: run it in the background, use a smaller command, hand it to PR CI, raise `timeoutMs` up to the maximum, or stop. The agent is told to offer them instead of rerunning the same command in the foreground, and to suggest the background run before long runs.

- Verification progress now reports where the feature stands and whether each
  command passed. QA execution and independent integration replay carry the
  phase and its 1-based position in the feature's phase order
  (`phase 6/8 verify`), derived from the same order the roadmap reports —
  including the review-first Complex order — and their closing heartbeat marks
  `finished: passed` or `finished: failed` alongside the existing exit code,
  timeout and signal detail. Hosts holding a `progressToken` receive the same
  facts in the progress message text, with only the standard notification
  fields. The receipt still decides what a run proves, a timeout or signal is
  never marked passed, and no argv, environment value or child output enters the
  progress channel.

- Verify proof no longer goes stale for line-ending-only changes, and human QA
  records can bind the paths they assessed. (SDD-84)
  - **Line endings:** QA receipts record `textTreeDigest` (CRLF normalized to
    LF in text files). At the Verify gate and on the status card, a receipt
    below full CI survives a CRLF-only change. Scoped digests normalize too.
    Promotion and full-CI proof stay byte-exact.
  - **Human records:** `qa-record` accepts `assessedPaths`, so a human record
    survives changes outside what it assessed.
  - **Recorded scope:** an executed receipt's recorded scope must still match
    the current policy command's scope and kind.
  - **Scope matching:** entries are NFC-normalized, repeated `**` collapses,
    and `workspace:../path` resolves by directory first.

- After a recorded review, the next local review is a delta re-review. (SDD-85)
  - **What the reviewer sees:** the packet carries `reReview`: the diff since
    the previous reviewed head, the previous canonical review, the findings still
    open, and the non-blocking findings already deferred.
  - **Finding ids:** the reviewer repeats ids that are still open and omits fixed
    ones. Triage reports `findingHistory` with each id as open, fixed, deferred
    or new.
  - **Full review instead:** used when the base moved, the previous head is not
    a merge-free ancestor of HEAD, or the criteria, decisions or amendments
    changed.
  - **Gate check:** the gate rebuilds the same packet from the recorded context
    and refuses a context that no longer matches its stored result.
  - **Pull request body:** deferred findings carried from earlier rounds still
    appear there.

- New Complex and promoted Fast features run Review before Verify. Saved
  features retain their original order; Verify preserves and revalidates the
  independent review before advancing to Integrate.
- Review results may carry structured findings with a severity and a category.
  - Critical, high, security and acceptance findings block, and an approval
    can't carry one.
  - The recorded review returns `triage` with the round and the exits:
    fix (with the Verify checks it re-runs and their estimates), defer
    non-blocking findings to a ticket, open a draft pull request for CI, or
    stop.
  - After the review round limit, the exits must be offered instead of
    another automatic lap.
  - `empirical_review_defer` (`__internal review-defer`) records deferrals.
  - Deliver lists every non-blocking finding and its deferral in the pull
    request body. (SDD-86)

- Verification commands may declare `scope: "workspace"` to derive their
  Verify-gate QA receipt scope from the pnpm, npm, yarn, bun or Turbo workspace
  package graph: the target package plus its transitive workspace
  dependencies. The scope is derived again at validation and a changed graph
  makes the receipt stale; ambiguous targets bind the whole tree and record a
  `SCOPE_WORKSPACE_UNRESOLVED` reason.
- Background verification jobs: `empirical_qa_start`, `empirical_qa_status` and
  `empirical_qa_cancel` (with `__internal qa-start`, `qa-status` and
  `qa-cancel`) run a matrix-authorized command in a detached snapshot worktree
  of the committed `HEAD`, so agents keep working. Jobs are durable records
  under the Git common directory, run one at a time per repository, record a
  normal QA receipt bound to the job commit, report `stale` when the feature
  revision or source tree moves, and always remove their snapshot.
- Background jobs stream a bounded, redacted live log, record the failing test
  files named by bun, node `--test` and vitest/jest output, and accept
  `testFiles` to rerun only tracked test files through a `testFiles: "changed"`
  command. Roadmaps list recent jobs with stable fields, the CLI status card
  adds a `Regression:` line, and managed skills ask for approval before a
  full regression without CI, run it in the background and keep working.

- `empirical_sync_target` (`__internal sync-target [--fetch] [--target <ref>]`)
  keeps a feature branch current with its target: it predicts conflicts with
  `git merge-tree`, merges only when the worktree is clean and conflict-free,
  never rebases, forces or pushes, and otherwise changes nothing and reports the
  conflicting files.
- The roadmap adds a `decision` waiting item and a sync `nextAction` when the
  branch is behind its target with predicted conflicts or by more than
  `staleness.maxBehind` commits (default 10), read from local refs only. The
  optional `staleness` configuration never blocks a gate.
- Managed skills sync with the target at every checkpoint and before opening or
  updating a pull request, and re-run only the tests for conflicted files.
- Size guardrail: Complex features over 6 acceptance criteria or 2
  capabilities in Specify through Implement carry `featureSize`, a non-blocking
  roadmap decision and a `nextAction` proposing slices. `empirical_split_decision`
  records keep (reason required) or split at the exact revision, limits are
  configurable with `sizeGuardrail`, and the skill presents the split option
  before implementing.
- Time budget and checkpoints: roadmaps carry `time` (`elapsedMs`,
  `phaseElapsedMs`, `budgetMs`, `over`) derived from journal timestamps, and
  the status card shows a `Time:` line. An optional per-lane `budget` in
  `.empirical/config.json` defaults to Fast 30, Quick 60 and Complex 120
  minutes; invalid values fail with `INVALID_CONFIG`. An exceeded budget, or
  Review sending work back to Implement, adds a decision checkpoint with
  explicit exits, and `empirical_checkpoint` records the choice to continue
  with more minutes. The generated skill never continues past an exceeded
  budget without the user's choice.
- `empirical_qa_plan` returns a Verify `selection` beside the unchanged matrix:
  one command per automated Verify check, chosen as a deterministic
  minimum-cost cover (fewest unknown estimates, lowest summed median duration,
  fewest commands, earliest policy order) with per-entry `estimateMs`,
  `sharedWith` and `reason`. Full-CI commands are never candidates, and
  changed-file commands only when a changed test file matches. Profile plans mark
  `selected` entries, roadmap Verify checks name `selectedCommandId`, and
  `nextAction` runs the selected command once for every check it covers.
- Local full-suite runs need an explicit, immutable approval bound to the
  feature, revision, commit, tree, policy, command, argv and shown estimate.
  `empirical_qa_approve` (private `qa-approve --revision --command --estimate-ms
  [--yes]`) records it, asking through MCP form elicitation when the host
  advertises elicitation and otherwise marking it `agent-relayed`; the CLI marks
  `cli` or `cli-unattended`. Each approval authorizes one run. Publish's explicit
  publication authorization, passed to `empirical_qa_execute` as
  `publicationAuthorization`, approves Publish's own full-CI run.
- A deterministic `promotionRoute` (`ci` or `local` with every reason) on the
  roadmap's full-CI check; route `local` shows one authorization item with the
  command, estimate, revision and first reason.

### Changed

- Raised the verification command timeout ceiling from 15 to 45 minutes, in the
  runtime bound, both Policy v2 command schemas and the benchmark harness, so a
  long complete suite is no longer killed mid-run. Projects opt in by raising a
  command's `timeoutMs`; this repository's own policy moves after the release,
  because published 0.36.0 and earlier versions, and early 0.37.0 preview
  builds, reject timeouts above 15 minutes.

- Generated agent guidance now ships early: open a draft pull request at the
  first coherent commit of feature work, push every commit, and never let test
  runs block commits or pushes. Tests for the change run in the background and
  heavy runs belong to pull-request CI. Push authority covers only the agent's
  own feature branch and draft pull requests, never merges, protected or target
  branches, or force pushes. Implement instructions carry the same rule.
- An omitted `promotion.fullCi` now means `auto`: pull-request CI with pinned
  required checks proves full CI at Deliver unless an SDD-67 local-forcing reason
  applies, and otherwise the full suite runs locally after approval. The digest
  of an unchanged policy is kept; an explicit `local` is now kept in the parsed
  policy (one digest change) and always runs locally. `remote-checks` is unchanged.
- A fresh `empirical_qa_execute` or `empirical_evidence_execute` full-CI run
  refuses with `FULL_SUITE_APPROVAL_REQUIRED` before starting without a matching
  approval; receipt reuse needs none.
- Integrate on `auto`'s route `ci` needs no full-CI receipt and records the
  route in its integration receipt. Independent replay never executes full CI
  and runs only the Verify selection (every bare non-full-CI command when the
  feature changed verification configuration); `integrationReplayCommands`
  plans replay (`integrationReplayPlan` stays as a deprecated export), and a
  policy with only full-CI commands replays nothing with a plan note.
- Route `ci` also needs delivery authority (`DELIVERY_NOT_AUTHORIZED` otherwise),
  lifecycle observation refuses full-CI commands, and per-command estimates match
  a bare command's exact argv only.
- Under `auto`, Deliver may push and open the source pull request before proof,
  returns `promotion-proof-required` with `route: "ci"` until the exact head is
  green, and switches to `route: "local"` with the pending approval when remote
  proof is ineligible; it merges nothing before proof.
- Skill guidance, Verify, consolidation, Integrate, Deliver and Publish
  instructions state that iterating runs nothing, "run the changed tests" runs
  `iterate` once, Verify runs the selection, the full suite runs only as PR CI or
  an approved local run, and agents never approve on the user's behalf.

### Fixed

- A source change after an approved review returns `REVIEW_STALE` before
  validating Verify receipts, including when the collected review's tree is stale.
- Workspace scope inference refuses every spelling of npm's
  `--include-workspace-root` flag, including `=true`, so root tests and source
  remain bound by whole-tree evidence.

- Scoped QA receipts recorded by a passing Verify gate remain valid Verify
  evidence through later phases. Review artifacts and promotion proof retain
  exact tree binding; an unrelated edit no longer forces another repair lap.
- Background log callback declarations use portable byte arrays so packed
  consumers do not require ambient Node `Buffer` types.
- Split guidance now provides an executable early exit: explicit contract
  revision returns Design or Plan to Specify while retaining the approved
  contract; unapproved Specify work can be narrowed directly. No migration
  required; existing state and receipts retain their schema.
- Verify command selection respects each command's criterion allowlist; a
  cheaper partial command never displaces a command that can satisfy the check.
- Background jobs retain their originating checkout, feature, command arguments
  and policy/matrix bindings. A changed policy cannot certify an older command;
  cancellation terminates the detached test process before snapshot cleanup.
  Older queued jobs without execution bindings fail `JOB_STALE` and must be
  restarted; no durable feature-state migration is required.
- Canonical review failure transitions use triage's recorded-review count and
  round-limit boundary; earlier Verify failures no longer exhaust the first
  review repair. Existing review history is honored without a state migration.
- Command timeouts now terminate POSIX process groups, attempt Windows process
  tree termination, and bound output cleanup so inherited pipes cannot leave QA
  waiting indefinitely. Timeout receipts remain non-passing even when a wrapper
  exits successfully during termination.
- Bounded command logs now retain the final output after noisy setup, and
  verification progress reports timeout, signal and exit status on completion.
- QA reports preparation, command execution, finalization and receipt-reuse
  timings separately. MCP clients requesting progress receive phase updates,
  and the final diagnostic timing summary lives in result metadata, outside the
  immutable receipt.
- QA skips a second dependency fingerprint when the initial fingerprint is
  unavailable or the command failed, timed out or was cancelled. Such receipts
  remain ineligible for reuse. Invalid retry history is rejected before running
  another command and checked again after execution.
- Ready-to-close guidance no longer runs full CI during consolidation. Final
  verification profile plans omit commands covering promotion checks such as
  `qa-full-ci`. Full CI follows the approved local or eligible remote promotion
  route instead of being repeated during Verify and integration replay.
- Verification profile plans list each executable command once with the
  `coveredCheckIds` a single run covers, so a command declared for two checks
  is no longer run twice.
- A Done Fast feature that is implemented and not integrated accepts on-demand
  optional checks again: `qa-plan`, `qa-execute`, `evidence-execute` and
  `evidence-collect` take its explicit `id`, refused before migration for any
  other feature. Evidence execution for it needs an explicit profile. Receipts
  stay optional and the completion level does not change.
- Stale evidence receipts refused by `complete` or `reuseReceiptId`, including
  future revisions, another GitHub repository, unknown matrix checks and
  modified artifacts, return `RECEIPT_STALE` with the receipt id and the changed
  binding instead of `UNEXPECTED`.
- Empty or whitespace-only Context pages are refinement-required, so the
  Context gate no longer passes them.
- At Verify, `verify` evaluates the active feature's valid on-disk receipts the
  way the completion gate would, so it no longer lists them as missing before
  `complete`. Full-CI, remote-checks and review receipts, and every later gate,
  stay recorded-only.
- Review refuses an empty committed diff with `REVIEW_DIFF_EMPTY` and keeps
  committed evidence receipts and journal events out of the reviewed diff. The
  diff spans the whole Git worktree when the project is nested in it. Reviews
  recorded under the previous diff must be requested again.
- A malformed review submission, including one wrapped in a `submission`
  property, returns `INVALID_ARGUMENT` instead of crashing.
- Doctor recommends `core.longpaths=true` for a Git repository on Windows
  (`GIT_LONGPATHS_DISABLED`), because generated evidence receipt paths can
  exceed Git's Windows path limit.

### Migration

- Upgrade to `empirical-sdd@0.37.0`, refresh managed repository/global agent
  skills through Empirical integrations, and restart or reconnect MCP clients
  so they discover the new tools and guidance. Upgrading the package alone does
  not rewrite installed skills or refresh a running server.
- For delta re-review, pass the returned `reReview` context to the isolated
  reviewer, including the previous verdict and open/deferred findings. Keep the
  ids of still-open findings. Prepare a new packet if deferrals change while a
  review is pending; changed bases, merge history or contracts need a full review.
- New Verify QA receipts normalize CRLF in ordinary text. Older scoped receipts
  made on a CRLF checkout may become stale and must be rerun. Human records can
  opt into `assessedPaths`; that scope exception applies during Verify only.
  Review and full-CI/promotion proof retain exact binding. See the documented
  line-ending limitations in `docs/protocol.md` when tests depend on text bytes.
- Keep existing Schema 5 state and receipts; do not reinitialize projects or
  edit evidence to migrate them. New Complex and promoted Fast features record
  `reviewFirst: true`; existing features without that field keep Verify before
  Review. Clients must follow the returned phase and roadmap instead of assuming
  one global order.
- If every full-suite run must remain local, explicitly configure
  `promotion.fullCi: "local"` in the project policy. An omitted setting now uses
  `auto`, which accepts CI only with eligible pinned required checks and delivery
  authority, otherwise requiring a local run. Each fresh local full-suite run
  needs a separate explicit approval bound to the displayed candidate and
  command; delivery authority alone does not approve it.
- Re-run checks or obtain a fresh review when Empirical reports stale proof.
  Explicit `local` normalization can change the policy digest once, and the
  review diff now excludes receipts and journal events. Do not rewrite receipt
  bindings to preserve old approvals.
- To use workspace-derived Verify reuse, opt in with `scope: "workspace"` only
  for commands whose target/dependency graph is resolvable. Commands without a
  scope still bind the whole tree; global inputs always bind, and independent
  review and full-CI promotion proof remain exact.
- Restart any preview-era background jobs that report `JOB_STALE` because they
  lack the new execution bindings. Existing feature state needs no rewrite.
- Treat `roadmap.time` as a live clock when comparing status responses; compare
  durable action fields separately. Respect the budget checkpoint and explicit
  continue/split/defer/stop choices returned by the updated guidance.
- Upgrade every CLI/MCP host before setting command `timeoutMs` above 900000.
  The new ceiling is 2700000 (45 minutes); existing configured limits stay as
  configured. A policy change invalidates its old proof and needs a new approved
  run. Progress consumers should use the returned phase and outcome; MCP keeps
  standard notification fields and carries the extra facts in message text.
- Before moving legacy evidence to another clone, use a full-history checkout
  (unshallow it first when needed). Use the lineage id from post-upgrade receipt
  provenance and only verified prior ids from that repository's older receipts
  to prepare and review `.empirical/identity.json`, following the format in
  `docs/protocol.md`. Commit the record before relying on it in another clone;
  never admit an unknown id just to make validation pass. Existing local path
  identities remain recognized in their original checkout.
- A missing capability claim does not contain a recoverable comparison base.
  Perform integration from the owning checkout or explicitly transfer to one of
  its linked worktrees; do not invent a base or copy Git-private claim state to
  simulate cross-machine ownership.

## [0.36.0] - 2026-09-16

### Added

- Verification commands may declare an optional `scope` of repository-relative
  path prefixes or simple globs. Their Complex Verify-gate QA receipts record a
  scoped content digest and stay valid when only files outside the scope and
  global configuration change. Full-CI commands refuse `scope`, and promotion,
  remote-checks, review, human and collected evidence keep whole-tree binding.
- Added the empirical-init **Track every change** ticket preset. It expands the
  complete feature/fix/chore by Fast/Quick/Complex matrix to `required`, shows
  that matrix before setup is saved, and applies the existing strict tracker
  mutation gate to every kind of work until its ticket is synchronized. Active
  Empirical tasks now also require a destination action and tracker-gate check
  before the first write after changing repository root, checkout, worktree, or
  host environment.
- Automatic Policy v2 post-commit synchronization, prepared Linear MCP intents,
  and recovery of this checkout's pending completed tickets.
- Explicit Init confirmations for all workflow/delivery mappings and the Done
  milestone, plus receipt-backed release and deployment observations.
- Action packets, `empirical_status` and `empirical_explain` return a
  deterministic `roadmap`: `progress` and `phases[]` from the engine's single
  phase order per profile (Complex 8, Quick 5, Fast 2 non-terminal phases),
  one `checks[]` entry per verification-matrix check with its state, receipt id
  and last duration (a `passed` state binds the same proof the completion gate
  requires, including the current repository tree digest), an `estimateMs` for unrun and failed checks from prior
  attempt durations, classified `waitingOn[]` items, a concrete `nextAction`
  and `verificationLeft`. Idle checkouts return `roadmap: null`. Roadmaps and
  estimates are recomputed on every read and never change a gate or transition.
- Human CLI output for `status`, `explain`, `next` and `loop` renders the
  Empirical status card (Done, Not done, Next, Waiting on you, Verification)
  from that roadmap, and `--json` exposes the same `roadmap` field.
- Generated agent skills require the status card at start or resume, at every
  phase change, at every stop, and before any run whose summed estimate is over
  60 seconds or unknown, where they state the estimate and offer to defer.
- `empirical_overview` adds a read-only roadmap summary (progress, phase, next
  action, waiting count, remaining checks) for the first 128 readable spec
  copies; unreadable, failing and beyond-limit copies keep their bounded
  diagnostic and report `roadmap: null`.
- `empirical_qa_execute` and `empirical_integrate` send MCP
  `notifications/progress` for each existing heartbeat when the request carries
  a `progressToken`; requests without one are unchanged.
- Added direct mode: the generated local `empirical` skill and the automatic
  instruction block now start with a self-contained Direct mode section. A
  request that says "direct", "without Empirical" or "quick change" is handled
  as a plain agent turn that makes no Empirical call, reads no specification,
  decision, capability or context page, runs a test, lint, typecheck or build
  only when asked, and ends with
  `Changed <X> in <N> files · not tested (not requested) · say "track this" to formalize`.
- Added `empirical_direct` (library `direct`, private CLI `direct`) with exactly
  three actions: `pause` ("go direct") records `pause: { since, baseCommit }` on
  the selected feature with one `Pause: direct mode` journal event and no spec,
  delta, decision, receipt or tracker gate; `resume` ("back to Empirical")
  clears the pause and folds the paths changed since the base commit in as one
  `iterate` for Fast work in Implement or implemented Done and for iterative
  Complex work in an iterate-eligible phase, and otherwise as one journal event
  that also names any iterate guard a paused feature could not have cleared;
  `track` ("track this") rebuilds direct commits and uncommitted paths from Git
  and starts a Fast (default) or Complex feature whose request lists them.
- While a feature is paused, `loop` and `next` return only a paused action naming
  `resume`, `status` and `overview` report the pause, and `complete`, `iterate`,
  `consolidate`, `promote`, `retry`, QA execution and recording, evidence
  execution and collection, `integrate`, `deliver` and `publish` fail with
  `FEATURE_PAUSED` without state change.
- Added an optional team `defaultMode` (`empirical` or `direct`) to
  `.empirical/config.json` and a personal override in the checkout's
  `<git-dir>/empirical-sdd/preferences.json` through `empirical_configure` with
  `scope: "personal"`. Absence keeps existing configuration bytes identical, any
  other value fails `INVALID_CONFIG`, and `status` reports team, personal and
  effective values with a warning for an unreadable or invalid personal file.
- Complex Implement actions carry `contractSummary`, a deterministic extract of
  the feature's goal, acceptance criteria, accepted decisions and open risks
  bounded to 6,000 characters, with the full spec, design, decisions and plan
  listed as optional `references`. Their `capabilityContext` lists only the
  capabilities the feature's own deltas declare. Iteration actions add
  `adjustmentRequest`, the newest request verbatim, which overrides conflicting
  earlier criteria and decisions; the superseding decision is recorded after the
  change and never blocks Implement completion.
- During an iteration of a Complex feature started with `iterative: true` (recorded
  durably as `lifecycle.iterative`), contract edits to acceptance criteria, declared
  requirement contents and decisions are an amendment by default:
  `empirical_iterate` and the Implement completion accept them and re-approve the
  amended specification and delta digests in one journal event, without returning
  to Specify and without a human confirmation gate. `amendContract: true`
  (`--amend-contract`) is the explicit equivalent, cannot be combined with
  `reviseContract` (`INVALID_ARGUMENT`), and Fast rejects it with
  `PROFILE_CONFLICT`. The approved contract is retained in
  `contract-revisions/<revision>.baseline.json` and each change in
  `<revision>.amendment.json` with previous and current criterion text and
  superseded decision ids. Consolidation and Review actions, the Review packet and
  `empirical_explain` list every amendment since the last full approval. Raising
  the risk floor, adding or removing a delta capability, adding, removing or
  renaming a requirement block, changing its operation, or changing `impact.json`
  fails with `CONTRACT_REVISION_REQUIRED` and re-approves nothing, while a
  `failed`, `blocked` or `awaiting_human` outcome can still be recorded. The risk
  limit compares the resulting risk level over criteria and declared requirement
  text, so rewording, reordering or lowering the floor is not an escalation.
  Outside the iteration stage, and for Complex features without the iterative
  opt-in, contract edits keep failing with `SPEC_CHANGED`, `DELTA_CHANGED` or
  `IMPACT_CHANGED`, and `reviseContract` is unchanged. Retained history is
  authenticated: a baseline is trusted only while it reproduces the approved
  specification and delta digests, and a missing or malformed amendment record
  fails with `CONTRACT_HISTORY_MISSING` or `CONTRACT_HISTORY_INVALID`.

### Fixed

- Any verification command can declare `full-ci`, not only `bun run ci`, so
  repositories built with pnpm, npm, Make, Python or other tools can satisfy the
  promotion gate, use integration replay coverage and opt into `remote-checks`
  (SDD-72). Changed-file commands still cannot declare it. For a non-`bun run ci`
  full-CI command, changes to task-runner manifests in its `cwd` or to files named
  in its argv replay every command during integration and require local proof
  under `remote-checks`. Bun-only policies keep their configuration digest.
- `rationale.missingContext` now lists only unmet requirements: existing
  artifacts, evidence kinds proven by accepted receipts at the current revision
  and QA checks with passing current receipts are excluded, while
  `requiredContext` is unchanged.
- CLI step counts came from a hardcoded 10-phase Complex list that included
  Deliver and Publish; they now equal the engine's `roadmap.progress`.

### Migration

- Schema 5 is unchanged. Update the installed package, refresh the managed
  Empirical skills and repository instructions, and restart connected agent/MCP
  sessions to load the new direct-mode and status-card guidance.
- Existing configurations retain their defaults. To adopt direct mode, request
  it explicitly or configure the optional team/personal `defaultMode`. To adopt
  automatic ticket completion on release or deployment, configure and confirm
  the tracker lifecycle status mappings and production environment in Init.
- Complex iterative features created before 0.36.0 do not have the durable
  `lifecycle.iterative` opt-in and continue using strict contract revision.
  Finish them with the existing revision path, or start new iterative work
  through the normal workflow to use in-place amendments. Do not edit journal
  state or baseline files to add the marker manually.
- Non-Bun repositories may explicitly mark their full-CI command with `full-ci`;
  changed-file commands remain ineligible. Existing Bun-only policies need no
  change.

## [0.35.0] - 2026-09-15

### Added

- Approved mockup files and the chosen direction now accompany Implement, with
  instructions to preserve the approved layout and styles. Missing or unreadable
  mockup files do not introduce a new implementation gate.

- Added default discovery of ignored, untracked local environment files for
  worktrees through `isolation.localFiles` (`discover`, `include`, `exclude`;
  defaults `**/.env` and `**/.env.*` excluding `.env.example`, `.env.sample` and
  `.env.template`, never under `node_modules`, `.git` or `.empirical`). Proposals
  list every explicit and discovered path and every refusal; approving the
  proposal approves exactly those copies. Discovery is bounded to 200 candidates
  and 1 MiB per file, with refusals reported by path and reason.
- Added `empirical_worktree_prepare` (library `prepareWorktree`, internal CLI
  `worktree-prepare`) to preview and apply local file copies for worktrees
  created by host tools, `git worktree add`, delegation or transfer.
- Added `localFiles: { copied, skippedExisting, missingOptional, unapproved, refused }`
  to worktree handoffs and prepare results, plus local file lines in proposal,
  handoff, configuration and Init text.

- Fast features iterate through `empirical_iterate` from Implement or
  implemented Done without promotion or test runs: the lifecycle iteration
  counter increments, the journal keeps every `Iterate:` event, and `id`
  addresses a Done feature. Fast consolidate requires explicit promotion.
- Fast starts create `decisions.md`; status and explain list Accepted Fast
  decisions and report format issues as non-blocking `decisionWarnings`.
- QA planning, QA execution and evidence execution accept an explicit
  `verificationProfile`: `iterate` runs only `testFiles: "changed"` commands and
  `final` runs the configured final scope (Fast `final` excludes full CI and stays
  unverified). Action packets report `verificationProfiles`.
- `empirical_yolo` accepts `profile`; explicit Fast defaults to and is limited to
  the `implemented` ceiling.
- Routes report `matchedFloors`.
- Policy v2 accepts optional `promotion.fullCi` (`local` or `remote-checks`);
  policy and configure results report a read-only `effective` value. Empirical
  versions before this release reject a policy that sets `promotion`.
- Opt-in `remote-checks` promotion proof: passing, app-pinned GitHub required
  check runs for the exact pushed commit create an immutable `remote-checks`
  receipt through an injectable checks reader. Integrate accepts it only for an
  already pushed commit; Deliver may push and open the source pull request and
  returns `promotion-proof-required` until it passes, binding proof per head
  before any merge; Publish rejects it. Remote proof is refused when the branch
  changes policy, package scripts, workflows, composite actions, `scripts/**`,
  lockfiles, `.gitmodules`, symlinks or gitlinks, or when target workflows use
  unpinned `uses:` references. Repositories whose protection uses legacy
  unpinned status contexts or ruleset entries without an app pin must pin the app,
  and must SHA-pin workflow and action references, before `remote-checks` can pass.

### Changed

- Init now declares `.empirical/** -text` in `.gitattributes` to preserve
  digest-bound journal bytes across Git checkouts. Existing project-specific
  Empirical attribute rules are preserved.
- Lock waiters renew their wait budget as ownership changes, while retaining a
  bounded overall wait, so healthy contention does not report a stuck repository.

- Existing configurations now discover local environment files by default
  without being rewritten, so worktree proposals and their approval tokens change
  when ignored environment files exist; pass the proposal's `localFiles`
  unchanged to `empirical_worktree_create`. Set `discover: false` to opt out.
- Worktrees created outside Empirical can now receive local files through
  prepare, and generated agent guidance routes local file provisioning through
  the Empirical proposal and prepare operation.

- Deliver accepts the full-CI receipt Integrate recorded for an identical
  candidate instead of requiring a second local full-CI run; `reuseReceiptId` and
  Publish keep exact revision matching. The delivered source pull request head is
  bound to the proven commit before review, ready or merge.
- A failed Fast completion now blocks the same Fast feature with `retry` and
  explicit `promote` as recovery paths instead of promoting it to Complex, and
  `promote` accepts that block.
- An explicit Fast request is no longer promoted by integration or delivery
  wording; sensitive, migration and publication signals still promote it.
- Integrate, Deliver and Publish refuse Fast features with `PROMOTION_REQUIRED`
  guidance; only explicit `empirical_promote` changes a Fast feature to Complex.
- `receiptIds` is optional on `empirical_integrate` and `empirical_deliver`.
- Generated skills and phase instructions explain lane choice, Fast iteration,
  explicit promotion, the phrase-to-profile mapping, one-request test
  authorization, carry-over and remote-checks, and no longer state that
  consolidation authorizes tests.

- Fast action packets no longer list every living capability specification;
  agents open a capability only when the change touches it. Complex and
  promoted features keep the full list.
- Verification commands can opt into `testFiles: "changed"` to run only the
  test files matching changed files, failing with `NO_CHANGED_TESTS` rather than
  falling back to the whole suite.
- Independent integration validation no longer re-runs verification commands
  whose declared checks a full-CI command in the same directory already covers,
  unless the feature changes the policy or package scripts, and reports which
  commands executed or were covered.

### Fixed

- Windows worktree creation and recovery recognize canonical directory identity
  across separator, case and short-path spellings. Recovery errors identify the
  mismatched check and explain when a newer runtime is needed to load the base.
- Invalid mockup approval feedback now shows the approval document shape, even
  during Verify, instead of the fidelity-report shape.

- `empirical update` and `empirical uninstall` work on Windows again. Node refuses
  to spawn `.cmd` wrappers without a shell (CVE-2024-27980), so npm and the
  PATH-visible CLI now run through `cmd.exe` by quoted absolute path and the
  npm-installed CLI runs through Node, including prefixes containing spaces (SDD-66).

### Migration

- Update the package and installed global skills with `empirical update`, restart
  the coding agent/MCP host, invoke `empirical-init` in each existing repository
  to refresh managed instructions and local skills, then reload affected sessions.
- Existing configurations discover ignored, untracked `.env` and `.env.*` files
  by default. Review the paths in worktree proposals; set
  `isolation.localFiles.discover` to `false` to retain explicit-only copying.
  Existing `isolation.copyFiles` entries remain required. Use worktree prepare
  to provision worktrees created by another tool without overwriting files.
- Fast failures now stay Fast. Retry or explicitly promote the same feature
  when stronger verification or integration is needed. To iterate on an existing
  Complex implementation, request iterative development and explicitly request
  final verification when ready; iteration alone does not authorize tests.
- `promotion.fullCi` remains `local` by default. Opt into `remote-checks` only
  after configuring app-pinned required checks and SHA-pinned workflow/action
  references. Upgrade every participating agent before adding this policy field;
  older versions reject it. Publication still requires local proof.
- When refreshing an existing repository, review and commit the `.gitattributes`
  journal rule added by Init. An existing rule for `.empirical` is left untouched;
  ensure it preserves journal bytes across worktrees. Keep existing journal and
  receipt files intact.
- Schema 5 and existing specifications, journals, tracker bindings and receipts
  are retained. Do not delete workflow state to upgrade.

## [0.34.0] - 2026-09-14

### Added

- Added opt-in iterative Complex development, same-feature adjustments and
  explicit contract revisions, followed by user-requested consolidation and QA.
- Added approved `isolation.copyFiles` preparation for ignored local environment
  files in new worktrees, with independent copies and interrupted-copy recovery.
- Added Plane Cloud and self-hosted Plane as first-class external tracker
  providers, including project/state discovery, host-only Personal Access Token
  authentication, work-item binding and reconciliation, state synchronization,
  and idempotent milestone comments through current `work-items` endpoints.
- Added explicit repository activation as the default. Init offers individual
  invocation or team-approved automatic routing, with safe opt-out that
  preserves other instructions and workflow history.
- Added a read-only overview of preserved specs, worktree ownership and progress,
  with individual diagnostics for malformed records.
- Added exact-revision Fast-to-Complex promotion and explicit transfer of an
  unfinished spec between registered worktrees with matching history.
- Added a host-native sub-agent bridge for bounded consult, specification and
  implementation assignments, with shared reservations, launch reconciliation
  and confirmed cancellation. Writable workers use separate worktrees and specs.

### Fixed

- Doctor accepts direct instruction aliases such as `AGENTS.md -> CLAUDE.md`
  when the canonical target is a regular sibling file. Repair preserves the
  symlink, validates the target content, and keeps it from becoming dangling
  when automatic routing is disabled. Unsafe links remain rejected.

### Changed

- Assisted Fast and Complex iteration runs tests on demand, scoped to the active
  feature. Unrun verification stays pending, full CI is excluded from ordinary
  feature-check candidates, and final promotion/release gates remain enforced.
- Treat absent legacy activation choices as explicit; refresh project skills
  with `empirical-init` and restart the agent session after upgrading.
- Explicit Fast supports scoped ordinary behavioral and UI features without
  mandatory tests, formal review or Context and reports implemented with
  verification skipped. Explicit Complex and sensitive safety floors retain
  their full workflow; historical completion records remain readable unchanged.
- Independent specs use narrower operation locks and addressed capability-claim
  validation so unrelated delayed work or malformed claims do not block progress.
- Approved worktree creation starts from its committed base while preserving
  uncommitted source edits, and remains retryable after interruption.
- Generated agent guidance explains native delegation, preserved specs,
  ownership transfer and the distinct Fast and Complex completion guarantees.

### Migration

- Update the package and installed global skills with `empirical update`, then
  restart the coding agent/MCP host so the new Init skill and tools are loaded.
- Invoke `empirical-init` explicitly in each existing repository to refresh
  managed instructions and local skills. A missing `activationMode` now means
  explicit invocation. Choose **Automatically for this team** during repair only
  when the affected team agrees; an existing saved choice is preserved.
- Reload or start a fresh affected agent session after repository repair to
  discard cached routing instructions. In explicit mode invoke the local
  `empirical` skill for chosen tasks; ordinary requests remain outside it.
- New Fast work finishes at implemented with verification skipped. Choose
  Complex or explicitly promote the same feature when stronger assurance is
  needed. Previously verified Fast history retains its recorded evidence.
- Existing tracker configurations remain unchanged. Choose Plane explicitly
  during setup to adopt it; self-hosted Plane needs the exact API origin in the
  host-controlled `EMPIRICAL_PLANE_ALLOWED_ORIGINS` allowlist before authentication.
- Schema 5, specifications, tracker bindings and evidence are retained. Do not
  delete inactive specs or replace instruction symlinks to upgrade. Safe direct
  aliases such as `AGENTS.md -> CLAUDE.md` are preserved during repair.

## [0.33.0] - 2026-09-09

### Added

- Added a saved **Create mockups before coding?** Yes/No preference to init and
  configuration, exposed as `mockupsBeforeCoding` through MCP. Existing
  repositories retain enabled behavior until explicitly changed. Disabling it
  skips mandatory UI mockups while retaining fidelity checks for approved designs.
- Added a terminal-only fresh-repository demo with recorded CLI, MCP, worktree,
  verification, review, and integration scenarios.

### Changed

- Setup shows proposed defaults for new repositories and actual saved values
  for existing repositories, with one applicable menu and explicit Save.
- Init prefers permitted host-native selection controls and uses one text
  prompt when they are unavailable, without duplicating the same question.
- Linear MCP discovery resolves actual host tools by provider and capability,
  including lazy-loaded tools, and distinguishes configuration, tool exposure,
  authentication, permissions, and transient failures before offering recovery.

### Fixed

- Fixed initialization rejecting valid Linear MCP policies after discovery and
  preview by routing them through the existing credential-free MCP setup path.
- Prevented missing tool-name prefixes or unavailable future write operations
  from triggering an automatic Linear API-key fallback.
- Preserved an explicit mockup preference through repeated initialization and
  unrelated configuration updates, while rejecting invalid values before writes.
- Limited product test discovery to `tests/` so generated demo repositories do
  not accidentally enter the product suite.

### Migration

No migration required.

## [0.32.0] - 2026-09-08

### Added

- Added a six-step initialization wizard covering Setup, Preferences, Review
  bot, Tracking, Confirm, and Apply, with Back/Edit navigation, retained
  choices, and explicit Save before setup changes.
- Added clickable app and feature mockup previews through `empirical mockups`,
  human approval before UI contracts freeze, and fidelity checks against the
  approved design during verification.
- Added explicit reuse of exact-revision QA receipts after validating source,
  specification, policy, command, runtime, executable, and artifact identities.
- Added bounded verification progress and a repeatable benchmark for measuring
  final verification without treating diagnostics as promotion evidence.
- Added explicit selection of existing specs and recoverable approved worktree
  handoffs, including retries after interrupted Git creation or feature setup.

### Changed

- Capability claims are now non-exclusive: specs in separate worktrees can
  progress on the same capability while integration retains semantic conflict
  detection against each spec's recorded base.
- Git worktrees now use their own selected feature instead of automatically
  inheriting unfinished spec histories. Multiple unclaimed specs may remain
  inactive without blocking unrelated new work.
- Reviewer-bot setup is optional, includes an explicit disable choice, and
  preserves saved fresh-context review without repeated credential prompts.
- Linear tracking prefers authenticated sibling MCP tools, including upgrade
  recovery from legacy API-key configuration, and derives ticket content from
  the specification while storing recovery identities in attachment metadata.

### Fixed

- Prevented unrelated malformed or blocked feature histories and sibling
  checkout metadata from blocking normal work in another Git checkout.
- Preserved strict tracker recovery obligations and checkout ownership across
  terminal transitions, interrupted handoffs, and explicit feature selection.
- Bound reused verification evidence to the selected executable and runtime
  permission metadata so changed execution conditions cannot reuse stale proof.
- Rejected blank mockup approvals and ambiguous fidelity fields, and preserved
  path containment and explicit human design decisions.
- Preserved user-authored tracker content while validating bounded MCP recovery
  results and avoiding repeated provider mutations after ambiguous responses.

### Migration

After upgrading, run `empirical update` to refresh installed bootstrap guidance
and invoke `empirical-init` in existing repositories to refresh managed local
workflow instructions while retaining saved settings. Schema 5 remains in use;
no manual data conversion is required.

A Git checkout without a selected feature now remains idle. To resume an existing
spec, explicitly select its feature through `empirical_select`; unclaimed specs
are retained. UI changes must record the mockup approval and fidelity artifacts
requested by the workflow. Verification receipts without matching current runtime
and executable identities must be rerun rather than reused.

## [0.31.0] - 2026-09-04

### Added

- Added authenticated Linear MCP tracker transport that reuses the host's
  existing OAuth connection without copying credentials, with durable
  discovery, preview, prepare, reconciliation, and exactly-once acceptance.
- Added a conditional design-language knowledge page for repositories with a
  product interface, supporting explicit import, repository-derived proposals,
  and human-confirmed elicitation while excluding documentation-only surfaces.

### Changed

- Projected the shipped specialist-consult protocol into living capability and
  workflow-routing specifications so required, bounded advisories remain
  reviewable and protected from specification drift.

### Fixed

- Kept Linear OAuth timeout handling live on Windows and isolated its complete
  test suite from the Bun coverage instrumentation hang while retaining
  aggregate coverage enforcement.
- Hardened Linear MCP bridge persistence against symlink escapes and serialized
  intent acceptance so concurrent submissions cannot both advance one durable
  operation.

### Migration

No migration required.

## [0.30.0] - 2026-09-01

### Added

- Added a zero-build, responsive project wiki with practical onboarding,
  architecture and workflow guidance, searchable task-oriented navigation,
  accessible Agentum motion, strict content security, reduced-motion support,
  and meaningful no-JavaScript fallbacks.
- Added exact GitHub Copilot MCP configuration management that preserves
  unrelated servers and user-owned collisions while installing and removing
  only Empirical's managed stdio bridge.
- Added in-memory OAuth for Linear's official remote MCP endpoint through the
  standalone `empirical mcp` bridge, using dynamic client registration, PKCE,
  a state-bound ephemeral loopback callback, URL-mode elicitation, bounded
  remote operations, sanitized failures, and complete session cleanup.

### Changed

- Replaced the long-form README with a concise project introduction derived
  from the wiki while retaining strict tracker recovery guidance and keeping
  obsolete public integration examples out of generated onboarding.
- Generated initialization guidance now recommends an OAuth-capable Empirical
  host when the current skill-only host cannot perform the browser handoff,
  while retaining the secure host-only secret-file fallback.

### Fixed

- Linear discovery, lifecycle suggestion, and preview now accept any finite
  workflow-state position, including the negative floating-point ordering
  values Linear legitimately assigns to backlog states.
- Fixed standalone Linear OAuth lifecycle behavior so cancellation, timeout,
  callback races, invalid responses, and transport shutdown remain bounded and
  cannot leak credentials or leave callback listeners running.

### Migration

No migration required.

## [0.29.0] - 2026-08-28

### Added

- Added a disabled-by-default, protected-environment emergency release path with
  exact administrator, incident, PR, merge, version, integrity, check, expiry,
  and audit receipts while preserving ordinary exact protected-merge gates.
- Added public CLI help and README guidance explaining how Empirical routes and
  advances work, where durable evidence lives, and how to use one consolidated
  development setup command block.
- Added configurable pull-request review with a recommended independently
  authenticated GitHub bot and an explicit fresh-context fallback, one
  canonical criterion-complete review body, exact base/head diff binding, and
  guided name-only credential setup.
- Added a guarded, idempotent `develop` to `main` release pipeline that binds
  exact protected PR merge provenance and clean release checks to one
  changelog-backed Git tag, non-draft GitHub Release, and npm trusted
  publication with provenance.
- Added deterministic patch, minor, migration, conflict, partial-effect,
  lost-response, duplicate, and retry fixtures plus an offline release dry run.
- Added a checked repository release-request shorthand and canonical playbook so
  `make a new release` prepares every current `develop` change, verifies the
  candidate, and creates or resumes the two guarded PR stages without granting
  merge or direct publication authority.
- Added opt-in Tracker Policy v2 `strict` enforcement so deterministically
  required work hard-stops before further source or workflow mutation until its
  exact current revision is bound and synchronized.
- Added structured tracker mutation gates, exact feature-addressed terminal
  synchronization, and crash recovery that refuses new work while strict final
  tracking remains unresolved.
- Added criterion-complete risk-based QA matrices, anomaly-visible immutable
  receipts, fresh-context and clean packaged-consumer acceptance, deterministic
  failure-path coverage, and exact full-CI promotion gates.

### Changed

- Ordinary release publication now supports solo-owned repositories without a
  mandatory positive review while retaining `CHANGES_REQUESTED` blocking,
  protected two-parent merge proof, complete CI and Release Gate, immutable
  conflict refusal, protected npm environment, and trusted OIDC provenance.
- Made `develop` the ordinary feature/fix and source-evidence integration base;
  protected `main` now accepts only the validated release PR from `develop`.
- Superseded the human-created GitHub Release boundary with exact merged-PR
  authorization while preserving branch protection, immutable conflicts,
  least-privilege GitHub/OIDC jobs, and token-free npm publication.
- Generated agent guidance now treats a blocked strict tracker gate as a hard
  stop with OAuth/host-file, binding, reconciliation, or sync recovery, while
  best-effort, optional, off, and Tracker Policy v1 behavior remain compatible.
- Approved worktree creation now resumes its returned action immediately,
  including across a required host restart, without requesting a second
  confirmation.

### Fixed

- Normalized GitHub's null and empty post-merge `reviewDecision` forms before
  complete review-history reduction so later reconciliation matches the earlier
  solo-owner authorization while effective change requests still block.
- Made mutually exclusive ordinary/emergency authorizers use explicit
  predecessor-success conditions so an intentionally skipped sibling cannot
  transitively skip GitHub, npm, provenance, or verification jobs.
- Made immutable tag reconciliation create an annotated tag object and exact
  tag ref through authenticated GitHub APIs instead of Git transport, while
  retaining observation-led lost-response recovery and conflict refusal.
- Made Release Gate authentication available only to its exact read-only
  candidate preflight while preserving `contents: read` and rejecting GitHub,
  npm, tag, release, push, publish, and dist-tag mutation authority.
- Made protected delivery keep request-changes PRs draft, refuse draft or stale
  merges, stop after two automatic repair rounds, and accept a valid non-author
  latest approval when GitHub leaves aggregate `reviewDecision` empty.
- Made guarded tracker host files decode supported single- and double-quoted
  dotenv values across LF and CRLF while rejecting malformed or control-bearing
  assignments before provider access.

### Migration

No migration required.

## [0.28.0] - 2026-08-24

### Added

- Added a deterministic specialist-consult protocol with bounded security and
  UI/UX packets, structured advisory evidence, and domain-scoped blocking
  without standing roles or persisted model reasoning.
- Added structured repository-activation inspection and Doctor findings for
  missing, stale, malformed, unsafe, non-canonical, nested-shadowing, and
  same-name global skill states, with exact per-runtime verification and reload
  guidance.
- Added the native Windsurf workspace skill, nested-directory resolution, root
  Codex override reconciliation, and linked-worktree isolation coverage.

### Fixed

- Front-loaded mutation trigger metadata and marker-owned instructions so
  bounded host context cannot omit Empirical behind large user content, while
  preserving user-owned bytes and keeping read-only work outside the workflow.
- Stopped treating current integration files as proof that an already-running
  agent loaded them; reports now keep runtime loading explicitly unverified.

### Migration

- Existing Schema 5 and Tracker Policy v1/v2 repositories require no state
  migration. Run Empirical Init once in existing repositories to reconcile the
  expanded activation artifacts, then follow Doctor's runtime reload guidance.

## [0.27.0] - 2026-08-21

### Changed

- Made Tracker Policy v2 lifecycle comments human-first across GitHub, Linear,
  and Jira, with plain-language status, focused action requests, friendly
  evidence links, native Jira formatting, and provider-safe exact recovery
  markers that remain compatible with existing comments.

### Migration

- Existing Schema 5 and Tracker Policy v1/v2 repositories require no state
  migration. Visibility cadence, ticket bindings, issue descriptions, and
  historical comments remain compatible.

## [0.26.1] - 2026-08-21

### Fixed

- Made `empirical update` invoke and verify the CLI installed under npm's actual
  global prefix, then fail with actionable diagnostics when an older Empirical
  installation still shadows it through `PATH`.
- Bounded Linear team discovery pages so the nested project and workflow-state
  connections stay below Linear's GraphQL query-complexity limit.

## [0.26.0] - 2026-08-20

### Added

- Added selectable `concise` or `detailed` interaction questions across project
  configuration, CLI, MCP, action packets, status rendering, and generated
  agent guidance. New recommended setup is concise; existing missing fields
  remain detailed.
- Added strict optional Tracker Policy v2 ticket-rule matrices, including the
  `features+large-fixes` preset and resolved change-type/requirement status.
- Added a packaged provider-independent no-ticket feature demo that proves one
  guarded create, one durable binding, and zero live-network calls.

### Changed

- Optional ticket work with no explicit reference now remains local before
  authentication or provider access and no longer causes a redundant ticket
  question; required work retains attach, marker reconciliation, and
  exactly-once guarded creation.

### Migration

- Existing Schema 5 and Tracker Policy v1/v2 repositories require no state
  migration. Repositories without an explicit question mode retain detailed
  questions until configured otherwise; new setup recommends concise mode.

## [0.25.0] - 2026-08-19

### Added

- Added a trusted-host OAuth resolver contract for Linear, GitHub, and Jira,
  with provider tokens kept ephemeral and outside Tracker Policy, MCP tool
  input/output, chat, logs, and repository state.
- Added explicit MCP URL-mode capability negotiation for out-of-band OAuth;
  form-only, legacy-empty, absent, declined, and cancelled clients fail closed
  to the host fallback without receiving a credential form.
- Added a guarded read-only user secrets file fallback at
  `${XDG_CONFIG_HOME:-$HOME/.config}/empirical/secrets.env` on POSIX or
  `%APPDATA%\Empirical\secrets.env` on Windows, including containment, link,
  size, syntax, completeness, and POSIX permission checks.

### Changed

- Made new Linear setup default to `LINEAR_SECRET_KEY`, while preserving every
  existing Tracker Policy v1/v2 name—including `LINEAR_API_KEY` and custom
  valid names—without migration or repair rewrites.
- Made Jira OAuth use Atlassian's Cloud API base with Bearer authorization while
  retaining tenant-origin Basic authentication for email/API-token fallback.
- Made Linear OAuth use its required Bearer authorization while preserving the
  raw `Authorization` value required by existing personal API-key fallbacks.
- Aligned CLI, MCP, generated `empirical-init` guidance, Doctor, README, and
  protocol/security documentation around OAuth-first setup, the exact host
  fallback path, and the rule: `Never paste credentials into chat`.

### Fixed

- Made tracker secret-file path construction honor explicit POSIX and Windows
  semantics, with platform-correct permission fixtures and recovery-path tests.
- Serialized the process-heavy release test suite so temporary Git worktree
  tests cannot exhaust their timeout and race cleanup under parallel load, and
  removed a redundant non-coverage pass from local CI to match the GitHub gate.

## [0.24.1] - 2026-08-19

### Fixed

- Made first-run Init and repairs with no prior tracker decision require an
  explicit choice between the recommended `Track all work` flow and `No
  tracking` before setup can be saved.
- Persisted `No tracking` as a strict provider-free setup record so later
  repairs preserve the confirmed choice without provider or ticket requests.
- Bounded release-test file parallelism so process-heavy CLI coverage remains
  deterministic on high-core hosts while retaining per-test hang detection.

## [0.24.0] - 2026-08-18

### Added

- Added guided Linear, GitHub Projects, and Jira discovery/preview during Init,
  provider-neutral semantic state suggestions, and strict equivalent MCP and
  non-interactive setup surfaces.
- Added Tracker Policy v2 ticket behavior (`off`, `manual`, `ensure`), progress
  visibility, automatic one-ticket reconciliation, idempotent milestone
  comments, and receipt-approved evidence uploads or commit-pinned links.
- Added a packaged, runnable integration-repair demo that reproduces a
  completed repository with missing activation artifacts and proves the
  before, repair, and verified-after states without touching user data.

### Changed

- Tracker synchronization now commits local state first, preserves user-authored
  Linear descriptions, and resumes transition/comment/artifact effects from a
  durable acknowledgement ledger.
- Existing Tracker Policy v1 repositories remain manual/legacy compatible and
  repair preserves tracker bytes unless explicitly changed or disabled.
- Simplified the README around installation, everyday use, safety, and links to
  the detailed project documentation.

### Fixed

- Made Doctor validate both behavioral and non-behavioral integration receipts
  without falsely treating a valid null capability claim as corruption.
- Made the shell-free GitHub delivery and publication runner reuse the host's
  existing `gh` configuration locator without persisting credentials or secret
  values in policy or runtime receipts.
- Made sanitized HTTPS pushes use the host's authenticated `gh` store through
  an ephemeral, push-only Git helper configuration without inheriting `HOME`,
  exporting tokens, or changing persistent Git configuration.
- Made Doctor report missing, drifted, or unsafe required project integrations
  whenever Schema 5 setup is complete, instead of incorrectly reporting the
  repository as activation-ready.
- Kept Doctor read-only and made its remediation point to explicit
  `empirical-init`; repair recreates missing artifacts and updates
  Empirical-owned content while preserving unmanaged conflicts for manual
  resolution.
- Completed the lower stem of the terminal brand mark so its outline renders as
  a closed cross.

## [0.23.0] - 2026-08-11

Published through GitHub Actions trusted publishing with npm provenance.

### Changed

- Replaced the globally automatic `empirical` skill with the explicit,
  setup-only `empirical-init` bootstrap.
- Made initialized repositories route ordinary change prompts automatically
  through marker-owned local instructions and skills; read-only prompts remain
  outside the workflow.
- Added explicit-only invocation metadata where supported and retained all
  existing workflow, evidence, tracker, integration, and publication gates.

### Added

- Added this changelog and a documented alpha Semantic Versioning and release
  policy.

### Migration

- After upgrading from `0.22.x`, invoke `empirical-init` once in each existing
  repository to install local automatic activation. Repair preserves Schema 5
  configuration, context, feature history, and evidence unless setup values are
  explicitly changed.

## [0.22.0] - 2026-08-03

### Added

- Introduced the Schema 5 protocol, strict Policy v2 evidence, resumable
  journals, capability claims, independent integration, protected delivery,
  explicit publication, and a single consolidated global workflow skill.

## [0.20.4] - 2026-07-31

### Fixed

- Completed the `0.20.4` release and its recorded release evidence.

## [0.20.3] - 2026-07-31

### Fixed

- Made CI and release fixtures portable across supported operating systems,
  including Windows executable-extension casing.

### Changed

- Simplified installation guidance and clarified README commands.

## [0.20.2] - 2026-07-30

### Changed

- Prepared and released package version `0.20.2`.

[Unreleased]: https://registry.npmjs.org/empirical-sdd
[0.42.0]: https://registry.npmjs.org/empirical-sdd/-/empirical-sdd-0.42.0.tgz
[0.41.0]: https://registry.npmjs.org/empirical-sdd/-/empirical-sdd-0.41.0.tgz
[0.40.0]: https://registry.npmjs.org/empirical-sdd/-/empirical-sdd-0.40.0.tgz
[0.39.0]: https://registry.npmjs.org/empirical-sdd/-/empirical-sdd-0.39.0.tgz
[0.38.0]: https://registry.npmjs.org/empirical-sdd/-/empirical-sdd-0.38.0.tgz
[0.37.0]: https://registry.npmjs.org/empirical-sdd/-/empirical-sdd-0.37.0.tgz
[0.36.0]: https://registry.npmjs.org/empirical-sdd/-/empirical-sdd-0.36.0.tgz
[0.35.0]: https://registry.npmjs.org/empirical-sdd/-/empirical-sdd-0.35.0.tgz
[0.34.0]: https://registry.npmjs.org/empirical-sdd/-/empirical-sdd-0.34.0.tgz
[0.33.0]: https://registry.npmjs.org/empirical-sdd/-/empirical-sdd-0.33.0.tgz
[0.32.0]: https://registry.npmjs.org/empirical-sdd/-/empirical-sdd-0.32.0.tgz
[0.31.0]: https://registry.npmjs.org/empirical-sdd/-/empirical-sdd-0.31.0.tgz
[0.30.0]: https://registry.npmjs.org/empirical-sdd/-/empirical-sdd-0.30.0.tgz
[0.29.0]: https://registry.npmjs.org/empirical-sdd/-/empirical-sdd-0.29.0.tgz
[0.28.0]: https://registry.npmjs.org/empirical-sdd/-/empirical-sdd-0.28.0.tgz
[0.27.0]: https://registry.npmjs.org/empirical-sdd/-/empirical-sdd-0.27.0.tgz
[0.26.1]: https://registry.npmjs.org/empirical-sdd/-/empirical-sdd-0.26.1.tgz
[0.26.0]: https://registry.npmjs.org/empirical-sdd/-/empirical-sdd-0.26.0.tgz
[0.25.0]: https://registry.npmjs.org/empirical-sdd/-/empirical-sdd-0.25.0.tgz
[0.24.1]: https://registry.npmjs.org/empirical-sdd/-/empirical-sdd-0.24.1.tgz
[0.24.0]: https://registry.npmjs.org/empirical-sdd/-/empirical-sdd-0.24.0.tgz
[0.23.0]: https://registry.npmjs.org/empirical-sdd/-/empirical-sdd-0.23.0.tgz
[0.22.0]: https://registry.npmjs.org/empirical-sdd/-/empirical-sdd-0.22.0.tgz
[0.20.4]: https://registry.npmjs.org/empirical-sdd/-/empirical-sdd-0.20.4.tgz
[0.20.3]: https://registry.npmjs.org/empirical-sdd/-/empirical-sdd-0.20.3.tgz
[0.20.2]: https://registry.npmjs.org/empirical-sdd/-/empirical-sdd-0.20.2.tgz
