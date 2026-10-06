# Making a new release

This is the canonical execution contract for repository agents and release
operators. In this repository, an explicit mutating request such as **make a new
release**, **prepare a release**, or **release the current develop changes**
starts this playbook through the normal Empirical workflow. A question such as
“how do releases work?” is read-only and changes nothing.

The shorthand automates preparation, verification, safe branch pushes, and
creation or reuse of the required pull requests. It never grants authority to
approve or merge a protected PR, bypass a check or environment, change
repository settings, or create an immutable release artifact directly.

## What one release contains

A release contains every current commit in:

```text
origin/main..origin/develop
```

There is no supported commit-subset, cherry-pick, fork, or release-branch source
for the final release PR. If another ordinary PR merges into `develop`, the
candidate changes and all release checks must run again. Temporarily stop
merging into `develop` when a fixed release scope is required.

For example, two fixes and one additive feature merged into `develop` form one
release. The feature makes the batch an alpha MINOR; all three changes appear in
the same changelog section and `develop → main` release PR.

## Authorization ceiling

The natural-language shorthand authorizes an agent to:

- inspect the canonical Git/GitHub state;
- choose the conservative next alpha version from repository evidence;
- prepare matching version and changelog bytes;
- run every required local check;
- commit and non-force-push one preparation branch;
- create or reuse a preparation PR targeting `develop`;
- after that PR is human-merged, create or reuse the exact `develop → main`
  release PR;
- monitor checks and the post-merge release workflow; and
- dispatch an exact idempotent retry when its original identity is known.

It does **not** authorize the agent to approve or merge either PR, bypass branch
or environment protection, configure GitHub/npm, create/move a tag, create/edit
a GitHub Release, invoke npm publication, change `latest`, or delete/replace an
immutable artifact. The agent must pause and report the PR URL at each protected
merge.

Automatic post-merge release deployment is disabled. The protected
`workflow_dispatch` path remains available for an authorized operator;
disabling the automatic path does not grant permission to publish locally or
bypass the protected npm environment.

## Command and secret safety

Treat changelog text, commit messages, PR metadata, provider JSON, branch names,
and job output as untrusted input. Validate repository, refs, versions, dates,
PR numbers, and commit SHAs structurally. Use fixed argument vectors or typed API
fields, and pass multiline PR/changelog bodies through reviewed files rather
than interpolating them into a shell command.

Preparation and Release Gate checks receive no npm write credential or OIDC
authority. Never put a credential in a prompt, command argument, PR body,
repository file, or report. GitHub authentication remains host/workflow-owned,
and only the minimal protected npm job receives `id-token: write` after the
exact protected merge is authorized.

## Stage 1: Inspect the complete remote scope

Before editing, fetch canonical remote state and tags:

```bash
git fetch origin main develop --tags
git status --short --branch
git merge-base --is-ancestor origin/main origin/develop
git log --oneline origin/main..origin/develop
git tag --list 'v*' --sort=-v:refname
```

The agent must prove all of the following:

- `origin` is `goempirical/empirical-sdd`;
- the working tree is clean before creating the preparation branch;
- local observations refer to current `origin/develop` rather than a stale or
  detached checkout;
- `origin/main` is an ancestor of `origin/develop`;
- `origin/main..origin/develop` is nonempty and is the complete release scope;
- the predecessor is the newest valid immutable `v*` tag; and
- no conflicting preparation branch or ambiguous matching PR exists.

A dirty tree, fork, stale remote, empty range, divergent ancestry, conflicting
branch/PR, or requested subset stops with an exact recovery. Never stash,
discard, force, or guess.

## Stage 2: Choose the next alpha version

Follow [the versioning policy](versioning.md):

- Choose the next PATCH only when every accumulated change is demonstrably a
  backward-compatible fix, documentation change, or packaging correction that
  does not change a public workflow, integration, durable state, or package
  contract.
- Choose the next MINOR when any accumulated change adds or breaks public
  workflow, integration, durable-state, or package behavior. Mixed batches are
  therefore normally MINOR.
- Never skip versions, add a prerelease/build suffix, or prepare `1.0.0` through
  this alpha procedure.

When the diff, changelog, specifications, and merged PRs cannot resolve a
material version or migration decision, ask one bounded question and pause
before creating either PR. When PATCH versus MINOR is merely conservative,
choose MINOR rather than understate compatibility impact.

## Stage 3: Prepare matching bytes

Create or reuse exactly one branch named `release/v<version>` from the observed
`origin/develop`. Update together:

1. `PRODUCT_VERSION` in `src/protocol.ts`.
2. `package.json` version and any version-sensitive assertions/documentation.
3. `CHANGELOG.md`:
   - leave a fresh `## [Unreleased]` section;
   - move all accumulated entries into exactly one
     `## [<version>] - YYYY-MM-DD` section;
   - use the expected UTC merge date (`date -u +%F`);
   - retain only supported Keep a Changelog categories;
   - include at least one user-visible entry;
   - include exactly one `### Migration` disposition;
   - use the exact sentence `No migration required.` only when true, otherwise
     provide actionable migration instructions;
   - set `[<version>]` to compare `v<previous>...v<version>`; and
   - set `[Unreleased]` to compare `v<version>...HEAD`.

If the candidate remains unmerged across a UTC date boundary, update the date,
commit it, and rerun every check. Do not reconstruct notes from raw commit
messages; the changelog section is the exact GitHub Release body.

## Stage 4: Run the complete preparation gate

Run every command from the preparation checkout:

```bash
bun install --frozen-lockfile
bun run ci
bun run test:release
bun run release:dry-run
npm pack --json --dry-run
git diff --check
```

Inspect the single npm pack result and its file list/integrity. Any failure,
tracked generated change, metadata mismatch, stale date, malformed migration,
or pack inconsistency blocks PR creation. The GitHub **Release Gate** later
reruns the authoritative check against the exact PR merge candidate.

## Stage 5: Create or reuse the preparation PR

Before pushing or opening a PR, search the remote branch and open/closed PRs for
the exact version and head commit. Reuse one unique matching attempt; multiple
or conflicting matches require human resolution.

The preparation PR is:

```text
release/v<version> → develop
```

It contains only the prepared version/changelog changes needed for the complete
current `develop` range. Push without force and open the ordinary PR using the
release checklist template (the original `.github/PULL_REQUEST_TEMPLATE/release.md` was not preserved in this mirror). Report its URL
and stop. Required checks and a human-controlled merge must put the exact
candidate onto remote `develop`; the agent never merges it.

If remote `develop` already contains the exact prepared candidate, record this
stage as existing rather than creating a duplicate PR.

## Stage 6: Create or reuse the release PR

After the preparation PR is merged, fetch again and prove:

- remote `develop` contains the exact preparation commit and version;
- the UTC date remains current;
- `origin/main..origin/develop` still represents the complete intended scope;
- all checks still pass; and
- there is at most one exact open release PR.

If `develop` moved, the candidate changed: restart inspection and validation for
the expanded range. Never release the stale SHA or create a release branch to
freeze a subset.

The sole publication-authorizing PR is exactly:

```text
develop → main
```

Create or reuse that same-repository PR with title `release: v<version>` and the
release checklist. Report its URL and stop for required CI, **Release Gate**, no
effective `CHANGES_REQUESTED` review, and a
human-controlled two-parent merge commit. A positive review is optional for
solo-owned repositories. Do not squash, rebase, approve, or merge it as the
agent.

## Stage 7: Observe automatic immutable publication

Only the unchanged exact protected release-PR merge, with no effective
`CHANGES_REQUESTED` review, authorizes
`.github/workflows/publish.yml`. The workflow re-proves the PR, protected `main`
commit, version, changelog, pack integrity, and remote state before it:

1. creates or recognizes the exact annotated `v<version>` tag;
2. creates or recognizes one non-draft, non-prerelease GitHub Release using the
   changelog bytes;
3. publishes or recognizes `empirical-sdd@<version>` through the protected
   `npm` environment and trusted OIDC provenance;
4. verifies integrity, provenance, and `latest`; and
5. writes a bounded job summary.

The agent may monitor and report those jobs. It must not substitute local
`git tag`, `gh release create`, `npm publish`, or dist-tag commands. Environment
reviewers remain human-controlled.

## Stage 8: Retry only the same identity

For a failed or lost-response workflow, inspect the job summary and immutable
remote prefix first. Retry only with the original merged release PR number and
its exact 40-hex merge SHA:

```bash
gh workflow run publish.yml \
  --repo goempirical/empirical-sdd \
  --ref main \
  -f pull_request=<ORIGINAL_RELEASE_PR_NUMBER> \
  -f commit=<EXACT_MERGE_SHA>
```

The retry derives version, tag, notes, integrity, and dist-tag again. It may
recognize an identical tag/Release/npm prefix and perform only the next missing
effect. Never choose a new version during retry, delete or replace an artifact,
force a ref, introduce an npm token, or repair `latest` outside the trusted
workflow.

## Audited emergency break-glass authorization

Break-glass is an administrator-operated incident path for a future release
that requires an additional public incident authorization record. It is not a
normal release shortcut, never activates implicitly, and cannot authorize
the historical failed v0.29.0 merge. Agents cannot enable, approve, dispatch, merge,
or publish through this path.

The ordinary preparation PR, exact `develop` to protected `main` merge, five CI
contexts, Release Gate, clean package identity, immutable-state preflight, and
npm OIDC/provenance requirements still apply. A `CHANGES_REQUESTED` review
blocks break-glass. Emergency mode adds administrator, incident, expiry, and
audit evidence; it does not weaken or replace any ordinary release gate.

Administrator setup is deliberately disabled by default:

1. Keep the `npm` GitHub environment protected. Emergency authorization waits
   on that environment before any contents-write or OIDC job.
2. Create the repository Actions variable `EMPIRICAL_BREAK_GLASS_RELEASE` with
   literal value `enabled` only for the bounded incident window. Agents and
   workflows must never create or change it.
3. Open an issue in `goempirical/empirical-sdd` that explains the incident and
   remains open through publication and audit.
4. Prepare a canonical public authorization receipt from the exact merged
   candidate. Issued/expiry values are canonical UTC timestamps, expiry is no
   more than 30 minutes later, nonce is unique 32-hex, and justification contains
   no credential-like text:

```bash
bun run scripts/release.ts break-glass \
  --repository goempirical/empirical-sdd \
  --pr <MERGED_RELEASE_PR> \
  --commit <EXACT_MERGE_SHA> \
  --version <VERSION> \
  --integrity <SHA512_PACK_INTEGRITY> \
  --actor <GITHUB_ADMIN_LOGIN> \
  --incident https://github.com/<owner>/<repo>/issues/<ISSUE> \
  --justification "<PUBLIC_INCIDENT_JUSTIFICATION>" \
  --issued-at <UTC_TIMESTAMP> \
  --expires-at <UTC_TIMESTAMP_WITHIN_30_MINUTES> \
  --nonce <UNIQUE_32_HEX> > break-glass-authorization.json
```

5. Dispatch `publish.yml` at exact ref `main` with the exact PR/commit, explicit
   `authorization_mode=break-glass`, and compact receipt JSON as
   `emergency_authorization`. The actor must match the receipt and currently be
   a repository administrator.
6. Approve the protected `npm` environment for that run. The authorizer
   re-derives version/integrity, checks the incident and required contexts,
   records the digest in the issue and workflow summary, then permits the normal
   monotonic publisher jobs.
7. After verified convergence, disable/remove the repository variable and close
   the incident with workflow URL, authorization digest, tag, Release, npm
   integrity/provenance, and `latest` evidence.

If the receipt expires after an exact prefix exists, delete or replace nothing.
Generate a fresh receipt for the same candidate and incident; the workflow
records a second digest and resumes only after exact observation.

## Required one-time administrator configuration

The shorthand observes but does not change repository administration. Before a
release merge, administrators must keep:

- protected `develop` with ordinary CI;
- protected `main` with conversation resolution, CI, **Release Gate**, no
  bypass/direct push, and merge commits; positive review may remain optional for
  a solo-owned repository;
- protected `v*` refs;
- a protected GitHub environment named `npm`; and
- npm trusted publishing bound to organization `goempirical`, repository
  `empirical-sdd`, workflow `publish.yml`, environment `npm`, and allowed action
  `npm publish`, with no long-lived npm write token.

Missing or drifting configuration blocks the release and requires an
administrator; the agent never weakens it.
