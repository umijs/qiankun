import { spawnSync } from 'node:child_process';
import { readFileSync, renameSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PRE_STATE_PATH = resolve(ROOT_DIR, '.changeset/pre.json');

export function getPublishArgs(preState) {
  const args = ['publish'];

  if (preState?.mode !== 'pre') return args;

  if (typeof preState.tag !== 'string' || preState.tag.trim() === '') {
    throw new Error('Prerelease mode requires a non-empty tag in .changeset/pre.json');
  }

  return [...args, '--tag', preState.tag];
}

export function readPreState(filePath = PRE_STATE_PATH) {
  try {
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') return undefined;
    throw error;
  }
}

/**
 * Runs `fn` with the changesets pre-state file set aside, then puts it back.
 *
 * `changeset publish` refuses `--tag` outright while `pre.json` says `mode: "pre"` ("Releasing under
 * custom tag is not allowed in pre mode"), yet its own tag choice in that mode sends any package whose
 * npm versions are *all* the same prerelease to `latest` instead (the `only-pre` fallback in
 * `getReleaseTag`), freezing that package's prerelease dist-tag at its first publish. Re-pointing the
 * tag afterwards with `npm dist-tag add` would need a long-lived npm token, which trusted publishing
 * deliberately does not provide.
 *
 * The pre-state influences nothing else in the publish flow — not which packages get published, git
 * tagging, or provenance — so hiding it for the duration of the publish is what lets the configured
 * tag apply to every package. Callers must pass the tag explicitly (see `getPublishArgs`).
 */
export function withPreStateSetAside(fn, filePath = PRE_STATE_PATH) {
  const parkedPath = `${filePath}.publishing`;
  renameSync(filePath, parkedPath);
  try {
    return fn();
  } finally {
    renameSync(parkedPath, filePath);
  }
}

function runChangesetPublish(args) {
  const changesetBin = fileURLToPath(import.meta.resolve('@changesets/cli/bin.js'));
  const result = spawnSync(process.execPath, [changesetBin, ...args], {
    cwd: ROOT_DIR,
    stdio: 'inherit',
  });

  if (result.error) throw result.error;
  if (result.signal) throw new Error(`Changesets publish terminated by ${result.signal}`);

  return result.status ?? 1;
}

function publishPackages() {
  const preState = readPreState();
  const args = getPublishArgs(preState);

  if (preState?.mode !== 'pre') return runChangesetPublish(args);

  return withPreStateSetAside(() => runChangesetPublish(args));
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  process.exitCode = publishPackages();
}
