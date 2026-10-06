> Recovered copy — original: https://github.com/goempirical/empirical-sdd/releases/tag/v0.22.0 (404 since 2026-10-06).

# Empirical 0.22.0

- Tag: v0.22.0
- Repository: goempirical/empirical-sdd
- Published: 2026-08-04T03:54:33Z
- Author: MateoCerquetella

---

Empirical 0.22.0 is the Schema 5 trust, autonomy, migration, distribution, and lifecycle release.

## Highlights

- Ships the Schema 5 evidence, routing, coordination, Doctor, and protected delivery/publication model.
- Adds atomic migration for Schema 4 repositories with hardened scratch isolation.
- Installs six agent-native Empirical skills and narrows the supported package/API surface.
- Adds the ownership-bound `empirical uninstall` command. It removes managed global skills and package installation while preserving project `.empirical` history and repository configuration.
- Keeps the public terminal lifecycle focused on Install, Update, and Uninstall; development workflows remain agent-native.

## Compatibility

- Requires Node.js 22 or newer.
- Existing Schema 4 repositories migrate atomically on their first mutating 0.22 operation.

## Validation

- CI passed on Ubuntu Node 22, 24, and 26; macOS Node 24; and Windows Node 24.
- 170 tests passed with the coverage gate satisfied across 29 modules.
- The packed package contains 40 declared files under LICENSE, README.md, dist/, and package.json.
- Clean package, CLI, MCP, migration, six-skill installation, and uninstall smoke tests passed.

## Install

```sh
npm install -g empirical-sdd@0.22.0
```
