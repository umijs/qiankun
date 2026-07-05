---
"@qiankunjs/shared": patch
---

fix(esm-sandbox): rewrite modulepreload links to `rel="preload" as="fetch"` instead of suppressing them, aligning with the classic script path so the browser-issued warm-up request is preserved and reused by the rewrite pipeline via the preload cache
