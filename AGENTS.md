# Agent instructions (Cursor / AI assistants)

Guidance for AI agents working in this repository.

## Pull requests — ask first

**Never open, update, close, or delete a pull request without explicit user approval.**

Before any GitHub PR action, stop and ask the user in chat. This includes:

- Creating a new PR
- Pushing a branch intended for upstream review
- Reopening or closing an existing PR
- Deleting a PR branch on the remote
- Force-pushing to a PR branch
- Commenting on behalf of the user (unless they pasted the exact reply)

When the user asks to prepare a PR, do the branch/commit work locally, run checks, summarize what will be included, and **wait for an explicit “yes, open it”** (or similar) before running `gh pr create`, `gh pr close`, or equivalent.

If review feedback arrives, propose fixes locally first; do not close the PR unless the user explicitly asks to abandon it.

## Upstream contributions

This repo is a fork of [chaitanyagiri/munder-difflin](https://github.com/chaitanyagiri/munder-difflin).

- Branch from `upstream/main`, not the fork’s `main`, unless the user says otherwise.
- Keep PRs focused: one feature or fix per PR when contributing upstream.
- Do **not** include dependency upgrades, personal config, or local-only UI unless explicitly requested.
- Do **not** delete `CODE_OF_CONDUCT.md` or other project policy files.
- Follow [CONTRIBUTING.md](./CONTRIBUTING.md): `npm run typecheck`, `npm run build`, design tokens for UI, screenshots for visual changes.

## Personal / local-only data

Do not commit hardcoded personal assignments, project names, API keys, or machine-specific paths.

- Local notes belong under `.docs/` (gitignored).
- Runtime/user data belongs under the app’s harness home / userData paths, not in shared components.

## Commits

Only create git commits when the user asks. When committing, write clear messages focused on *why*.
