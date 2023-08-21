# axobject-query Change Log

## 1.0.1

- Changed label from structure to widget
- Added the CHANGELOG file

## 2.0.1

- Add NPM and Watchman configs

## 2.1.0

- b436e56 (origin/update-dependencies, update-dependencies) Update dependencies; ESLint to 6
- c157720 Fixes for select and datalist

## 2.1.1

- Bumping the version to see if Travis will run green on the master branch

## 2.1.2

- a1c5ef9 Updated the Copyright to 2020 for A11yance
- 5c5e04d Remove Peer Dependency to ESLint
- ec1b53b Remove dependencies on @babel/runtime and @babel/runtime-corejs3

## 2.2.0

- 9b9db89 Add the summary element as a related concept in DisclosureTriangleRole
- 7ac02af Fix the build script for the src files
- 56e0765 Fix permissions on files from 755 to 644

## 3.0.0

Map and Set usages are now replaced with object and array literals.

These are the changes in usage you might need to account for:

- The module exports are no longer Maps, so you cannot spread them directly into an array to access their items. Use the `entries` method to get access to the items.
- The `keys` and `values` methods now return arrays, not iterators.
- There is no `forEach` method. One could be added in the future, but at present, it does not exist on the exports.

### Commits of note

- 320fdeb Bump flow-bin from 0.160.2 to 0.161.0
- 5453702 Update package and package-lock
- a156de9 Removed Map and Set; added a common interface to all the objects
- c7cc81c Update tests to include content
- 04aecf3 Update eslint-plugin-flowtype to ^6.1.0
- 06bfa38 Update babel-jest to ^27.2.2
- 9d65129 Bump eslint-plugin-import from 2.22.1 to 2.24.2
- 6aa1334 Bump @babel/preset-flow from 7.12.1 to 7.14.5
- 7432325 Bump coverallsapp/github-action from 1.1.2 to 1.1.3
- 55b1672 Update @babel/preset-env to ^7.15.6
- 46d9e06 Update Jest to ^27.2.2
- 3cde0ef Update ESLint versions to include ^7
- 29f18c5 Update package-lock.json
- 735763d Bump expect from 26.6.2 to 27.2.2
- 95606c8 Update flow-bin
- 045e61a Update flow and eslint configs
- 146dad2 Bump tmpl from 1.0.4 to 1.0.5
- 15004bd Bump @babel/cli from 7.12.10 to 7.15.7
- 0512101 Bump @babel/core from 7.12.10 to 7.15.5
- 8d2937d Bump path-parse from 1.0.6 to 1.0.7
- be20a4f Switch to Github Actions from TravisCI
- c35af61 Change Travis config from master to main branch

## 3.1.0 / 3.1.1

This minor release introduces iteration support to the primary objects of the module, through the `Symbol.iterator` property. This reintroduces the native `Map` iteration support that was lost in the v3 update. A `forEach` method is also introduced in this update. The common interface of all objects exposed by this module is now:

```
type TAXObjectQueryMap<E, K, V> = {
  entries: () => E,
  forEach: ((V, K, E) => void) => void,
  get: (key: K) => ?V,
  has: (key: K) => boolean,
  keys: () => Array<K>,
  values: () => Array<V>,
  @@iterator?: () => Iterator<E>,
};
```

### Commits of note

  - f47ab5f Update dependencies to current minor releases
  - 763f0c9 Introduce iteration support to the Maps in the module
  - 0077265 Update dependencies to new major versions
  - c8b8a2b Use @babel/eslint-parser instead of babel-eslint project
  - f27196b Use default NPM caching in Github Actions

## 3.2.0

Commit 22915be contains a substantial audit and update of the project to match the ARIA spec. Testing coverage was substantially improved. It really locks down the project's output.

  - d7f9071 Switch to dequal to remove 45 transitive dependencies
  - 22915be Refreshing HTML mappings according to the HTML Accessibility API Mappings

## 3.2.1

  - f250e99 Update package-lock.json
