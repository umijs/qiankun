"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var spawn = require("spawndamnit"), fs = require("fs"), path = require("path"), getPackages = require("@manypkg/get-packages"), errors = require("@changesets/errors"), isSubdir = require("is-subdir"), micromatch = require("micromatch");

function _interopDefault(e) {
  return e && e.__esModule ? e : {
    default: e
  };
}

var spawn__default = _interopDefault(spawn), fs__default = _interopDefault(fs), path__default = _interopDefault(path), isSubdir__default = _interopDefault(isSubdir), micromatch__default = _interopDefault(micromatch);

async function add(pathToFile, cwd) {
  const gitCmd = await spawn__default.default("git", [ "add", pathToFile ], {
    cwd: cwd
  });
  return 0 !== gitCmd.code && console.log(pathToFile, gitCmd.stderr.toString()), 0 === gitCmd.code;
}

async function commit(message, cwd) {
  return 0 === (await spawn__default.default("git", [ "commit", "-m", message, "--allow-empty" ], {
    cwd: cwd
  })).code;
}

async function getAllTags(cwd) {
  const gitCmd = await spawn__default.default("git", [ "tag" ], {
    cwd: cwd
  });
  if (0 !== gitCmd.code) throw new Error(gitCmd.stderr.toString());
  const tags = gitCmd.stdout.toString().trim().split("\n");
  return new Set(tags);
}

async function tag(tagStr, cwd) {
  return 0 === (await spawn__default.default("git", [ "tag", tagStr, "-m", tagStr ], {
    cwd: cwd
  })).code;
}

async function getDivergedCommit(cwd, ref) {
  const cmd = await spawn__default.default("git", [ "merge-base", ref, "HEAD" ], {
    cwd: cwd
  });
  if (0 !== cmd.code) throw new Error(`Failed to find where HEAD diverged from ${ref}. Does ${ref} exist?`);
  return cmd.stdout.toString().trim();
}

async function getCommitsThatAddFiles(gitPaths, {cwd: cwd, short: short = !1}) {
  const map = new Map;
  let remaining = gitPaths;
  for (;;) {
    const commitInfos = await Promise.all(remaining.map((async gitPath => {
      const [commitSha, parentSha] = (await spawn__default.default("git", [ "log", "--diff-filter=A", "--max-count=1", short ? "--pretty=format:%h:%p" : "--pretty=format:%H:%p", gitPath ], {
        cwd: cwd
      })).stdout.toString().split(":");
      return {
        path: gitPath,
        commitSha: commitSha,
        parentSha: parentSha
      };
    })));
    let commitsWithMissingParents = [];
    for (const info of commitInfos) info.commitSha && (info.parentSha ? map.set(info.path, info.commitSha) : commitsWithMissingParents.push(info));
    if (0 === commitsWithMissingParents.length) break;
    if (!await isRepoShallow({
      cwd: cwd
    })) {
      for (const unresolved of commitsWithMissingParents) map.set(unresolved.path, unresolved.commitSha);
      break;
    }
    await deepenCloneBy({
      by: 50,
      cwd: cwd
    }), remaining = commitsWithMissingParents.map((p => p.path));
  }
  return gitPaths.map((p => map.get(p)));
}

async function isRepoShallow({cwd: cwd}) {
  const isShallowRepoOutput = (await spawn__default.default("git", [ "rev-parse", "--is-shallow-repository" ], {
    cwd: cwd
  })).stdout.toString().trim();
  if ("--is-shallow-repository" === isShallowRepoOutput) {
    const gitDir = (await spawn__default.default("git", [ "rev-parse", "--git-dir" ], {
      cwd: cwd
    })).stdout.toString().trim(), fullGitDir = path__default.default.resolve(cwd, gitDir);
    return fs__default.default.existsSync(path__default.default.join(fullGitDir, "shallow"));
  }
  return "true" === isShallowRepoOutput;
}

async function deepenCloneBy({by: by, cwd: cwd}) {
  await spawn__default.default("git", [ "fetch", "--deepen=" + by ], {
    cwd: cwd
  });
}

async function getRepoRoot({cwd: cwd}) {
  const {stdout: stdout, code: code, stderr: stderr} = await spawn__default.default("git", [ "rev-parse", "--show-toplevel" ], {
    cwd: cwd
  });
  if (0 !== code) throw new Error(stderr.toString());
  return stdout.toString().trim().replace(/\n|\r/g, "");
}

async function getChangedFilesSince({cwd: cwd, ref: ref, fullPath: fullPath = !1}) {
  const divergedAt = await getDivergedCommit(cwd, ref), cmd = await spawn__default.default("git", [ "diff", "--name-only", divergedAt ], {
    cwd: cwd
  });
  if (0 !== cmd.code) throw new Error(`Failed to diff against ${divergedAt}. Is ${divergedAt} a valid ref?`);
  const files = cmd.stdout.toString().trim().split("\n").filter((a => a));
  if (!fullPath) return files;
  const repoRoot = await getRepoRoot({
    cwd: cwd
  });
  return files.map((file => path__default.default.resolve(repoRoot, file)));
}

async function getChangedChangesetFilesSinceRef({cwd: cwd, ref: ref}) {
  try {
    const divergedAt = await getDivergedCommit(cwd, ref), cmd = await spawn__default.default("git", [ "diff", "--name-only", "--diff-filter=d", divergedAt ], {
      cwd: cwd
    });
    let tester = /.changeset\/[^/]+\.md$/;
    return cmd.stdout.toString().trim().split("\n").filter((file => tester.test(file)));
  } catch (err) {
    if (err instanceof errors.GitError) return [];
    throw err;
  }
}

async function getChangedPackagesSinceRef({cwd: cwd, ref: ref, changedFilePatterns: changedFilePatterns = [ "**" ]}) {
  const changedFiles = await getChangedFilesSince({
    ref: ref,
    cwd: cwd,
    fullPath: !0
  });
  return [ ...(await getPackages.getPackages(cwd)).packages ].sort(((pkgA, pkgB) => pkgB.dir.length - pkgA.dir.length)).filter((pkg => {
    const changedPackageFiles = [];
    for (let i = changedFiles.length - 1; i >= 0; i--) {
      const file = changedFiles[i];
      if (isSubdir__default.default(pkg.dir, file)) {
        changedFiles.splice(i, 1);
        const relativeFile = file.slice(pkg.dir.length + 1);
        changedPackageFiles.push(relativeFile);
      }
    }
    return changedPackageFiles.length > 0 && micromatch__default.default(changedPackageFiles, changedFilePatterns).length > 0;
  }));
}

async function tagExists(tagStr, cwd) {
  return !!(await spawn__default.default("git", [ "tag", "-l", tagStr ], {
    cwd: cwd
  })).stdout.toString().trim();
}

async function getCurrentCommitId({cwd: cwd, short: short = !1}) {
  return (await spawn__default.default("git", [ "rev-parse", short && "--short", "HEAD" ].filter(Boolean), {
    cwd: cwd
  })).stdout.toString().trim();
}

async function remoteTagExists(tagStr) {
  return !!(await spawn__default.default("git", [ "ls-remote", "--tags", "origin", "-l", tagStr ])).stdout.toString().trim();
}

exports.add = add, exports.commit = commit, exports.deepenCloneBy = deepenCloneBy, 
exports.getAllTags = getAllTags, exports.getChangedChangesetFilesSinceRef = getChangedChangesetFilesSinceRef, 
exports.getChangedFilesSince = getChangedFilesSince, exports.getChangedPackagesSinceRef = getChangedPackagesSinceRef, 
exports.getCommitsThatAddFiles = getCommitsThatAddFiles, exports.getCurrentCommitId = getCurrentCommitId, 
exports.getDivergedCommit = getDivergedCommit, exports.isRepoShallow = isRepoShallow, 
exports.remoteTagExists = remoteTagExists, exports.tag = tag, exports.tagExists = tagExists;
