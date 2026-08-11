# Agent skill

qiankun ships an agent-facing usage manual in the [Agent Skills](https://github.com/vercel-labs/skills) format, distributed straight from the main repository. Once installed, coding agents such as Claude Code and Cursor can create host and micro-apps for you following the official conventions, or convert an existing Vite application into a micro-app.

The skill is maintained alongside this documentation: the projects an agent generates match what the [tutorial](/tutorial/) builds by hand — the skill simply hands that contract to the agent to execute.

## Install

Run this in the directory where you plan to create projects:

```bash
npx skills add umijs/qiankun
```

The command fetches the skill named `qiankun` from the qiankun repository and installs it into your agent's skill directory (for example `.claude/skills/`). The repository always distributes the version that matches the latest documentation, so there is no skill version to manage.

## Use

After installing, describe your goal to the agent in natural language, for example:

> Use qiankun to create a React host app (port 7099) and a Vue micro-app (port 7101)

Following the skill's instructions, the agent will:

- create the projects with create-vite (React or Vue, TypeScript or JavaScript);
- micro-app: install `@qiankunjs/bundler-plugin`, register the Vite plugin with a fixed port, and rewrite the entry module to export the `bootstrap` / `mount` / `update` / `unmount` lifecycles while keeping the standalone branch;
- host app: install `qiankun` plus the optional React/Vue `MicroApp` component binding, and wire up the loading code;
- start both dev servers and verify that the micro-app runs standalone and can be mounted and unmounted by the host.

## Coverage

The current version covers project creation: scaffolding new host/micro-apps and converting existing Vite applications. For every other topic — migration, style isolation, troubleshooting — consult the corresponding sections of this site.

## Related

- [Getting started](/guide/getting-started)
- [Tutorial: build a main app and a micro-app](/tutorial/)
- [Prepare a Vite micro-app](/cookbook/prepare-a-vite-app)
- [@qiankunjs/bundler-plugin](/ecosystem/bundler-plugin)
