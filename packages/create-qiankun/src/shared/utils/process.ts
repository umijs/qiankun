import { spawn } from 'node:child_process';

interface RunCommandOptions {
  cwd: string;
}

export function runCommand(command: string, args: string[], options: RunCommandOptions): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      stdio: 'inherit',
    });

    child.once('error', reject);
    child.once('exit', (exitCode, signal) => {
      if (exitCode === 0) {
        resolve();
        return;
      }

      const termination = signal ? `signal ${signal}` : `exit code ${String(exitCode)}`;
      reject(new Error(`${command} failed with ${termination}`));
    });
  });
}
