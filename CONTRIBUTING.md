# Contribution Guide

We're truly delighted that you're interested in contributing to qiankun. Before submitting your code, please take some time to read through the following guidelines:

## 1. Install Node.js and pnpm

Visit [nodejs.org](https://nodejs.org/) to download and install the latest stable version suitable for your operating system. Install pnpm: [pnpm.io/installation](https://pnpm.io/installation)

## 2. Fork and check out your own repository

Go to [github.com/umjs/qiankun](https://github.com/umjs/qiankun), click the “Fork” button. Then follow the [GitHub documentation](https://help.github.com/articles/fork-a-repo) to fork and clone.

Clone your own fork:

```shell
git clone https://github.com/<Your Github Username>/qiankun
```

This step requires an internet connection as it will download many dependencies.

**Note**: Every time you pull the code from the main repository, re-running `pnpm install` helps ensure you are using the latest development dependencies.

## 3. Modify the code & supplement/update test cases

Test code is located in `__tests__/`, and the testing framework used is [vitest](https://vitest.dev/).

## 4. Execute tests

Before submitting your code, make sure the test tasks pass✅.

```shell
pnpm run ci
```

## 5. Commit changes

qiankun uses [conventional commits](https://www.conventionalcommits.org/).

## 6. Execute changeset (optional)

If your changes include functional changes, please run:

```shell
pnpm changeset
```

qiankun adheres to [semantic versioning](https://semver.org/). Choose the type corresponding to your changes:

- major: Incompatible API changes
- minor: Add features in a backward-compatible manner
- patch: Backward-compatible bug fixes

## 7. Submit pull request
