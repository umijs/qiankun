import { fileURLToPath } from 'node:url';
import c from 'picocolors';
import { e as execa } from './vendor-index.1f85e5f1.js';
import { E as EXIT_CODE_RESTART } from './vendor-constants.538d9b49.js';
import 'node:buffer';
import 'node:path';
import 'node:child_process';
import 'node:process';
import './vendor-_commonjsHelpers.7d1333e8.js';
import 'child_process';
import 'path';
import 'fs';
import 'node:os';
import 'assert';
import 'events';
import 'node:fs';
import 'buffer';
import 'stream';
import 'util';
import 'node:util';

const ENTRY = new URL("./cli.js", import.meta.url);
const NODE_ARGS = [
  "--trace-deprecation",
  "--experimental-wasm-threads",
  "--wasm-atomics-on-non-shared-memory"
];
const SegfaultErrors = [
  {
    trigger: "Check failed: result.second.",
    url: "https://github.com/nodejs/node/issues/43617"
  },
  {
    trigger: "FATAL ERROR: v8::FromJust Maybe value is Nothing.",
    url: "https://github.com/vitest-dev/vitest/issues/1191"
  },
  {
    trigger: "FATAL ERROR: v8::ToLocalChecked Empty MaybeLocal.",
    url: "https://github.com/nodejs/node/issues/42407"
  }
];
main();
async function main() {
  var _a;
  let retries = 0;
  const args = process.argv.slice(2);
  if (process.env.VITEST_SEGFAULT_RETRY) {
    retries = +process.env.VITEST_SEGFAULT_RETRY;
  } else {
    for (let i = 0; i < args.length; i++) {
      if (args[i].startsWith("--segfault-retry=") || args[i].startsWith("--segfaultRetry=")) {
        retries = +args[i].split("=")[1];
        break;
      } else if ((args[i] === "--segfault-retry" || args[i] === "--segfaultRetry") && ((_a = args[i + 1]) == null ? void 0 : _a.match(/^\d+$/))) {
        retries = +args[i + 1];
        break;
      }
    }
  }
  if (retries <= 0) {
    await import('./cli.js');
    return;
  }
  const nodeArgs = [];
  const vitestArgs = [];
  for (let i = 0; i < args.length; i++) {
    let matched = false;
    for (const nodeArg of NODE_ARGS) {
      if (args[i] === nodeArg || args[i].startsWith(`${nodeArg}=`)) {
        matched = true;
        nodeArgs.push(args[i]);
        break;
      }
    }
    if (!matched)
      vitestArgs.push(args[i]);
  }
  retries = Math.max(1, retries || 1);
  for (let i = 1; i <= retries; i++) {
    const result = await start(nodeArgs, vitestArgs);
    if (result === "restart") {
      i -= 1;
      continue;
    }
    if (i === 1 && retries === 1) {
      console.log(c.yellow(`It seems to be an upstream bug of Node.js. To improve the test stability,
you could pass ${c.bold(c.green("--segfault-retry=3"))} or set env ${c.bold(c.green("VITEST_SEGFAULT_RETRY=3"))} to
have Vitest auto retries on flaky segfaults.
`));
    }
    if (i !== retries)
      console.log(`${c.inverse(c.bold(c.magenta(" Retrying ")))} vitest ${args.join(" ")} ${c.gray(`(${i + 1} of ${retries})`)}`);
  }
  process.exit(1);
}
async function start(preArgs, postArgs) {
  var _a;
  const child = execa(
    "node",
    [
      ...preArgs,
      fileURLToPath(ENTRY),
      ...postArgs
    ],
    {
      reject: false,
      stderr: "pipe",
      stdout: "inherit",
      stdin: "inherit",
      env: {
        ...process.env,
        VITEST_CLI_WRAPPER: "true"
      }
    }
  );
  (_a = child.stderr) == null ? void 0 : _a.pipe(process.stderr);
  const { stderr = "" } = await child;
  if (child.exitCode === EXIT_CODE_RESTART)
    return "restart";
  for (const error of SegfaultErrors) {
    if (stderr.includes(error.trigger)) {
      if (process.env.GITHUB_ACTIONS)
        console.log(`::warning:: Segmentfault Error Detected: ${error.trigger}
Refer to ${error.url}`);
      const RED_BLOCK = c.inverse(c.red(" "));
      console.log(`
${c.inverse(c.bold(c.red(" Segmentfault Error Detected ")))}
${RED_BLOCK} ${c.red(error.trigger)}
${RED_BLOCK} ${c.red(`Refer to ${error.url}`)}
`);
      return "error";
    }
  }
  process.exit(child.exitCode);
}
