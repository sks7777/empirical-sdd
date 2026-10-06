# Security model

Empirical treats requests, repository content, specs, decisions, evidence,
receipts, Git metadata, policies, CLI/MCP inputs, and remote observations as
untrusted.

- Strict schemas reject unknown fields at protocol boundaries. Feature,
  capability, command, branch, and artifact identifiers use portable
  allowlists; repository paths cannot be absolute or traverse upward.
- Atomic writers preserve modes and refuse managed symbolic-link paths.
  Ownership-aware locks cannot remove a newer caller's lock.
- Policy commands run as exact argument arrays without a shell. Output, timeout,
  and working directory are bounded. Shell launchers and control syntax are
  rejected.
- Emergency release authorization is disabled by default, explicit rather than
  inferred, bounded to one administrator/incident/PR/merge/version/integrity and
  30-minute receipt, gated by the protected npm environment, and denied for the
  historical v0.29.0 failure. It grants no force, deletion, replacement, token,
  merge, or manual publication authority.
- Evidence consists of immutable, canonical-digest receipts. Executed receipts
  retain command/result/source provenance; collected receipts fingerprint
  repository-contained artifacts. QA receipts additionally retain matrix,
  workflow/Git revision, platform, duration, cleanliness, artifacts, every
  attempt, and anomalies. Under the default `standard` binding, freshness
  follows content: a receipt, approval or review stays valid while the tree
  it covered, excluding generated Empirical records, and the authored inputs
  (spec, policy, decisions) are unchanged. The recorded Git revision is kept
  for the audit trail but no longer compared. `strict` binding compares the
  exact commit and revision too. Failed retries, skips, unsupported or missing
  environments, cancellation, and timeouts cannot be rewritten as green.
  Caller assertions are not evidence.
- Capability ownership is shared through the Git common directory. Integration
  verifies base digests, detects claim conflicts, overlays committed feature
  differences from the merge base plus bounded working changes, rejects target
  divergence, validates in an independent worktree, rolls back candidate
  projections, and never force-writes Git.
- Worktree and agent-handoff proposals are read-only and integrity-bound.
  Creation or host execution requires literal approval of an unchanged exact
  path/branch/argv proposal.
- Local environment file provisioning copies only files Git reports as ignored
  and untracked in the source and that are ignored and untracked at the
  destination. Discovery filters Git's listing with bounded patterns that cannot
  name absolute or traversing paths and always excludes `node_modules`, `.git`
  and `.empirical` segments. Every path is shown in the proposal or prepare
  preview before copying; approval or the prepare token bounds the copy set, and
  a forged token can only narrow what repository configuration selects. Copies
  are independent regular files created exclusively, never overwrite existing
  files, use owner-only `0600` permissions on POSIX (Windows copies inherit
  directory ACLs), and reject symbolic links, symbolic-link ancestors and
  non-regular files. Discovery is bounded to 200 candidates and 1 MiB per
  discovered file, with refusals reported by path and reason. Proposals, previews,
  results, errors, intents, journals, receipts and tracker payloads carry paths
  only; crash markers are empty files keyed by hashed target and path identity,
  never contents.
- The context inventory counts tracked files only and excludes build,
  dependency, secret-like, binary, and history paths. Review records store Git
  blob ids and paths, never contents. It stores fingerprints, not a
  remote semantic index. Stale generated pages are not silently retrieved.
- Doctor warns with `HOST_CONFIG_CREDENTIAL` when a Git-tracked host MCP
  config (`.codex/config.toml`, `.mcp.json`, `.cursor/mcp.json`,
  `.gemini/settings.json`) holds a credential-shaped value. It flags a literal
  `bearer_token`, an `Authorization` or `*token`/`*key`/`*secret` header or env
  entry, a `Bearer` value, or a known token prefix. Variable references
  (`${NAME}`, `$NAME`, `env:NAME`), `*_env_var` keys and `env_http_headers` are
  never flagged. The warning names only the path and key path, never the value,
  a prefix of it or its length; token-shaped key names are redacted too. It
  reads only tracked regular files up to 1 MiB, changes nothing, and has no
  automatic fix. Credentials embedded in URLs (`user:pass@`) and `password` or
  `api_key` keys are also flagged; secrets in unusual keys can still be missed. Move the secret to `bearer_token_env_var` or
  `env_http_headers` (Codex), an environment reference, or OAuth, and rotate it
  if it was ever committed.
- The Codex bridge in `.codex/config.toml` is judged by its meaning:
  `mcp_servers.empirical` with `command = "empirical"` and `args = ["mcp"]`.
  Codex drops comments when it rewrites the file, so Empirical's markers are
  optional. Repair never rewrites a user-authored table and leaves invalid TOML
  untouched.
- Tracker Policy v1/v2 stores only provider target IDs, normalized status IDs,
  behavior/visibility choices, and credential environment-variable names
  matching `^(?=.{2,64}$)[A-Z][A-Z0-9]*_[A-Z0-9_]+$`. Runtime authentication
  is selected outside policy in strict order: a trusted host OAuth resolver, a
  complete injected environment set, then a permission-checked host secrets
  file. OAuth registration, callbacks, refresh, revocation, and encrypted token
  custody remain host responsibilities. Resolver failures are replaced with
  stable diagnostics, returned credential shapes are strictly validated, and
  ephemeral values are added to transport redaction without serialization.
- Tracker Policy v2 enforcement is local, secret-free authority. Best-effort is
  compatible; opt-in strict gates only deterministically required work. A
  blocked gate is derived from validated local binding, revision, policy digest,
  and effect acknowledgements—not provider prose—and core mutation APIs enforce
  it independently of agent prompts. Missing authentication exposes only safe
  variable names/host-file recovery. Exact terminal feature sync and bounded
  new-start preflight prevent a crash from hiding an unresolved final state.
- An OAuth handoff is a secret-free HTTPS URL, bounded opaque elicitation ID,
  provider, and short message. MCP sends it only when the connected client
  explicitly declares `elicitation.url`. Form-only, legacy-empty, absent, or
  failed elicitation support receives no request and falls back out of band.
  Form schemas, tool arguments/results, assistant text, and chat are never
  credential channels.
- Standalone Linear OAuth pins `https://mcp.linear.app/mcp`, uses SDK DCR/PKCE,
  binds an ephemeral callback to `127.0.0.1`, validates exact path and random
  state, bounds the returned code and wait, and closes pending clients/listeners
  on success, decline, cancellation, error, or timeout. Registration, verifier,
  code, and tokens remain in memory and never reuse another client's token
  store.
- The fallback file is
  `${XDG_CONFIG_HOME:-$HOME/.config}/empirical/secrets.env` on POSIX or
  `%APPDATA%\Empirical\secrets.env` on Windows. Empirical never creates it or
  mutates `process.env`. The reader rejects final symbolic links, non-regular
  files, repository-contained paths (including resolved aliases), files over
  64 KiB, malformed or duplicate assignments, partial provider identities, and
  group/world POSIX permission bits. Explicit test environments do not trigger
  implicit reads of a developer's home file.
- GitHub and Linear OAuth tokens use Bearer authorization at their fixed API
  endpoints; Linear personal API-key fallback retains its required raw
  `Authorization` value. Jira OAuth requires a validated Cloud ID and
  Bearer authorization at
  `https://api.atlassian.com/ex/jira/{cloudId}`; Jira email/API-token fallback
  retains Basic authorization against the configured tenant origin. Provider
  requests use fixed HTTPS boundaries, bounded timeouts and responses, complete
  bounded pagination, checksummed target-bound feature state, stable create
  markers, and deterministic per-effect keys. Discovery catalogs are ephemeral
  and preview validates target access before persistence. Off/disabled branches
  occur before authentication resolution. A rule-backed optional ticket with
  no explicit reference also returns local-only before OAuth, environment/file
  lookup, or provider transport; this is covered with throwing doubles.
- Tracker evidence is selected only through receipt IDs already committed in
  local workflow state. Receipt and file digests, repository containment,
  regular-file/non-symlink identity, secret-like names, media allowlists, count,
  and byte ceilings are revalidated before provider access. Uploads use
  deterministic reconciliation names; durable repository links are commit
  pinned and emitted only when committed bytes match. No artifact bytes enter
  pending state. Diagnostics are bounded and credential-redacted before return
  or persistence, including failures raised by an injected transport. Remote
  input is never allowed to mutate local workflow state or acceptance criteria.
- Reserved migration stage/marker/backup paths are transaction state rather
  than source. Pre-marker failure removes only its owned stage; evidence,
  knowledge, and integration overlays exclude scratch, while Doctor diagnoses
  orphans without deleting them.
- Global uninstall is confirmation-gated and derives every candidate from the
  pinned catalog under the validated user home. It removes only regular files
  carrying Empirical's managed marker and valid owner-stamped metadata, never
  follows symlinks, never searches repositories, and invokes exact npm package
  removal only after managed integration cleanup succeeds.
- Global installation exposes only the narrowly scoped `empirical-init` skill.
  Project activation validates completed Schema 5 configuration, ignores
  read-only prompts, never initializes implicitly, and changes instruction or
  skill files only through contained marker-owned writes that preserve
  unmatched markers and unmanaged collisions. Managed instruction blocks are
  kept first without changing user-owned bytes, and inspection is bounded to
  the selected checkout, invocation ancestry, known settings, and injected or
  host user-skill roots. Writes never follow or replace symlinks. Instruction
  inspection may read the separately validated regular target of a direct
  same-directory alias between canonical instruction filenames. It rejects
  arbitrary path expressions, external targets, link chains, loops and unsafe
  ancestors; this exception never applies to skills, MCP configuration or
  credentials. Removing a managed block retains an empty regular instruction
  target when an accepted alias depends on it. Inspection never claims that a
  running host reloaded repaired content.
- Doctor never repairs, deletes, prunes, launches, or writes. It names the
  separate `cleanup` and `feature-close` operations as remediation instead.
  Each finding's structured `fix` is data. `doctor-fix` applies only a
  previewed plan whose digest the user approved. It runs `safe` fixes (which
  regenerate Empirical-owned files) and `confirm` fixes under that approval,
  and runs a `decision` option only when the user chose it. It never touches
  journals, receipts, credentials or user-owned files; cleanup entries stay
  bound to their own cleanup plan digest.
- `reconcile` closes only features whose merge it proves with the same checks
  as `feature-close --outcome merged-externally`, only at Implement or later,
  and only after the user approves the previewed plan digest. It reads Git and
  the forge, never fetches, merges, pushes or writes a receipt, never closes a
  feature another live checkout selects or claims, and releases only this
  checkout's capability claims. Under the default `standard` binding the same
  proven closure also runs on its own when `next`, `select` or a new feature
  starts: merging the pull request is the user's decision, so no second
  approval is asked, and the closure records confirmation `merge-observed`.
  It needs an `origin` remote, keeps the feature's honest completion level,
  never closes a feature before Implement, and still refuses anything it
  cannot prove. `strict` binding keeps reconcile an explicit, approved step.
  A merge counts on the isolation base or the delivery target. For stacked
  pull requests, the proof is the pull request whose merge brought the
  specification onto the target; its merge commit's diff must touch that
  feature's specification. Doctor's `FEATURES_MERGED_NOT_CLOSED` fix runs the
  same proof after one approval.
- Forced closure and cleanup are recorded authorizations, not suppressions.
  `feature-close` ends a feature that cannot satisfy its next gate, or advances
  exactly one stage past it, against a required bounded public reason held to
  the same rule as a break-glass justification. It records no completion fact,
  writes no receipt, and never merges, pushes or publishes. Outcome
  `merged-externally` is observed, never asserted: it reads the pull request
  and requires a MERGED state with an exact merge commit that is an ancestor of
  the target branch, then records those facts; an unprovable merge is refused.
  Observed merge facts close a feature but never make it delivered, which
  stays defined by a digest-verified delivery receipt. A forced advance refuses to enter
  Integrate, Deliver, Publish or Archive, which only their own separately
  authorized operations enter, and refuses while a feature is paused for direct
  work. `cleanup` acts only on classes explicitly named and only on orphans the
  current read-only Doctor report already reported: expired lock leases, stale
  capability claims, prunable worktree registrations, orphan migration scratch
  with no transaction in flight, and resolved checkout recovery entries. It
  refuses live locks (a lock whose owning process is alive, even with an
  expired lease), invalid claims, recovery entries whose tracker record is still
  pending, and every path under a journal, receipt or contract-revision
  directory. Both operations preview the exact effect first.
  - **CLI:** they require an interactive terminal confirmation, which binds the
    apply to the displayed revision or plan digest. Unattended use must pass
    that value from the separately approved preview.
  - **MCP:** a host with form elicitation asks the user itself, recorded as
    `elicited`, and binds apply to the plan shown in that form. A host without
    elicitation accepts the agent's relay only with the revision or digest from
    the exact preview the user approved, recorded as `agent-relayed`.

  Standing and YOLO authorization never cover them. A cleanup approval is bound
  to the previewed plan's digest. A forced advance never skips Shape, Specify,
  Verify or Review. A terminal closure releases the feature's capability claim,
  and it never moves the tracker ticket to done unless the merge was observed.
- Review configuration persists only an uppercase reviewer-token environment
  name. The value is resolved at the exact call boundary, translated to
  `GH_TOKEN` only inside the reviewer child process, removed from recorded
  environment keys, and redacted exactly from captured output. One readiness
  check requires an authenticated repository-readable non-author login before
  bot review mutation. Fresh-context mode uses no second credential and makes
  no claim of forge-level independence.
- Delivery opens owned source and evidence PRs as drafts, reviews their exact
  remote base/head diffs, and refuses draft or stale-head merge. It accepts
  GitHub aggregate approval or effective latest non-author approval, preserving
  valid bot approval when aggregate `reviewDecision` is empty. It uses ordinary
  merges and declared checks, with no admin, protection-bypass, force-push,
  credential-discovery, or hidden cleanup path.
- Generic Empirical publication requires an exact explicit version, commit,
  tag, dist-tag, literal approval, and authorization bound to the complete
  request. The repository release pipeline recognizes only an exact,
  required-check-passing, same-repository `develop` to protected `main` merge
  with no effective `CHANGES_REQUESTED` review as its equivalent narrow
  authorization. It paginates the complete review history and fails closed on
  incomplete or malformed review evidence; ordinary pushes, forks, changed
  SHAs, other branch pairs, YOLO/delivery authority, and unbound dispatches fail
  before mutation.
- The release PR gate has read-only contents and no secrets/OIDC. The merged-PR
  orchestrator repeats exact PR, two-parent commit, product/package/pack,
  changelog/migration, clean CI, and remote checks. Its GitHub job has
  `contents: write` without OIDC. npm candidate/CI preflight and post-publish
  provenance verification are separate read-only jobs without OIDC. The
  intervening GitHub-hosted publish job has only read-only contents plus
  `id-token: write`, the protected environment `npm`, an ignore-scripts install,
  and one tarball whose version/SRI must match the authorization output before
  the literal npm publish lifecycle. Every checkout disables persisted
  credentials, release dependency caching is off, and no npm write token is
  accepted. npm trusted publishing binds the exact workflow filename/environment
  and supplies automatic public-package provenance.
- Git tag, GitHub Release, npm version/integrity/provenance, and `latest` are
  queried before and after effects, including after a failed/lost response.
  Only ordered identical prefixes can resume. Existing conflicts, gaps,
  incomplete observations, missing provenance, or a divergent dist-tag block
  without deletion, edit, force, replacement, rollback, or a token-based repair
  path. Reports contain bounded identities/status only, never provider tokens or
  unbounded bodies.
- YOLO changes question frequency, not authority. It never bypasses host
  permissions or branch protection, extracts credentials, infers publication,
  replaces immutable artifacts, or deletes real worktrees/branches.
- Decision files reject hidden-reasoning, prompt-transcript, credential, and
  secret sections. Explain exposes deterministic state-machine rationale only.

Do not place secrets in requests, chat, Socratic answers, specifications,
decisions, evidence summaries, screenshots, tracker configuration, tool input,
tool output, commands, shell history, process arguments, or delivery inputs.
**Never paste credentials into chat.** Tracker credential fields contain
environment-variable names, never values. New defaults are
`LINEAR_SECRET_KEY`, `GITHUB_TOKEN`, `PLANE_API_KEY`, and the Jira pair `JIRA_EMAIL` plus
`JIRA_API_TOKEN`; review setup names `EMPIRICAL_REVIEWER_TOKEN`. Historical
or custom valid names remain supported.
`.empirical/` is committed project data; Git-common-dir claim records are local
coordination metadata.

Plane policies pin a credential-free public HTTPS API origin, workspace slug,
project ID, state map, and the `PLANE_API_KEY` environment-variable name. Plane
Personal Access Tokens are sent only as `X-API-Key` to that exact origin. URLs
with credentials, paths, query strings, fragments, loopback, private, or
link-local IP literals are rejected. The adapter uses bounded pagination and
current `work-items` endpoints; it never follows response-provided origins or
uses deprecated `issues` endpoints.
Plane Cloud is trusted directly. Before sending a credential to a self-hosted
origin, the host must list that exact validated origin in the non-secret
`EMPIRICAL_PLANE_ALLOWED_ORIGINS` comma-separated allowlist. Repository policy
cannot add to that allowlist.
