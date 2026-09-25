/**
 * @author Kuitos
 * @since 2026-07-04
 * Runtime import map management (RFC §11).
 *
 * Native import maps are document-level, append-only and first-wins on conflicts, so the registry
 * dedupes entries globally and surfaces conflicts loudly instead of letting the browser drop them
 * silently. Specifier uniqueness across apps/instances is guaranteed by the instance-key prefix.
 */
import { keys } from '../utils';

type Injection = { script: HTMLScriptElement; activeEntries: number };
type InjectedEntry = { target: string; owners: number; injection: Injection };

const injectedEntries = new Map<string, InjectedEntry>();

/** Release only framework bookkeeping and owned DOM nodes; native mappings are irrevocable. */
export function injectImportMapEntries(
  entries: Record<string, string>,
  targetDocument: Document = document,
): () => void {
  const fresh: Record<string, string> = {};
  const acquired = new Map<string, InjectedEntry>();
  let injection: Injection | undefined;

  keys(entries).forEach((specifier) => {
    const target = entries[specifier];
    const existing = injectedEntries.get(specifier);
    if (existing !== undefined) {
      if (existing.target !== target) {
        console.error(
          `[qiankun] import map entry ${specifier} -> ${target} conflicts with the injected ${existing.target}, the browser keeps the first one (first-wins). This indicates an instance key collision, please file an issue.`,
        );
      } else {
        existing.owners++;
        acquired.set(specifier, existing);
      }
      return;
    }
    injection ??= { script: targetDocument.createElement('script'), activeEntries: 0 };
    injection.activeEntries++;
    const entry = { target, owners: 1, injection };
    injectedEntries.set(specifier, entry);
    acquired.set(specifier, entry);
    fresh[specifier] = target;
  });

  if (injection) {
    const { script } = injection;
    script.type = 'importmap';
    script.dataset.qiankun = 'esm';
    script.textContent = JSON.stringify({ imports: fresh });
    targetDocument.head.appendChild(script);
  }

  return () => {
    acquired.forEach((entry, specifier) => {
      entry.owners--;
      if (entry.owners === 0) {
        if (injectedEntries.get(specifier) === entry) injectedEntries.delete(specifier);
        entry.injection.activeEntries--;
        if (entry.injection.activeEntries === 0) entry.injection.script.remove();
      }
    });
    acquired.clear();
  };
}

/**
 * test-only helper, import map entries are irrevocable in a real document
 */
export function resetImportMapRegistry(): void {
  injectedEntries.clear();
}
