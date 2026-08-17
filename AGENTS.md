# Agent instructions (Cursor / AI assistants)

Guidance for AI agents working in this repository.

## Git — user controls all remote actions

**The user owns git. Do not commit or push unless they explicitly ask in that conversation.**

### Never without explicit approval

- `git commit` (including `--amend`)
- `git push` (any remote, any branch, including `-u`)
- `git push --force` / `--force-with-lease`
- Opening, updating, closing, or deleting a pull request
- Deleting a remote branch
- Commenting on GitHub on the user's behalf (unless they pasted the exact reply)

### Allowed without asking (local work only)

- Edit files in the working tree
- Create or switch local branches
- Stage files with `git add` **only when the user has already asked for a commit** — otherwise leave changes unstaged
- Run read-only git commands (`git status`, `git diff`, `git log`, `git branch`)
- Run checks (`npm run typecheck`, tests, etc.)

### When the user asks you to prepare a PR or commit

1. Make the code changes locally.
2. Run relevant checks.
3. Summarize what changed and which branch it is on.
4. **Stop.** Wait for explicit approval before `git commit`, `git push`, or `gh pr create`.

Phrases that count as approval: “commit this”, “push it”, “open the PR”, “yes, push to origin”.  
Phrases that do **not** count: silence, “looks good”, “prepare a PR”, “get it ready” — those mean prepare only, not commit/push.

If review feedback arrives, propose fixes locally first; do not close a PR unless the user explicitly asks to abandon it.

## Upstream contributions

This repo is a fork of [chaitanyagiri/munder-difflin](https://github.com/chaitanyagiri/munder-difflin).

- Branch from `upstream/main`, not the fork’s `main`, unless the user says otherwise.
- Keep PRs focused: one feature or fix per PR when contributing upstream.
- Do **not** include dependency upgrades, personal config, or local-only UI unless explicitly requested.
- Do **not** delete `CODE_OF_CONDUCT.md` or other project policy files.
- Follow [CONTRIBUTING.md](./CONTRIBUTING.md): `npm run typecheck`, `npm run build`, design tokens for UI, screenshots for visual changes.

## Personal / local-only data

Do not commit hardcoded personal assignments, project names, API keys, or machine-specific paths.

- **`.docs/`** is the user's personal documentation folder (gitignored). It is **not** intended for upstream PRs or the public repo — never include `.docs/` files in commits or pull requests unless the user explicitly asks.
- **Do not edit or delete files under `.docs/`** without explicit permission from the user in that conversation. Reading is fine when relevant to the task.
- Runtime/user data belongs under the app’s harness home / userData paths, not in shared components.

## Commits (when the user asks)

Write clear messages focused on *why*. Follow the user's commit message style from recent `git log`. Do not commit secrets, `.env`, or built artifacts.
