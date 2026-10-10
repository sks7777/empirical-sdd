# Empirical configuration reference

Run `empirical doctor` for the complete plain-English health check: what is
working, what needs attention, what is optional, what you can change, and what
Empirical always protects. The older `empirical doctor --options` spelling is
kept as an alias. Both commands are read-only and work before initialization.

Use `empirical doctor --json` for automation and advanced diagnostics. JSON
includes finding codes, scopes, fixes, configuration paths, effective values,
sources, and editing metadata. Complex values are summarized, and credential
values are never read or printed.

## Where settings live and which wins

| Location | Scope and editing method |
| --- | --- |
| `.empirical/config.json` | Shared workflow preferences. Use Init or `empirical_configure`; advanced settings without a configure input are edited in this file. |
| `.empirical/policy.json` | Strict Policy v2: commands, check applicability, context, delivery and promotion. Use `empirical_configure` with `policy`, or `empirical __internal policy --input <file>` for automation. |
| `<checkout-git-dir>/empirical-sdd/preferences.json` | Personal `defaultMode` only. Use `empirical_configure` with `scope: "personal"`; `defaultMode: null` clears the override. |
| `.empirical/tracker.json` | Optional external tracker policy, managed through Init or `empirical_tracker_configure`. See [tracking](tracking.md) and the [MCP tracker reference](mcp.md#external-ticket-mirror). |
| Host environment / credential store | Authentication. Config stores environment variable **names**, not credential values. Never commit credentials. |

An explicit request for a lane wins over defaultMode. Otherwise the personal default wins over the team default, then `empirical`. Activation is separate: explicit activation still requires opting into Empirical. Init preserves existing choices. Configuration changes do not retroactively convert historical phases, reviews or completion records.

Evidence settings live only in `config.json` (`evidence`); change them with `empirical_configure` or by editing that file. Policy v2 no longer carries them: new policies never get `verification.evidence`, a policy that an older release wrote keeps its copy unchanged only because existing receipts are bound to the policy digest, and a policy input that tries to change it is refused with `POLICY_EVIDENCE_RETIRED`. Doctor warns with `POLICY_EVIDENCE_CONTRADICTS_CONFIG` when that leftover copy disagrees with `config.json`, which is always the one gates use. Policy, spec or scoped source changes may invalidate corresponding evidence. Arbitrary config keys are not automatically supported options.

## Workflow and policy options

The following catalog is also exposed by Doctor. Values shown here are fallback defaults; Init may suggest a different choice, such as concise interaction. `config` paths are in `.empirical/config.json`; `policy` paths are in `.empirical/policy.json`.

<!-- configuration-options -->

| Setting | Default | Allowed values / purpose | Change |
| --- | --- | --- | --- |
| `config.activationMode` | "explicit" | explicit \| automatic | empirical_configure or edit .empirical/config.json |
| `config.defaultMode` | "empirical" | empirical \| direct; personal override supported | empirical_configure or edit .empirical/config.json |
| `config.profile` | "complex" | fast \| quick \| complex (legacy quick retained) | Choose Fast/Complex per feature; config is the repository fallback |
| `config.maxRepairAttempts` | 2 | repair-attempt limit | Edit .empirical/config.json |
| `config.mockupsBeforeCoding` | true | true \| false; Complex UI mockup approval | empirical_configure or edit .empirical/config.json |
| `config.evidence.required` | true | true \| false; Fast still reports verification skipped | empirical_configure or edit .empirical/config.json |
| `config.evidence.browserForUi` | true | true \| false; Fast still reports verification skipped | empirical_configure or edit .empirical/config.json |
| `config.evidence.screenshotForUi` | true | true \| false; Fast still reports verification skipped | empirical_configure or edit .empirical/config.json |
| `config.evidence.codeReview` | true | true \| false; Fast still reports verification skipped | empirical_configure or edit .empirical/config.json |
| `config.isolation.mode` | "ask" | ask \| off | empirical_configure or edit .empirical/config.json |
| `config.isolation.baseBranch` | "auto" | auto or Git branch/ref | empirical_configure or edit .empirical/config.json |
| `config.isolation.worktreePath` | "../{repo}-{feature}" | path template: {repo}, {feature}, {type} | empirical_configure or edit .empirical/config.json |
| `config.isolation.branchPattern` | "{type}/{feature}" | branch template: {repo}, {feature}, {type} | empirical_configure or edit .empirical/config.json |
| `config.isolation.copyFiles` | "[]" | ignored, untracked relative paths; at most 100 | empirical_configure or edit .empirical/config.json |
| `config.isolation.localFiles.discover` | true | true \| false | empirical_configure or edit .empirical/config.json |
| `config.isolation.localFiles.include` | "[\"**/.env\", \"**/.env.*\"]" | bounded relative glob list | empirical_configure or edit .empirical/config.json |
| `config.isolation.localFiles.exclude` | "example/sample/template env patterns" | bounded relative glob list | empirical_configure or edit .empirical/config.json |
| `config.decisions.complexRecords` | "required" | required \| off | empirical_configure or edit .empirical/config.json |
| `config.interaction.questions` | "detailed" | concise \| detailed | empirical_configure or edit .empirical/config.json |
| `config.review.mode` | "fresh-context" | fresh-context \| bot | empirical_configure or edit .empirical/config.json |
| `config.review.reviewerTokenEnv` | "EMPIRICAL_REVIEWER_TOKEN" | environment variable name, never its value | empirical_configure or edit .empirical/config.json |
| `config.budget.fast` | 30 | positive integer minutes | Edit .empirical/config.json |
| `config.budget.quick` | 60 | positive integer minutes | Edit .empirical/config.json |
| `config.budget.complex` | 120 | positive integer minutes | Edit .empirical/config.json |
| `config.sizeGuardrail.enabled` | true | true \| false | Edit .empirical/config.json |
| `config.sizeGuardrail.maxCriteria` | 6 | positive integer | Edit .empirical/config.json |
| `config.sizeGuardrail.maxCapabilities` | 2 | positive integer | Edit .empirical/config.json |
| `config.staleness.enabled` | true | true \| false | Edit .empirical/config.json |
| `config.staleness.maxBehind` | 10 | nonnegative integer commits | Edit .empirical/config.json |
| `config.context.name` | "root manifest name (package.json, Cargo.toml or pyproject.toml)" | single-line repository name for the context index | Edit .empirical/config.json |
| `config.context.exclude` | "history and archive globs (ai/specs, archive, history, snapshots, CHANGELOG)" | bounded relative glob list; !pattern re-includes a default | Edit .empirical/config.json |
| `policy.context` | "[]" | repository-relative context paths | empirical_configure policy or empirical __internal policy --input <file> |
| `policy.phases` | "{}" | phase name to required repository artifact paths | empirical_configure policy or empirical __internal policy --input <file> |
| `policy.verification.commands` | "[]" | command objects; see command fields in the guide | empirical_configure policy or empirical __internal policy --input <file> |
| `policy.verification.notApplicable` | "[]" | {check: package-consumer \| clean-clone \| cross-platform, reason: 20–500 characters}[] | empirical_configure policy or empirical __internal policy --input <file> |
| `policy.promotion.fullCi` | "auto" | auto \| local \| remote-checks | empirical_configure policy or empirical __internal policy --input <file> |
| `policy.promotion.binding` | "standard" | standard (proof follows content) \| strict (proof bound to the exact commit, for releases and audits) | empirical_configure policy or empirical __internal policy --input <file> |
| `policy.delivery` | null | null or {provider: github, targetBranch, requiredChecks} | empirical_configure policy or empirical __internal policy --input <file> |
| `policy.preferredAgent` | null | null \| codex \| claude \| cursor \| gemini \| windsurf | empirical_configure policy or empirical __internal policy --input <file> |

## Repository context freshness

Context pages under `.empirical/context/` stay fresh until a page's sources
change. Freshness is derived from Git history, so nothing derived is committed
and nothing conflicts:

- A page is stale when a commit changed one of its sources and that commit is
  not an ancestor of a commit that edited the page or added a review record for
  it. A refresh confirms a stale page by writing one uniquely named record under
  `.empirical/context/reviews/<page>/`; commit it with the change it reviews.
- Uncommitted edits to tracked sources count until a refresh records them.
  Untracked files never make the repository stale, the checkout folder and line
  endings never matter, and Implement completion asks for new files to be reviewed.
- A shallow clone cannot see enough history, so Doctor reports freshness as
  unknown (`info`) and never blocks.
- Each page selects its own sources by relevance: manifests and workspace files
  first, then workspace-package manifests, then source roots (`src`, `apps`,
  `packages` and the like), `scripts/` and CI workflows as the page requires.
- History and archive paths are excluded by default. Add project-specific ones
  with `context.exclude`, for example `["docs/reports/**"]`; `"!ai/specs/**"`
  re-includes that default.
- `index.md` lists structure only (roots, workspace packages, manifests, primary
  docs). When only the index is out of date, Doctor reports `info`, not a
  warning, and Context is not blocked.
- The `manifest.json` written by earlier releases is no longer used. Doctor
  notes it as `info` and a refresh deletes it; a `.gitignore` entry for it can
  be removed.

## Verification command fields

Each `verification.commands` entry accepts only these fields:

| Field | Default / allowed values |
| --- | --- |
| `id` | Required unique lowercase command identifier. |
| `argv` | Required nonempty argument array; direct execution, no shell syntax. |
| `cwd` | `.`; path inside the repository. |
| `timeoutMs` | Required positive integer, maximum 2,700,000 (45 minutes). |
| `maxOutputBytes` | 262,144; maximum 4,194,304. |
| `evidenceKinds` | `["test"]`; `test`, `browser`, `screenshot`, `review`, `human`. Execution does not automatically confer a canonical review. |
| `checks` | `[]`; test commands without a declared check infer `unit`. Supported kinds: unit, integration, adapter-contract, fault-injection, package-consumer, clean-clone, end-to-end, cross-platform, fresh-context, live-acceptance, full-ci. |
| `criteria` | `[]` means no criterion allowlist; otherwise acceptance criterion IDs. |
| `testFiles` | Omitted or `changed`. Changed commands receive explicit test paths and cannot declare `full-ci`. |
| `scope` | Omitted means whole tree; otherwise up to 32 repository-relative prefixes/globs or `workspace`. Workspace scope derives from the package graph and falls back conservatively when unresolved. |

A small-change command, alongside a full-suite command, might be:

```json
{
  "id": "affected-tests",
  "argv": ["bun", "test"],
  "cwd": ".",
  "timeoutMs": 120000,
  "evidenceKinds": ["test"],
  "checks": ["unit"],
  "testFiles": "changed",
  "scope": "workspace"
}
```

Configure commands for the tools your repository actually uses; Bun is only an example. `full-ci` may use npm, pnpm, pytest, make or another supported direct command. `promotion.fullCi: "auto"` uses eligible PR CI, otherwise an explicitly approved local run. `remote-checks` requires a GitHub delivery policy with required checks and a configured full-CI command.

`promotion.binding` decides how strictly proof is bound. With `standard`, the default, a receipt, a full-suite approval or a review stays valid while the content it covered is unchanged: committing evidence or other Empirical records, or merging the target branch without touching reviewed files, never forces a re-test or a re-review, and a merged pull request closes its feature. Authored inputs (spec, design, plan, decisions, impact, config and policy) stay bound in both modes. Verify follows the same split. With `standard` it asks only for what the change touches: focused tests (changed-file commands win every check they cover), the checks its declared capabilities and surfaces imply, and a browser outcome check for `[UI]` criteria; the full suite belongs to pull-request CI. With `strict`, proof is bound to the exact commit and delivery uses the two reviewed pull requests of Deliver; Verify also adds the checks the request's risk floor implies (adapter-contract, fault-injection, clean-clone, cross-platform, end-to-end and the rest); use it for releases and audits.

## Declare a repository-specific check inapplicable

A repository that does not publish a package can add:

```json
{
  "verification": {
    "notApplicable": [
      {
        "check": "package-consumer",
        "reason": "This repository deploys a private service and distributes no consumable package."
      }
    ]
  }
}
```

This is a fragment to merge into the existing Policy v2 document, not a complete replacement policy. The reason must have 20–500 characters. Each check can occur once. Only `package-consumer`, `clean-clone` and `cross-platform` can be declared inapplicable. The matrix records the exclusions and binds them to its policy digest. They are omissions with reasons, never passing executions. Unit, fresh-context, UI outcome, live acceptance and full-CI requirements cannot be removed this way.

## Tracker settings

Tracking is optional and defaults to off until selected. Supported providers include Linear, GitHub, Jira and Plane. Use the tracker wizard to select provider, connection/authentication, team/project target and status mapping. The tracker policy also specifies ticket rules by work type, enforcement (`best-effort` or `strict`), ticket behavior (such as ensure/attach), and lifecycle completion (`workflow`, `release` or `deployment`). The [tracker policy reference](mcp.md#external-ticket-mirror) lists provider-specific fields, states, presets and migration examples. Doctor diagnoses tracker configuration but never displays credential values or invents provider identifiers.

## Fixed rules and managed metadata

These are not switches: immutable evidence integrity, explicit actor attribution, current source/spec/policy bindings, feature ownership checks, real conflict detection, supported schema versions, honest completion levels, and publication/merge authorization. Credentials, passing results and independent approvals cannot be asserted by editing a spec.

`schemaVersion`, `setupComplete`, `legacySource` and migration metadata are managed state. Phase, revision, selected checkout, completion records, receipts, review results and capability comparison bases are workflow records, not configuration. Use their operations; do not edit them to bypass a gate. A missing nonessential check may remain pending while you edit and push the feature branch, and another independent spec can proceed in its own checkout. Pull-request creation waits for completed Complex feature verification.
