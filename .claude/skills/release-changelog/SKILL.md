---
name: release-changelog
description: Polish a published qiankun GitHub Release's aggregated notes into a bilingual (English then Chinese) write-up with an agent. Use after a release goes out — turning the mechanically-aggregated, per-package release notes into a clean, human-readable, English + Chinese write-up (highlights, de-duped cross-package lines, clearer wording) via `gh release edit`. Triggers include "polish the release notes", "clean up the GitHub release", "improve the changelog for the latest release".
---

# Release changelog

Qiankun releases are commit-driven: CI auto-derives changesets from Conventional Commits, changesets writes each sub-package's own `CHANGELOG.md` (so npm shows a per-package changelog), and on publish `scripts/generate-release-notes.mjs` aggregates those into **one GitHub Release** per version.

That aggregated Release is **mechanical** (raw per-package changelog lines). This skill polishes it into a human-readable, **bilingual** write-up — an English version on top, a Chinese version below — after the fact, directly on the GitHub Release, without touching any committed changelog. Read `.changeset/README.md` for the surrounding flow.

## When to run

After a release has been published (the "Version Packages" PR was merged and CI created the GitHub Release). Typically: "polish the latest release notes".

## Steps

1. **Find the release to polish** (default: the most recent one):

   ```bash
   gh release list --limit 5
   gh release view <tag> --json tagName,name,body
   ```

   Confirm the target tag with the user if it's not obviously the latest.

2. **Read the mechanical notes** from the release `body`. This is the raw material — the aggregated per-package changelog. Do not invent anything not present in it (cross-check against `git log <prev-tag>..<tag>` only to understand, not to add unlisted changes).

3. **Polish** the notes, keeping the per-package structure so consumers still see each sub-package and its version. Polishing means:
   - Lead with a short **Highlights** list (2–5 bullets) when the release has notable user-facing changes; skip it for small patch releases.
   - Rewrite terse lines into clear, user-facing wording; keep the `(#PR)` reference at the end of each line.
   - De-duplicate: a change that touched many packages is often better stated once under the facade `qiankun` section than repeated under every package.
   - Drop noise (pure "Updated dependencies" internal bumps).

4. **Produce a bilingual document** — the full **English** version first, then the full **简体中文** version, separated by a `---` rule. Keep the identical per-package structure and `(#PR)` references in both halves; translate the prose (highlights, descriptions), never the package names, versions, or PR numbers. Template:

   ```markdown
   <!-- English -->

   ## Highlights

   - ...

   ## qiankun `<version>`

   - ...

   ---

   <!-- 简体中文 -->

   ## 更新亮点

   - ...

   ## qiankun `<version>`

   - ...
   ```

5. **Show the user the proposed notes** and get approval.

6. **Update the release** (does not re-tag or re-publish npm):

   ```bash
   gh release edit <tag> --notes-file <polished.md>
   ```

## Do not

- Do not run `gh release create`, re-tag, or re-publish to npm — only edit the notes of an existing release.
- Do not edit any `CHANGELOG.md` or `.changeset/*` — the per-package changelogs are the committed record; this skill only refines the GitHub Release prose.
- Do not add changes that aren't in the mechanical notes / commit history.
