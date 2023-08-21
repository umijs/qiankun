#!/usr/bin/env node
// CLI for querying safe-regex for safety analysis
// Input: JSON-formatted file with an object with key 'pattern'
// Output: STDOUT: JSON-formatted object with new key 'isSafe' and value 0 or 1
//         STDERR: Progress updates

var safe = require('../'),
    fs   = require('fs');

if (process.argv.length != 3) {
  console.error(`Usage: ${process.argv[1]} pattern.json`);
  process.exit(1);
}
const file = process.argv[2];

// Get pattern
const cont = fs.readFileSync(file, 'utf-8');
let pattern = JSON.parse(cont);

// Can analyze? Is safe?
let canAnalyze = 0;
let isSafe = 0;
try {
  isSafe = safe(pattern.pattern) ? 1 : 0;
  canAnalyze = 1;
} catch (e) {
  canAnalyze = 0;
  isSafe = 'unknown';
}

pattern.canAnalyze = canAnalyze;
pattern.isSafe = isSafe;

// Emit.
console.error(`Pattern /${pattern.pattern}/: canAnalyze ${pattern.canAnalyze} isSafe ${pattern.isSafe}`);
console.log(JSON.stringify(pattern));
process.exit(0);
