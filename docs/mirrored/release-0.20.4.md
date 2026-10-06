> Recovered copy — original: https://github.com/goempirical/empirical-sdd/releases/tag/v0.20.4 (404 since 2026-10-06).

# Empirical 0.20.4

- Tag: v0.20.4
- Repository: goempirical/empirical-sdd
- Published: 2026-07-31T16:06:55Z
- Author: MateoCerquetella

---

Empirical now opens its public help with a terminal-native GoEmpirical identity and the exact running version.

## Highlights

- Adds the GoEmpirical three-color mark, Empirical wordmark, and `v0.20.4` to no-command and help entrypoints.
- Adapts cleanly across wide, compact, and very narrow terminals.
- Uses the official red, yellow, and blue palette only when the terminal supports color.
- Honors `NO_COLOR`, `TERM=dumb`, and redirected output without emitting ANSI control sequences.
- Keeps `empirical --version`, JSON automation, private agent operations, and the MCP stdio transport exact and unbranded.

## Validation

- CI passed on Ubuntu, macOS, and Windows.
- 106 tests across 14 files passed.
- The npm registry artifact contains 25 declared distribution files.
- A clean install from npm reports exactly `0.20.4` and renders one automation-safe help banner.

## Install

```sh
npm install -g empirical-sdd@0.20.4
```
