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

const injectedEntries = new Map<string, string>();

export function injectImportMapEntries(entries: Record<string, string>, targetDocument: Document = document): void {
  const fresh: Record<string, string> = {};
  let freshCount = 0;

  keys(entries).forEach((specifier) => {
    const target = entries[specifier];
    const existing = injectedEntries.get(specifier);
    if (existing !== undefined) {
      if (existing !== target) {
        console.error(
          `[qiankun] import map entry ${specifier} -> ${target} conflicts with the injected ${existing}, the browser keeps the first one (first-wins). This indicates an instance key collision, please file an issue.`,
        );
      }
      return;
    }
    injectedEntries.set(specifier, target);
    fresh[specifier] = target;
    freshCount++;
  });

  if (!freshCount) return;

  const script = targetDocument.createElement('script');
  script.type = 'importmap';
  script.dataset.qiankun = 'esm';
  script.textContent = JSON.stringify({ imports: fresh });
  targetDocument.head.appendChild(script);
}

/**
 * test-only helper, import map entries are irrevocable in a real document
 */
export function resetImportMapRegistry(): void {
  injectedEntries.clear();
}
