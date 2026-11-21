# pstack reference

Start with the [README](../README.md) for installation and your first task.

## Slash commands

The package includes 67 skill directories: 43 public skills and 24 `principle-*` references. Claude Code uses `/pstack:<name>`. In Codex, select the skill by name.

Find each skill's instructions in the [skills tree](../plugins/pstack/skills/).

| command | use it when |
| --- | --- |
| `/poteto-mode` | default entry point for any non-trivial task |
| `/how` | walk through how a subsystem works |
| `/why` | investigate why something was built this way (parallel multi-MCP evidence) |
| `/architect` | settle types and module shape before writing code that crosses a function boundary |
| `/arena` | run N parallel attempts at the same task and pick the best parts |
| `/interrogate` | have three different models try to break a diff |
| `/automate-me` | draft your own personal -mode skill from recent transcripts |
| `/reflect` | capture a long task's lessons as a skill edit |
| `/correct` | find the mistakes agents keep repeating in a repo and make each one impossible, enforced at the highest level that works |
| `/tdd` | fix a bug by writing the failing test first, then the fix |
| `/benchmark-checklist` | vet a measured speedup or regression (limiter, tuning, errors, repeat runs, end-to-end relevance) before you report or act on it |
| `/typescript-best-practices` | ground type-system discipline in TypeScript syntax |
| `/teach` | explain a subsystem plainly by composing how + why |
| `/swarm` | fan out N parallel workers across slices or races, then return one aggregated report |
| `/technical-writing` | write docs, RFCs, readmes, PR descriptions, and commit messages to one layered standard |
| `/bro` | restate the last message in plain human language, no jargon |
| `/in-your-own-words` | play back your goal and the problem before the agent starts |
| `/sharpen` | make a task deeper, not bigger, by naming what a top expert would do and what would show the result is right, then rewrite the prompt to ask for that |
| `/figure-it-out` | design a rigorous, auditable playbook for a task no bundled playbook fits |
| `/show-me-your-work` | log decisions to a reviewable tsv decision trail |
| `/blast-radius` | find what a change could break beyond the diff and prove safety by running code |
| `/recall` | catch up on recent working context from chat history, live state, and the shared record |
| `/ketchup` | catch up on everything in this chat since your last message, with an executive summary for each action item |
| `/ketchup-video` | get the `/ketchup` catch-up as a short silent video of slides, with the calls waiting on you as text under it |
| `/setup-pstack` | configure pstack per-role model choices |
| `/poteto-help` | answer a question about pstack with the prompt to send and the file the answer came from |
| `/unslop` | clean up writing by removing AI tells |
| `/no-comments` | strip comments before review, fix the accepted findings, encode claimed constraints |
| `/create-verification-skill` | generate a project-local verification skill and feature map |
| `/maintain-verification-skill` | re-sync a drifted verification skill and its feature map |
| `/create-formal-verification-skill` | generate a project-local skill that formally verifies one high-risk property |
| `/maintain-formal-verification-skill` | re-sync a formal verification after the code it covers changed |
| `/statechart` | check a TLA+ model and draw it as a Mermaid statechart, with the shortest path to each state that breaks a rule |
| `/deslop` | deslop a diff before commit |
| `/babysit` | monitor an open PR, fix CI/comments, keep it merge-ready |
| `/thermo-nuclear-review` | audit a branch's changes for bugs, breakage, security issues, devex regressions, and feature-gate leaks |
| `/thermo-nuclear-code-quality-review` | extremely strict maintainability audit |
| `/thermos` | run both thermo-nuclear reviews as parallel subagents and synthesize their findings |
| `/make-pr-easy-to-review` | clean noisy history and improve PR description before review |
| `/fix-ci` | find failing PR checks, inspect logs, apply focused fixes |
| `/fix-merge-conflicts` | non-interactively resolve merge conflicts, validate, finalize |
| `/get-pr-comments` | fetch and summarize review comments from the active PR |
| `/what-did-i-get-done` | summarize authored commits over a user-chosen period |

## Runtime support

Claude Code and Codex share [one skills tree](../plugins/pstack/skills/). It includes the skills, scripts, agent references, and licenses.

| Runtime | Setup and recorded verification |
| --- | --- |
| Claude Code | Install the marketplace plugin (Claude Code 2.1.292 or later). Skills use Claude tool names and model defaults; the plugin installs automatic routing. |
| Codex | Install the native plugin through the repository's marketplace and trust its hook through `/hooks`. The [Codex mapping](../plugins/pstack/skills/poteto-mode/references/codex-tools.md) translates Claude tools and model names. Shared skill symlinks were also detected in a live session. |

These checks cover skill discovery. Delegation remains unverified on Prime Agent and Gemini CLI, as do their multi-model workflows. On those runtimes, agents must adapt Claude-specific tools, models, and configuration. Each mapping applies only to its runtime.

### Automatic routing


- It touches more than one file or changes a signature other files call.
- It involves a design or architecture choice.
- It concerns a bug with an unknown cause or a performance issue.

Smaller tasks proceed directly. The full skill loads when invoked, and explicit user instructions take precedence.

Run `setup-pstack` to turn off routing. Set `PSTACK_SESSION_HOOK=off` to turn it off for the current environment.

Skills-only installs and other runtimes do not include these integrations. Request `poteto-mode` explicitly, or add a standing instruction to the runtime's instruction file.

### Codex

The [native plugin manifest](../plugins/pstack/.codex-plugin/plugin.json) points to the shared skills directory and the Codex [SessionStart hook](../plugins/pstack/hooks/codex-hooks.json). The [marketplace catalog](../.agents/plugins/marketplace.json) lists `pstack` in the `pstack-claude` marketplace. Review and trust the hook, listed as `Loading pstack routing`, through `/hooks`; Codex asks again when its definition changes.

The [README installation](../README.md#codex) registers that catalog with `codex plugin marketplace add`, then installs the plugin with `codex plugin add`. These commands match the help output from `codex-cli 0.154.0-alpha.6.2`. A fresh native installation was not tested for this documentation change.

OpenAI documents [marketplace registration and the plugin format](https://developers.openai.com/plugins/build/plugins#add-a-marketplace-from-the-cli). If your CLI lacks `plugin add`, use the plugin browser after registering the marketplace, or use the [skills-only installation](#shared-skills-installation).

Invoke a skill the two ways [Codex's skills documentation](https://developers.openai.com/codex/skills) gives. Type `$` and the skill's name, such as `$poteto-mode` or `$babysit`, and choose its entry, or pick it from `/skills`. In a plugin install the entry reads `poteto-mode (pstack)` and inserts `$pstack:poteto-mode`. A skills-only install has no `pstack:` prefix. To enable parallel subagents:

```toml
[features]
multi_agent = true
```

Add this setting to `~/.codex/config.toml` if subagents are disabled. Skills such as `arena`, `interrogate`, and `architect` use parallel agents. The [mapping](../plugins/pstack/skills/poteto-mode/references/codex-tools.md) describes a sequential fallback and translates Claude tool names, model defaults, and verification instructions.

## Configuration and dependencies

Invoke [setup-pstack](../plugins/pstack/skills/setup-pstack/SKILL.md) to choose models for each role. It detects available models, confirms the choices, and writes an override sheet. Its [runtime table](../plugins/pstack/skills/setup-pstack/references/runtimes.md) names the sheet path and loading mechanism for each runtime. Defaults live in [models.json](../plugins/pstack/models.json).

For design comparisons and reviews, choose distinct models available to your runtime. The default panel uses different Claude models.

Install dependencies for the workflows you use:

| Dependency | When you need it |
| --- | --- |
| GitHub CLI, `gh` | PR monitoring and shipping. The bundled `watch-pr` requires GitHub CLI 2.48 or later to read all pages of check suites. `watch-pr` and `ship-pr` read pull requests through GitHub GraphQL, which a Claude Code cloud session refuses. There `watch-pr` stops with exit 7 on its first read, and an agent can read the PR over REST with `gh api repos/<owner>/<repo>/pulls/<number>`. Authenticate with `gh auth login`. The playbooks use Origin's CLI, `origin`, instead when it can resolve the repository. |
| Bun | The bundled `watch-pr` scripts. Their bootstrap installs script dependencies on first run. |
| `plugin-dev` | Claude Code skill-authoring guidance used by `automate-me`, `reflect`, and `poteto-mode`. |

Install the Claude Code skill-authoring companion with:

```text
/plugin marketplace add anthropics/claude-plugins-official
/plugin install plugin-dev@claude-plugins-official
```


Playbooks use the runtime's task-tracking tools or an uncommitted `todo.md` checklist. For Claude Code, the repository documents `CLAUDE_CODE_ENABLE_TODO_TOOLS=1`; see [platform adaptation](../plugins/pstack/skills/poteto-mode/SKILL.md#platform-adaptation).

Use [create-verification-skill](../plugins/pstack/skills/create-verification-skill/SKILL.md) to record how the agent should run and check your project, following the [driver policy](../plugins/pstack/skills/poteto-mode/SKILL.md#non-negotiables).

## Maintenance

### Repository layout

```text
.claude-plugin/marketplace.json    Claude Code marketplace
.agents/plugins/marketplace.json  Codex marketplace
package.json                      Development dependencies
plugins/pstack/
  .claude-plugin/plugin.json      Claude Code plugin manifest
  .codex-plugin/plugin.json       Codex plugin manifest
  skills/                        Shared skills, references, and scripts
  agents/                        Claude Code subagent definitions
  hooks/                         Startup routing for Claude Code and Codex
tools/                           Generation, validation, and upstream sync
tests/                           Repository checks
```

Skills-only installs use `plugins/pstack/skills/`. Agent references and license files are included under `poteto-mode/references/`.

### Generated files and checks

The [generator](../tools/generate.mjs) updates versions, model defaults, Codex preambles, and portable references.

[Documentation fact tests](../tests/readme-facts.test.mjs) check the skill counts and upstream pin. The table parser requires the header `| command | use it when |`.

Run the generator and repository tests with Bun:

```shell
bun install --frozen-lockfile
bun tools/generate.mjs
bun test tests/
```

The install step reads the root `bun.lock` and fetches `typebox` for manifest validation.

CI also checks shell scripts, workflows, Markdown, relative links, and the bundled Bun tools. See [local checks](../CONTRIBUTING.md#things-that-will-fail-ci) for commands and [release instructions](../CONTRIBUTING.md#releasing) for versioning and the live Claude Code command check.

### Port scope and attribution

The skill tree is synced against upstream `0b46ec3` (v0.15.46). The thermos skills and agents are synced against `118e73b` (thermos 1.0.0).

This repository ports Lauren Tan's pstack from Cursor to Claude Code and shares the skills with other runtimes. It includes six cursor-team-kit skills, the three thermos skills with their two review subagents, and an independently authored `babysit` skill. The port supplies Claude Code plugin registration and routing, Codex manifests, the Codex tool mapping, the Pi package, extension, and tool mapping, the GitHub Copilot hooks and tool mapping, and the Muse native plugin, routing hook, and tool mapping.

Cursor-specific automations, sticky-mode metadata, the Grok Bot UI workflow, and the Cursor UI tutorial are excluded. [tools/upstream.json](../tools/upstream.json) records the revisions and exclusions, [tools/substitutions.json](../tools/substitutions.json) holds the Cursor-to-Claude rewrite rules, and [CHANGES.md](../CHANGES.md) records each release. The bundled `thermo-nuclear-code-quality-review` provides a maintainability review when a workflow calls for one, `thermo-nuclear-review` a correctness and security audit, and `thermos` runs both as parallel subagents.

For skill changes, follow the [sync boundary](../CONTRIBUTING.md#the-sync-boundary). Runtime adaptations and workflow changes both land here, and a workflow change is declared as a fork.

See the [license summary](../README.md#license) for licenses and full-plugin attribution. [NOTICE-skills.md](../NOTICE-skills.md) is the notice for skills-only installations.
