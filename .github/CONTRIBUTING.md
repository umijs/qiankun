# Contributing to qiankun

Thank you for your interest in contributing to qiankun! We welcome all types of contributions, including but not limited to:

- 🐛 Bug reports
- ✨ Feature suggestions
- 📝 Documentation improvements
- 🧪 Test cases
- 💻 Code contributions

## Getting Started

Before you begin contributing, please:

1. Read our [Code of Conduct](CODE_OF_CONDUCT.md)
2. Understand the [Developer Certificate of Origin (DCO)](https://developercertificate.org/) requirement - **all commits must be signed off**
3. Check existing [Issues](https://github.com/umijs/qiankun/issues) and [Pull Requests](https://github.com/umijs/qiankun/pulls)
4. Understand the project's technical architecture and code style

## Development Environment Setup

### Requirements

- Node.js >= 16.0.0
- pnpm@9.15.0 (we use pnpm as the package manager, exact version specified in package.json)

### Local Development

1. Fork this repository
2. Clone to local:

   ```bash
   git clone https://github.com/YOUR_USERNAME/qiankun.git
   cd qiankun
   ```

3. Install dependencies:

   ```bash
   pnpm install
   ```

4. Run tests:

   ```bash
   pnpm test
   ```

5. Build the project:
   ```bash
   pnpm run build
   ```

### Development Scripts

- `pnpm run build` - Build all packages using father
- `pnpm test` - Run tests using vitest
- `pnpm run eslint` - Code style check with TypeScript ESLint rules
- `pnpm run prettier` - Format code with prettier
- `pnpm run prettier:check` - Check code formatting
- `pnpm run ci` - Complete CI pipeline (build + lint + format check)
- `pnpm run clean` - Clean node_modules and build artifacts
- `pnpm run start:example` - Start example applications (main + react15)
- `pnpm run docs:dev` - Start documentation development server
- `pnpm run docs:build` - Build documentation
- `pnpm run prepare` - Setup husky git hooks and dumi

## Code Contribution Workflow

### 1. Create an Issue

For major features or breaking changes, please create an Issue first to discuss:

- Clearly describe the problem or feature request
- Provide relevant context information
- For bugs, provide reproduction steps

### 2. Create a Branch

Create a feature branch based on the `next` branch (default development branch):

```bash
git checkout next
git pull origin next
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

Note: The project uses `next` as the main development branch (as configured in changeset).

### 3. Code Development

#### TypeScript Code Standards

- **Strict Type Checking**:
  - Enable TypeScript strict mode (already configured in tsconfig.json)
  - Avoid using `any` type (ESLint rule enforces `fixToUnknown: true`)
  - Use `unknown` instead of `any` when type is uncertain
  - Enable all strict options: `strictNullChecks`, `strictFunctionTypes`, `noImplicitReturns`, etc.
- **Type Import/Export**:
  - Use `import type` for type-only imports (enforced by ESLint)
  - Use consistent type exports with inline type specifiers
- **Naming Conventions**:
  - Variables and functions use `camelCase`
  - Classes and interfaces use `PascalCase`
  - Constants use `UPPER_SNAKE_CASE`
  - File names use `kebab-case` or `PascalCase`
- **Comment Standards**:
  - Use clear comments to explain complex logic
  - Use JSDoc format for public APIs
  - Provide usage examples for complex type definitions
  - Add type annotations where TypeScript inference is insufficient

#### Code Style

- Follow the project's ESLint configuration
- Use 2-space indentation
- No trailing whitespace
- Keep one empty line at the end of files

#### Architecture Principles

- Follow SOLID principles
- Maintain high cohesion and low coupling
- Prefer composition over inheritance
- Ensure code testability

### 4. Write Tests

- Write corresponding test cases for new features using **vitest**
- Ensure existing tests are not broken
- Maintain reasonable test coverage
- Place test files in appropriate `__tests__` directories or alongside source files with `.test.ts` suffix
- Use vitest's global test APIs (no need to import `describe`, `it`, `expect`)
- Run tests with `pnpm test` or `pnpm -r run test` for all packages

### 5. Commit Code

#### Developer Certificate of Origin (DCO)

All commits **MUST** be signed off with the Developer Certificate of Origin (DCO). This is a legal requirement to ensure you have the right to contribute your code.

**How to sign off commits:**

1. **Manual sign-off for each commit:**

   ```bash
   git commit -s -m "feat: add new feature"
   ```

2. **Configure automatic sign-off:**

   ```bash
   git config user.name "Your Name"
   git config user.email "your.email@example.com"
   git config commit.gpgsign true # Optional: GPG signing
   ```

3. **Sign off existing commits retroactively:**

   ```bash
   # For the last commit
   git commit --amend --signoff

   # For multiple commits (rebase and sign off)
   git rebase --signoff HEAD~n # where n is the number of commits
   ```

**What is DCO?**

The DCO is a statement that you have the right to contribute the code and that you understand the licensing implications. Please read the full [DCO text](https://developercertificate.org/) for complete details. When you sign off a commit, you're confirming:

- The contribution was created by you, or you have permission to submit it
- You understand and agree that the contribution will be public
- You understand the contribution is licensed under the project's license

**Commit sign-off format:**

Each commit message must end with a "Signed-off-by" line:

```
feat(core): implement new feature

This commit adds support for custom lifecycles.

Signed-off-by: Your Name <your.email@example.com>
```

**⚠️ Important:** Pull requests with unsigned commits will be rejected. Make sure all your commits are properly signed off before submitting a PR.

#### Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages.

**Format:**

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]

Signed-off-by: Your Name <your.email@example.com>
```

**Commit Types:**

| Type       | Description             | Example                                       |
| ---------- | ----------------------- | --------------------------------------------- |
| `feat`     | New feature             | `feat(sandbox): add new isolation mode`       |
| `fix`      | Bug fix                 | `fix(loader): resolve script loading issue`   |
| `perf`     | Performance improvement | `perf(core): optimize app loading speed`      |
| `docs`     | Documentation only      | `docs: update API reference`                  |
| `style`    | Code formatting         | `style: fix ESLint warnings`                  |
| `refactor` | Code refactoring        | `refactor(utils): simplify helper functions`  |
| `test`     | Adding tests            | `test(core): add unit tests for loadMicroApp` |
| `chore`    | Build/tooling changes   | `chore: update dependencies`                  |
| `ci`       | CI configuration        | `ci: add workflow for releases`               |
| `build`    | Build system changes    | `build: configure webpack`                    |
| `revert`   | Revert previous commit  | `revert: feat(api): add user auth`            |

**Breaking Changes:**

For breaking changes, use one of these approaches:

1. Add `!` after type: `feat!: redesign loadMicroApp API`
2. Add `BREAKING CHANGE:` in footer:

   ```
   feat(api): add new authentication method

   BREAKING CHANGE: The old auth method is no longer supported.
   Migration guide: replace loadMicroApp() with registerMicroApps()
   ```

**Scope Guidelines:**

- `core`: Core qiankun functionality
- `sandbox`: Sandbox isolation
- `loader`: Resource loading
- `utils`: Utility functions
- `types`: TypeScript type definitions
- `docs`: Documentation
- `test`: Testing related
- `ci`: CI/CD related
- `build`: Build system related

### 6. Create Pull Request

1. Push your branch to your fork:

   ```bash
   git push origin feature/your-feature-name
   ```

2. Create a Pull Request on GitHub

3. PR title and description should be clear:
   - Title should briefly describe the changes
   - Description should detail:
     - Motivation and purpose of changes
     - Main changes made
     - Testing status
     - Any breaking changes
     - Related issue numbers

4. Ensure all checks pass:
   - **DCO sign-off check**: All commits must be signed off
   - ESLint code style checks with TypeScript rules
   - TypeScript strict type checks (no `any` types, strict null checks)
   - All vitest tests pass
   - Test coverage meets requirements
   - Prettier formatting checks
   - Build passes with father bundler

## Documentation Contributions

Documentation improvements are equally important:

- Fix errors or outdated information in documentation
- Improve clarity of existing documentation
- Add examples and use cases
- Translate documentation to other languages

## Bug Reports

When submitting bug reports, please include:

- **Clear Title**: Briefly describe the issue
- **Environment Information**:
  - Node.js version (>= 16.0.0)
- pnpm version (should be 9.15.0)
  - qiankun version
  - Browser version
  - Operating system
  - Framework versions (React, Vue, Angular, etc.)
  - Build tool versions (webpack, vite, etc.)
  - Related dependency versions
- **Reproduction Steps**: Detailed step-by-step instructions
- **Expected Behavior**: Describe what should happen
- **Actual Behavior**: Describe what actually happened
- **Minimal Example**: Provide minimal code that reproduces the issue
- **Relevant Logs**: Error messages, stack traces, etc.

## Feature Requests

When submitting feature requests, please:

- Clearly describe the needed functionality
- Explain why this feature is needed
- Provide use cases and examples
- Consider alternative solutions
- Discuss impact on existing APIs

## Release Process

This project uses [Changesets](https://github.com/changesets/changesets) for version management and publishing:

### For Maintainers

1. **Creating a changeset**: After merging PR, create a changeset:

   ```bash
   npx changeset
   ```

2. **Release process**:

   ```bash
   # Alpha release (for testing)
   pnpm run prerelease:alpha  # Enter pre-release mode and create changeset
   pnpm run release:alpha     # Build and publish alpha version

   # Production release
   npx changeset version      # Update package versions
   pnpm run build            # Build all packages
   pnpm run ci:publish       # Publish to npm
   ```

### Build System

- **Build Tool**: [father](https://github.com/umijs/father) - A library build tool
- **Monorepo**: pnpm workspaces with packages in `packages/` directory
- **Documentation**: [dumi](https://d.umijs.org/) for documentation site
- **Testing**: [vitest](https://vitest.dev/) for unit testing
- **Code Quality**: ESLint + Prettier + TypeScript strict mode

## Getting Help

If you have any questions, you can get help through:

- Create a [GitHub Issue](https://github.com/umijs/qiankun/issues)
- Check existing [documentation](https://qiankun.umijs.org/)
- Join our community discussions

## Acknowledgments

Thanks to all developers who contribute to the qiankun project! Your contributions make this project better.

---

Thank you again for your contribution! 🎉
