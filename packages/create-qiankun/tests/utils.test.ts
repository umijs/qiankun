import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { readJsonFile, writeJsonFile } from '../src/shared/utils/fs';
import { runCommand } from '../src/shared/utils/process';

describe('Node utility replacements', () => {
  it('reads and writes formatted JSON', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'create-qiankun-json-'));
    const filePath = join(directory, 'package.json');

    try {
      await writeJsonFile(filePath, { name: 'fixture' });

      expect(await readFile(filePath, 'utf8')).toBe('{\n  "name": "fixture"\n}\n');
      expect(await readJsonFile<{ name: string }>(filePath)).toEqual({ name: 'fixture' });
    } finally {
      await rm(directory, { force: true, recursive: true });
    }
  });

  it('propagates child process failures', async () => {
    await expect(runCommand(process.execPath, ['-e', 'process.exit(7)'], { cwd: process.cwd() })).rejects.toThrow(
      'exit code 7',
    );
  });
});
