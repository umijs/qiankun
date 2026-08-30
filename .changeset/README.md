# Changesets

This folder is managed by [`@changesets/cli`](https://github.com/changesets/changesets), which versions
and publishes the workspace packages.

## You normally do NOT hand-write changesets here

Changesets are **auto-derived from Conventional Commits** in CI by
[`scripts/generate-changesets.mjs`](../scripts/generate-changesets.mjs): the release job scans the commits
since the last release, maps each commit's changed files to the affected package(s), and infers the bump
level from the commit type:

| Commit                                                     | Bump  |
| ---------------------------------------------------------- | ----- |
| `feat!:` / `BREAKING CHANGE:` in body                      | major |
| `feat:`                                                    | minor |
| `fix:` / `perf:` / `refactor:` / `revert:`                 | patch |
| `docs:` / `chore:` / `ci:` / `style:` / `test:` / `build:` | none  |

So to ship a change, just land a well-formed conventional commit — commitlint already enforces the format.
Commits that touch no package (docs, `e2e/`, `examples/`, root config, CI) produce no release.

Each sub-package keeps its **own `CHANGELOG.md`** (the changeset default), so npm shows a per-package
changelog. There is **no root changelog** — the single aggregated log lives only on the GitHub Release.

Private workspace packages (`examples/*`, `benchmark/`, `e2e/`) are excluded from versioning entirely via
`"privatePackages": false` in `config.json` — without it changesets bumps them and writes them a
`CHANGELOG.md` just because they depend on a released package, which is pure noise for something that
never reaches npm. (`config.json` is strict JSON and cannot carry the comment, hence this note.)

## Release flow (three stages)

**A · Every PR merge — fully automatic.** CI derives changesets from the new commits; the changesets
action opens/updates a **"Version Packages" PR** that bumps versions and updates each package's
`CHANGELOG.md`.

The generator intentionally rescans the complete unreleased range from the latest reachable `v*` tag on
every push to `next`. The Changesets action rebuilds its release branch from `next`, so limiting the scan to
only the most recent push would drop changes that are still waiting in the release PR. Release tags are
therefore part of the workflow's persisted state: do not delete or move them, and verify the baseline tag
before resetting or migrating the release workflow.

**B · Merge the release PR — fully automatic.** CI runs `changeset publish` to release every changed
sub-package to npm, then `scripts/generate-release-notes.mjs` aggregates the published packages'
`CHANGELOG.md` entries into one set of notes and `gh release create` posts a **single GitHub Release**.

In prerelease mode, `scripts/publish-packages.mjs` runs `changeset publish --tag <pre.json tag>` with
`pre.json` set aside for the duration of the publish, then restores it. Both halves are needed: Changesets
refuses `--tag` outright while the pre-state says `mode: "pre"`, yet its own tag choice in that mode sends a
package to `latest` whenever every version already on npm carries that same prerelease identifier (the
`only-pre` fallback — how `@qiankunjs/react@rc` came to mean `0.0.1-rc.2` while `latest` was `0.0.1-rc.14`).
Re-pointing the tag afterwards with `npm dist-tag add` is not an option either: it needs a long-lived npm
token, which trusted publishing deliberately does not provide. The pre-state affects nothing else in the
publish flow (which packages get published, git tagging, provenance), so hiding it is what makes the
configured tag apply to every package. Outside prerelease mode, the script leaves the tag unspecified so
stable releases continue to use `latest`.

**C · Polish the release — optional, agent-assisted.** After publish, run the
[`/release-changelog`](../.claude/skills/release-changelog/SKILL.md) skill to refine that GitHub Release's
notes (highlights, de-duped cross-package lines, clearer wording) via `gh release edit`. This touches only
the GitHub Release prose, never the committed per-package changelogs.

## Overriding the automation

If a commit's inferred bump is wrong (e.g. a `fix:` that is really breaking, or a cross-package change the
file-based attribution can't see), you can still drop a normal hand-written `.changeset/*.md` — it is
merged with the auto-generated ones. The "Version Packages" PR is also a review point where the bumps can
be corrected before release.
