// A second module in the graph so tests cover import rewriting + live bindings, not just the entry.
let count = 0;

export function increment() {
  count += 1;
}

export function getCount() {
  return count;
}
