# Versioning and changelog policy

Empirical SDD uses [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html)
and maintains [CHANGELOG.md](../CHANGELOG.md) in the
[Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/) format.

## Alpha compatibility

Versions below `1.0.0` are alpha releases. During alpha:

- PATCH versions contain backward-compatible corrections and documentation or
  packaging fixes that do not change the public workflow contract.
- MINOR versions contain additive features or breaking public workflow,
  integration, state, or package-surface changes. Every breaking alpha minor
  must include an explicit migration note.
- `1.0.0` will declare the first stable compatibility contract. After that,
  ordinary SemVer major, minor, and patch meanings apply without the alpha
  exception.

## Canonical version

`PRODUCT_VERSION` in `src/protocol.ts` is the canonical product version.
`package.json`, public CLI output, package smoke checks, tests, documentation,
and the prepared changelog heading must match it. `SCHEMA_VERSION` changes only
when durable state compatibility changes; a package version change does not
imply a schema change.

The prepared `0.40.0` candidate is an alpha MINOR covering required-ticket
tracking gates, durable Linear MCP intent recovery, and PR lifecycle
invariants. It changes public workflow and integration behavior while retaining
Schema 5. Follow the 0.40.0 changelog migration instructions and refresh
managed agent instructions. Existing optional best-effort tracking remains
available; workflows with required tickets must synchronize or record an
audited waiver before mutation. No bulk state conversion is required.

## Changelog rules

Every user-observable change starts under `Unreleased` using applicable Keep a
Changelog categories: Added, Changed, Deprecated, Removed, Fixed, Security, or
Migration. Release preparation moves those entries into a dated version
heading and updates compare links. Historical entries must be grounded in
repository tags and commits rather than reconstructed marketing claims.

Breaking alpha changes require a `Migration` section that states exactly what
existing users or repositories must do. Internal refactors with no observable
effect may be omitted unless they materially affect trust or maintenance.

Every prepared release section includes exactly one `### Migration`
disposition. When no repository, durable-state, workflow, or package migration
is required, its content is the exact sentence `No migration required.`. Any
schema change requires actionable instructions; reviewers must also require
them for breaking alpha behavior that a schema comparison cannot detect.

## Preparation checklist

The canonical staged agent/operator procedure is [Making a new
release](releasing.md). A natural-language `make a new release` request follows
that playbook for the complete current `origin/main..origin/develop` range; it
does not authorize protected merges or direct immutable publication.

Preparing a version requires all of the following:

1. Classify the change as alpha patch or minor and record migration guidance
   for any breaking behavior.
2. Update `PRODUCT_VERSION`, package metadata, version-sensitive checks, and the
   dated changelog heading while leaving the schema untouched unless state
   compatibility actually changed.
3. Run type checking, tests, coverage, built-distribution smoke tests, clean
   package-consumer checks, consistency checks, and `git diff --check`.
4. Inspect `npm pack` contents and confirm `CHANGELOG.md` and this policy ship in
   the package.
5. Review the complete diff and record immutable Empirical evidence.

## Publication boundary

Version preparation on `develop` is a local repository change. CI, packing,
Empirical verification, and ordinary delivery to `develop` do not authorize a
Git tag, GitHub Release, npm publication, dist-tag update, protected-branch
merge, or remote ticket mutation.

The repository-specific superseding boundary is one approved release PR from
same-repository `develop` to protected `main`. Required CI and **Release Gate**
validate the exact merge candidate. Merging that unchanged two-parent PR is
narrow authorization for `.github/workflows/publish.yml` to derive and
reconcile only its matching version, merge commit, `v<version>` tag, changelog
body, npm package integrity/provenance, and `latest`. An arbitrary `main` push,
different source/base, fork, changed SHA, ordinary YOLO/delivery authority, or
free-form dispatch remains non-publishing.

The workflow keeps its trust boundaries separate: read-only authorization and
full clean CI; `contents: write` without OIDC for Git/GitHub; read-only npm
preflight/full CI; a minimal `contents: read` plus `id-token: write` job in the
protected `npm` environment for the literal publish; and read-only provenance
verification without OIDC. It creates the GitHub Release itself and does not
rely on a `GITHUB_TOKEN`-created Release event to recursively trigger trusted
npm publication. No long-lived npm write token is accepted.

### Release PR gate

The release gate requires matching `PRODUCT_VERSION` and package/packed
metadata, a next alpha patch or minor, exact release date, one nonempty
changelog section, canonical compare links, explicit migration disposition,
clean packed contents, remote absence/conflict checks, and the complete
`bun run ci` suite. The PR date must match its expected UTC merge date; update
and revalidate a PR that crosses that boundary.

`main` rules must require an approving review, CI, **Release Gate**, no direct
push/bypass, and a merge commit. `develop` rules must require ordinary CI.
Protect `v*` refs, configure the GitHub `npm` environment, and bind npm trusted
publishing to `goempirical/empirical-sdd`, `publish.yml`, environment `npm`,
and allowed action `npm publish`.

### Immutable retry

Git tags, GitHub Releases, npm versions, and dist-tags do not share a
transaction. Reconciliation therefore accepts only ordered identical prefixes:
nothing; exact tag; exact tag plus non-draft changelog Release; or the complete
provenance-backed npm publication. Every effect is re-observed, including after
a failed or lost response. Conflicting identity, gaps, incomplete observation,
missing provenance, or a divergent `latest` blocks without delete, force,
replacement, or token-based repair.

Manual retry accepts only the original merged release PR number and exact
40-hex merge commit. It derives all other identity again and reports which
immutable surfaces already exist. The generic Empirical `publish` operation
retains its separate exact literal authorization contract for other callers;
this repository automation does not broaden it.
