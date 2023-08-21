import { resolve } from 'pathe';
import { e as execa } from './vendor-index.1f85e5f1.js';
import 'node:buffer';
import 'node:path';
import 'node:child_process';
import 'node:process';
import './vendor-_commonjsHelpers.7d1333e8.js';
import 'child_process';
import 'path';
import 'fs';
import 'node:url';
import 'node:os';
import 'assert';
import 'events';
import 'node:fs';
import 'buffer';
import 'stream';
import 'util';
import 'node:util';

class VitestGit {
  constructor(cwd) {
    this.cwd = cwd;
  }
  root;
  async resolveFilesWithGitCommand(args) {
    let result;
    try {
      result = await execa("git", args, { cwd: this.root });
    } catch (e) {
      e.message = e.stderr;
      throw e;
    }
    return result.stdout.split("\n").filter((s) => s !== "").map((changedPath) => resolve(this.root, changedPath));
  }
  async findChangedFiles(options) {
    const root = await this.getRoot(this.cwd);
    if (!root)
      return null;
    this.root = root;
    const changedSince = options.changedSince;
    if (typeof changedSince === "string") {
      const [committed, staged2, unstaged2] = await Promise.all([
        this.getFilesSince(changedSince),
        this.getStagedFiles(),
        this.getUnstagedFiles()
      ]);
      return [...committed, ...staged2, ...unstaged2];
    }
    const [staged, unstaged] = await Promise.all([
      this.getStagedFiles(),
      this.getUnstagedFiles()
    ]);
    return [...staged, ...unstaged];
  }
  getFilesSince(hash) {
    return this.resolveFilesWithGitCommand(
      ["diff", "--name-only", `${hash}...HEAD`]
    );
  }
  getStagedFiles() {
    return this.resolveFilesWithGitCommand(
      ["diff", "--cached", "--name-only"]
    );
  }
  getUnstagedFiles() {
    return this.resolveFilesWithGitCommand(
      [
        "ls-files",
        "--other",
        "--modified",
        "--exclude-standard"
      ]
    );
  }
  async getRoot(cwd) {
    const options = ["rev-parse", "--show-cdup"];
    try {
      const result = await execa("git", options, { cwd });
      return resolve(cwd, result.stdout);
    } catch {
      return null;
    }
  }
}

export { VitestGit };
