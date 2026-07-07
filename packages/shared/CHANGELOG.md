# @qiankunjs/shared

## 1.0.0-rc.14

### Major Changes

- refactor(webpack-plugin): refactor QiankunPlugin webpack for more bundler support later (#3103)

### Minor Changes

- feat: playwright e2e infrastructure + sandbox/loader fixes it surfaced (#3135)
- feat: remove lru-cache and move wrapFetch to shared package (#2796)
- feat(loader): compatible with defer entry script (#2801)
- feat: remove webpack chunk cache attributes just while there are multi instances loaded on document (#2873)
- feat: improve fetch error message by prepending url (#3105)
- feat(sandbox): support dynamic sync scripts executed by order in sandbox (#2776)
- feat(transpiler): assets transpiler should work well while sandbox disabled (#2793)
- feat: change script src before it execute thus we can be more consistent with the native browser logic (#2805)
- feat(loader): add lru cache for assets fetch by default (#2794)
- feat: add isRuntimeCompatible api to check qiankun3 compatibility (#2778)
- feat: runtime style isolation with @scope for micro-app CSS sandboxing (#3123)
- feat: support defer scripts and keep the executing order to consist with browser (#2811)
- feat: support huge inline-script who might be split into multiple chunks during transfer (#2878)
- feat: support ESM sandbox (#3133)
- feat: modernize examples on current tech stacks (+4 sandbox/loading fixes it surfaced) (#3138)
- feat(shared): introduce retryable and throwable to fetch-utils (#2921)
- feat: extract NodeTransformer type to shared package (#2808)

### Patch Changes

- fix: should not transform url which have entired protocol already (#3110)
- fix: move cheerio to dependencies (#2867)
- fix: optimize types and add a warning for preload (#2844)
- fix: fix eslint error (#2740)
- fix(ci): git url
- refactor(shared): replace semver with compare-versions (#3107)
- fix: remove inline script source-url (#2850)
- fix: defer scripts should wait until html loaded (#2816)
- fix(esm-sandbox): rewrite modulepreload as preload-as-fetch to align with classic path (#3136)
- fix: dynamic append element should support for the same container between micro apps (#2825)

## 0.0.1-rc.13

### Patch Changes

- 7d8591e: refactor(shared): replace semver with compare-versions
- 57a6129: feat: improve fetch error message by prepending url
- 34069e1: fix: should not transform URLs that already include a protocol

## 0.0.1-rc.12

### Patch Changes

- ea18ce6: feat(shared): introduce retryable and throwable to fetch-utils

## 0.0.1-rc.11

### Patch Changes

- 56fef69: feat: remove webpack chunk cache attributes just while there are multi instances loaded on document
- 99bf65f: feat: support huge inline-script who might be split into multiple chunks during transfer

## 0.0.1-rc.10

### Patch Changes

- a826cf5e: fix: remove inline script source-url
- 3e43a111: fix: optimize types and add a warning for preload
- feb544f0: fix: dynamic append element should support for the same container between micro apps

## 0.0.1-rc.9

### Patch Changes

- bd12dbad: fix: defer scripts should wait until html loaded

## 0.0.1-rc.8

### Patch Changes

- 98b071bf: feat: support defer scripts and keep the executing order to consist with browser

## 0.0.1-rc.7

### Patch Changes

- f2af2e36: feat: extract NodeTransformer type to shared package

## 0.0.1-rc.6

### Patch Changes

- 54b0878e: feat(loader): compatible with defer entry script
- 7ba95cf2: feat: change script src before it execute thus we can be more consistent with the native browser logic
- 312abbc7: feat: remove lru-cache and move wrapFetch to shared package
- 6f074136: feat(transpiler): assets transpiler should work well while sandbox disabled

## 0.0.1-rc.5

### Patch Changes

- 5f77347b: feat(sandbox): support dynamic sync scripts executed by order in sandbox
- 8e54e129: feat: add isRuntimeCompatible api to check qiankun3 compatibility

## 0.0.1-rc.4

### Patch Changes

- 76b6bff7: 🐛 compatible with webpack chunk cache logic

## 0.0.1-rc.3

### Patch Changes

- Updated dependencies [39301f19]
  - @qiankunjs/sandbox@0.0.1-rc.3

## 0.0.1-rc.2

### Patch Changes

- b23d3d7b: 🐛fix preload is invalid while reused dependency is working
  - @qiankunjs/sandbox@0.0.1-rc.2

## 0.0.1-rc.1

### Patch Changes

- ebb2bcaa: 🐛fix findDependency logic while peerDeps is undefined
  - @qiankunjs/sandbox@0.0.1-rc.1

## 0.0.1-beta.6

### Patch Changes

- ffd77800: ✨support to transform head/body tags to qiankun head/body in stream
- Updated dependencies [ffd77800]
  - @qiankunjs/sandbox@0.0.1-beta.6

## 0.0.1-alpha.5

### Patch Changes

- fcb49aad: ✨add peerDependencies to micro app dependencies
- 065d2c54: 🐛fix the async mode detect bug
- 931dc1f7: 🎨 optimize code
  - @qiankunjs/sandbox@0.0.1-alpha.5

## 0.0.1-alpha.4

### Patch Changes

- 62d3b482: 🏷️ fix typings temporary
- ⚡️ support preload with dependencies reusing
  - @qiankunjs/sandbox@0.0.1-alpha.4

## 0.0.1-alpha.3

### Patch Changes

- e12d29ae: 💡add TODO comments
- daaa9ccc: ✨support code block in sandbox
- Updated dependencies [daaa9ccc]
  - @qiankunjs/sandbox@0.0.1-alpha.3

## 0.0.1-alpha.2

### Patch Changes

- 33e65888: fix: changeset
- Updated dependencies [33e65888]
  - @qiankunjs/sandbox@0.0.1-alpha.2

## 0.0.1-alpha.1

### Patch Changes

- Updated dependencies
  - @qiankunjs/sandbox@0.0.1-alpha.1

## 0.0.1-alpha.0

### Patch Changes

- 3.0 alpha
- Updated dependencies
  - @qiankunjs/sandbox@0.0.1-alpha.0
