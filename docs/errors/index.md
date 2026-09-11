# Error codes and solutions

Every `QiankunError` thrown by qiankun has a stable `code` property and a solution link at the end of its message. Development and production builds retain the full message and diagnostic context without compressing error messages.

[中文](/zh-CN/errors/)

## Identify framework errors

```ts
import { loadMicroApp, QiankunError } from 'qiankun';

const microApp = loadMicroApp({ name, entry, container });

void microApp.mountPromise.catch((error: unknown) => {
  if (error instanceof QiankunError) {
    console.error(error.code, error.message);
  } else {
    console.error(error);
  }
});
```

The loader, sandbox, and shared modules use the same `QiankunError` constructor. Micro-app code, the browser, and single-spa may also throw other error types, which callers still need to handle.

## Signature

```ts
import { type QiankunErrorCode } from 'qiankun';

declare class QiankunError extends Error {
  readonly code: QiankunErrorCode;
  constructor(message: string, code?: QiankunErrorCode);
}
```

`code` defaults to `custom-error`, preserving message-only construction. The instance's `code` property is read-only. Its `message` retains the `[qiankun]: ` prefix and appends a newline followed by `See https://www.qiankunjs.com/zh-CN/errors/<code>`. Error links point to Chinese pages, each with an English counterpart.

## Code conventions

Codes use lowercase words separated by hyphens and describe the cause and remedy. The same cause shares a code across packages. Moving files, rewording a message, or adding other errors does not change existing codes. Branch on `error.code` instead of comparing complete messages. Framework call sites specify their codes explicitly; callers that omit a code receive `custom-error`.

## Code index

<!-- code-index -->

- [custom-error: Caller-defined error](/errors/custom-error)
- [lifecycle-missing: Missing lifecycle exports](/errors/lifecycle-missing)
- [entry-duplicate: Duplicate entry scripts](/errors/entry-duplicate)
- [entry-script-failed: Entry script failed to load](/errors/entry-script-failed)
- [entry-body-missing: Missing entry response body](/errors/entry-body-missing)
- [container-required: Missing app container](/errors/container-required)
- [container-head-missing: Missing container head node](/errors/container-head-missing)
- [module-hooks-conflict: Conflicting module hooks](/errors/module-hooks-conflict)
- [compartment-disposed: Disposed isolation instance](/errors/compartment-disposed)
- [module-descriptor-invalid: Invalid module descriptor](/errors/module-descriptor-invalid)
- [module-registration-sealed: Document module registration is closed](/errors/module-registration-sealed)
- [module-unresolved: Unresolved module specifier](/errors/module-unresolved)
- [module-specifier-reserved: Reserved module specifier](/errors/module-specifier-reserved)
- [module-resolve-invalid: Invalid module resolution result](/errors/module-resolve-invalid)
- [module-redirect-cycle: Module redirect cycle](/errors/module-redirect-cycle)
- [module-context-missing: Missing module load context](/errors/module-context-missing)
- [module-rewrite-invalid: Invalid module rewrite spans](/errors/module-rewrite-invalid)
