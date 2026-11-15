# Simplify coding-agent support

The owner confirmed Claude Code and Codex as the only supported coding agents. This document specifies a future migration restricted to `/Users/kevin/projects/sonny-skills/plugins/pstack`. It does not authorize removal of installed tools or changes to user configuration.

## Intended outcome

A user installs a selected plugin once, loads its skills, and follows one documented setup path for their supported agent. A maintainer changes a workflow in one skill tree and verifies only the integrations the repository promises to support.

The supported set is Claude Code and Codex, confirmed by the owner on 2026-11-15. Apply that policy only to this pstack bundle. Superpowers, SWE Skills, collection-root catalogs, and distribution scripts are outside scope. The [implementation plan](../plans/2026-11-15-claude-codex-only.md) sequences pstack baseline capture, runtime removal, and final verification.

## Observed design

The analysis used the working tree on 2026-11-15. Existing edits to the root Codex marketplace and the untracked root MCP configuration predate this task.

| Area | Evidence | Consequence |
| --- | --- | --- |
| Shared skill content | [Canonical skill tree](../../plugins/pstack/skills), [contributor guidance](../../CONTRIBUTING.md) | The tree is already shared. Creating another common-skills layer would add complexity. |
| Primary workflow language | [poteto-mode](../../plugins/pstack/skills/poteto-mode/SKILL.md) | Skills use Claude tool names and direct other agents through mappings. |
| Runtime registration | [Runtime definitions](../../tools/runtimes.mjs) | Codex, Pi, and Copilot each affect generation and validation in addition to Claude support. |
| Model configuration | [models.json](../../plugins/pstack/models.json) | Shared roles coexist with Claude aliases, Codex examples, and Pi provider mappings. |
| Generated content | [Generator](../../tools/generate.mjs), [reference](../reference.md) | Runtime support changes skill preambles, model sections, agents, prompts, manifests, and portable assets. |
| Pi integration | [Package manifest](../../package.json), [extension](../../plugins/pstack/pi) | Supporting Pi includes implementing agent execution and interaction tools. |
| Copilot integration | [Reference](../reference.md), [setup skill](../../plugins/pstack/skills/setup-pstack/SKILL.md) | Supporting Copilot adds first-run setup, saved model checks, and tool enforcement. |
| Broader support claims | [Bundle README](../../README.md) | Prime Agent, OpenCode, and Gemini CLI have shared-skills installation claims without equivalent native integration here. |
| Upstream synchronization | [Sync configuration](../../tools/upstream.json), [fork declarations](../../tools/forks.json) | Local policy and port changes must survive later upstream imports. |
| Collection installation | [Collection README](../../../../README.md), [Claude catalog](../../../../.claude-plugin/marketplace.json), [Codex catalog](../../../../.agents/plugins/marketplace.json) | Catalogs and prose disagree about pstack's current version and Codex availability. |

The collection layout check currently fails with `AssertionError: duplicate or missing entries in .agents/plugins`. The root Codex catalog points at `./plugins/pstack`, while the native manifest lives under `./plugins/pstack/plugins/pstack`. The Claude catalog points at that nested runtime. This is an existing failure, not a result of this documentation task.

The collection README describes pstack as lacking a native Codex manifest. The current nested pstack bundle contains one. Its skills-only example also points to a different directory than the canonical tree above. Catalog repair is outside this migration. Verify pstack through its bundle-local marketplace or package path and record the collection mismatch as an external limitation.

The inference from these files is that tool emulation, packaging, and repeated runtime guidance drive much of the maintenance burden. This investigation did not measure usage, maintenance hours, or prompt-token savings. It does not establish that removing agents alone resolves every source of complexity.

## Choices and tradeoffs

| Choice | User effect | Maintenance effect | Recommendation |
| --- | --- | --- | --- |
| Codex only | Claude users lose a maintained installation path. | Removes Claude agents, hooks, and tool-language translation after a Codex-native rewrite. | Choose if personal Codex use is the sole requirement. |
| Claude Code only | Codex users lose a maintained installation path. | Closest to current workflow language and therefore the smallest migration. | Choose if Claude is the sole requirement. |
| Claude Code and Codex | Both retain maintained installation and workflow paths. | Keeps one translation boundary while removing Pi, Copilot, and speculative support. | Confirmed choice. |
| Generic skills for every agent | Users translate tool and model behavior themselves. | Preserves ambiguous compatibility promises and pressure to add fallbacks. | Reject. |

A model provider is not a coding agent. Removing Gemini CLI does not forbid Gemini models in a retained agent. Removing Pi does not require removing parallel review or multi-model workflows.

## Scope and non-goals

The migration changes pstack runtime integrations, runtime-specific prose, generation, packaging, tests, and bundle-local installation documentation. Every edited, created, moved, or deleted tracked file must remain inside the approved pstack directory. Do not change collection-root catalogs, scripts, tests, or sibling plugins.

Preserve workflow semantics, public skill names, explicit skill invocation, model-role overrides, parallel workflows, verification requirements, and attribution. Preserve independent plugin ownership. Keep personal skills and drafts outside bundled plugin directories.

Do not merge Superpowers, SWE Skills, and pstack. Do not deduplicate their workflow catalogs in this migration. Do not redesign the principle system, reduce the number of workflows, rewrite shipping policy, or remove formal-verification assets merely because they are substantial. Those are separate behavior decisions.

Do not publish, push, or alter user home directories. Do not silently uninstall plugins from existing agent installations.

## Required behavior

1. Official support means a documented installation path, valid package metadata, and verification of skill loading and core workflow execution on that agent.
2. Advertise only the selected agents. Remove general claims that other agents work through a universal shared-skills install.
3. Keep one canonical pstack skill tree. Both retained installations consume that tree without maintaining hand-edited per-agent copies.
4. Resolve agent differences at a documented boundary. With two agents, keep Claude-native workflow language and one Codex mapping for the initial migration. Remove Pi and Copilot mappings and their injected preambles.
5. A directly invoked Codex skill must receive enough mapping guidance to execute correctly without loading poteto-mode first. Retain concise Codex preambles where required by direct invocation.
6. Keep role names and the current override precedence stable during the removal. Remove only unsupported-agent configuration keys and dispatch rules. Do not interpret a Claude alias as a literal Codex model ID.
7. Keep explicit invocation usable when automatic routing is disabled. Retained hooks must respect the existing routing-off preference.
8. Retain clear behavior when delegation or model diversity is unavailable. Report the capability limitation using the retained mapping's policy. Do not add a tool emulator or silently claim independent review occurred.
9. Generated output must be reproducible. Checking it must not rewrite the working tree.
10. Every installed reference, script, hook, and manifest must resolve within its owning plugin. Collection catalogs may point into that plugin.
11. Updating from upstream must not recreate removed integrations or unsupported installation claims unnoticed.
12. Old installations remain the user's responsibility. Release notes identify the final release before removal and explain that later releases no longer maintain those agents.

## Removal and retention boundaries

Paths in this table are relative to the pstack bundle root unless stated otherwise.

| Component | Required treatment |
| --- | --- |
| `plugins/pstack/pi/`, `tools/pi-package.mjs`, `tools/typecheck-pi.mjs` | Delete Pi-only implementations and their callers. |
| `tests/pi/`, `tests/pi-package.test.mjs`, `tests/pi-equivalence.test.mjs`, `docs/pi-equivalence.md` | Remove with the Pi runtime. Preserve any genuinely shared assertion in the appropriate retained suite. |
| `package.json`, `bun.lock` | Remove Pi package metadata and dependencies used solely by Pi. Retain package tooling if other checks need it. Regenerate the lockfile rather than deleting it by assumption. |
| `plugins/pstack/.github/plugin/` | Delete Copilot plugin metadata. Preserve unrelated GitHub automation. |
| Copilot hooks and setup material | Remove Copilot-only hook files, branches, model-sheet behavior, smoke scripts, and tests after checking shared consumers. Keep Claude and Codex hook behavior. |
| `pi-tools.md`, `copilot-tools.md` under poteto-mode references | Delete mappings and all active inbound references. |
| `tools/runtimes.mjs` | Remove Pi and Copilot entries, rendering, and validators. Retain a small explicit Codex boundary. Do not replace the table with a configurable plugin system. |
| `tools/generate.mjs` | Remove unsupported-runtime regions and validators. Keep version checks, retained agent output, link checks, and model-role consistency. |
| `plugins/pstack/models.json` | Remove Pi provider maps. Preserve retained roles and Codex examples until a separate model-policy change. |
| `plugins/pstack/.claude-plugin/`, `.codex-plugin/`, `agents/`, retained hooks | Keep and verify for the selected agents. Remove a directory only if its agent is dropped. |
| `tools/upstream.json`, `tools/substitutions.json`, `tools/forks.json` | Record the intentional removal and update ownership rules so sync preserves the target design. |
| README, reference, contributor guidance, generated assets | Replace install matrices with only the supported paths. Remove unsupported setup instructions and stale screenshots when misleading. |
| Historical changelogs and license notices | Preserve history and legally required attribution. Historical mentions are allowed. |
| Collection catalogs, packaging scripts, layout checks | Outside scope. Record deferred integration work without editing these files. |

The Copilot-only hook candidates are `copilot-hooks.json`, `copilot-context.awk`, `session-start-copilot.md`, `session-start-copilot-sheet.md`, `session-start-copilot-setup.md`, `pre-tool-use.sh`, and `pre-tool-use.awk`. Its exclusive test candidates are `copilot.test.mjs`, `copilot-smoke.sh`, `copilot-tui.py`, and `pre-tool-use.test.mjs`. Confirm shared callers before deletion. Inspect `json.awk`, `script-contracts.awk`, and setup sheet validators separately because their ownership can be shared. A filename containing `session` or `agent` is not sufficient evidence that the file belongs to a removed integration.

## Target structure

For the first migration, retain the existing nested runtime root at `plugins/pstack/plugins/pstack/` relative to the collection root. Removing agent support already crosses generation, hooks, configuration, and tests. Moving all runtime files simultaneously would obscure which failures came from deletion.

The bundle root continues to own maintenance tools, tests, documentation, and licenses. Its nested runtime root owns the installed skills, agents, hooks, and the two retained plugin manifests. The collection root owns marketplace registration and distribution scripts.

Keep the nested runtime root throughout this migration. Flattening would require changing collection catalogs outside the approved directory. It is excluded from this plan.

The target has no new runtime-selection framework, generated full skill copies, adapter SDK, or universal tool vocabulary.

## Migration sequence

Each phase ends in a reviewable pstack-only result. Migration work stays separate from workflow-policy changes.

1. Capture the bundle baseline and verify local Claude Code and Codex installation paths. Record existing catalog drift as an external limitation. Do not repair collection files. Run required existing collection checks read-only and record baseline failures.
2. Remove Pi as one complete unit. Delete its runtime, mappings, package metadata, model maps, generator ownership, and exclusive tests. Update pstack sync policy and prove a fixture import cannot restore removed material.
3. Remove Copilot as one complete unit. Delete metadata, exclusive hooks, model setup branches, generated preambles, and exclusive tests. Remove other unsupported shared-skills claims. Explicitly remove already-stamped Copilot preambles before dropping the registration. Add a migration fixture seeded with the old paragraph and verify two generation runs do not retain or restore it. Verify retained startup hooks and direct invocation.
4. Enforce the pstack support contract. Simplify active docs and existing validators, run retained tests, verify both agents through bundle-local installation, and record package inventories. Preserve the current runtime paths.

Keep all version metadata unchanged during this migration. Version bumps require matching collection marketplace updates, which are outside the approved edit scope. Defer the complete release-version change together. Completion means the pstack migration is verified, not that the collection is ready to publish.

No phase requires publication, an upstream PR, or edits outside pstack.

## Transcript compatibility after removal

Remove Pi and Copilot transcript-root discovery and format readers together with their runtime integrations. Historical transcript compatibility for these removed agents is outside the retained contract. Keep narrow format rejection so an explicitly supplied unsupported transcript cannot silently fall through to the Claude parser.

Preserve Claude transcript lookup. Preserve the existing Codex session metadata discovery used by worktree-audit. Reflect's find-transcript reader currently rejects Codex rollouts and asks for a session digest. Preserve that digest path rather than adding native Codex transcript parsing in this migration. Update shared callers, mappings, docs, and fixtures to describe those distinct behaviors.

## Verification and acceptance

The implementation is complete only when all applicable criteria pass.

| Criterion | Required evidence |
| --- | --- |
| Removed runtimes stay removed | Inventory of active manifests, runtime registrations, dependency keys, scripts, and documentation shows only the chosen agents. Exceptions are historical records, licenses, and negative test fixtures. |
| Generation converges | Run `bun tools/generate.mjs`, then `bun tools/generate.mjs --check`. A second generation produces no diff. |
| Collection checks execute | Run existing collection checks from the collection root as listed in the implementation plan. Capture P1 baseline and final exit codes. Do not edit outside pstack. Fix newly introduced failures within pstack and report pre-existing external failures separately. |
| Remaining tests pass | Run `bun test tests/` in the bundle after adapting tests to the supported set. Keep failures visible rather than deleting unrelated tests. |
| Shared tools survive | For changes affecting bundled orchestration or PR scripts, run their existing typecheck and test commands documented in `CONTRIBUTING.md`. |
| Claude installation works | Install from this bundle through a temporary local marketplace, without using collection-root catalogs. Verify explicit poteto-mode invocation, one directly invoked workflow, routing enabled and disabled, and a delegated task with saved model choices. |
| Codex installation works | Install from this bundle through a temporary local marketplace, without using collection-root catalogs. Verify the same cases, including a direct workflow invocation that needs the mapping and model override precedence. |
| Failure behavior is honest | Exercise unavailable delegation or panel diversity through existing fixtures or an isolated session. Verify the workflow reports the limitation and never claims completed independent review. |
| Sync preserves the support policy | A local fixture-based upstream sync does not reintroduce removed files, preambles, or manifests. Avoid network-dependent checks for this invariant. |
| Docs match packages | Every advertised install path resolves. Bundle-local marketplace versions match retained manifests. Collection catalog repair remains deferred. Links and public skill names remain valid. |

Live checks require available signed-in CLIs. If unavailable, record which checks are blocked. Static tests alone do not establish that installation or delegation works.

Do not set a percentage reduction target without a baseline. Record removed runtime modules, tests, dependency keys, and repeated mapping paragraphs as a before-and-after inventory. Do not equate fewer tests with improved runtime correctness.

## Risks and responses

Removing supported agents is a breaking product change. Release notes must name the removed agents and the last compatible release. No automatic user-directory cleanup is part of the migration.

Claude tool names remain an interpretation burden for Codex under the two-agent design. Preserve one tested mapping now. A Codex-native rewrite is justified only if Codex becomes the sole supported agent or observed failures require it.

Broad cleanup can accidentally remove shared hook, transcript, or orchestration behavior. Classify files by callers and assertions before deletion, then verify retained behavior.

Upstream imports can reverse deletions. Keep removal policy in the existing sync and fork machinery rather than adding another source of generated truth.

Collection documentation and catalog drift can send users to a different snapshot. Record catalog reconciliation as external release work. Retain the nested pstack runtime path so this migration does not require external path changes.

## Confirmed implementation scope

Keep only Claude Code and Codex within `/Users/kevin/projects/sonny-skills/plugins/pstack`. Remove other agents in complete pstack-specific units. Keep the existing nested runtime layout. Preserve ordinary Markdown skill files without advertising unsupported-agent compatibility.

## Deferred work outside scope

Do not modify Superpowers, SWE Skills, root marketplaces, collection README, collection scripts, or collection tests. Their existing integrations remain unchanged by this task.

The observed collection catalog mismatch and any required release-version synchronization remain separate follow-ups. They do not authorize expanding this migration. Verify the bundle independently and state that collection-wide support removal has not occurred.

## Principles used

Laziness Protocol changes the design to delete integrations and retain the existing shared skill tree. It rules out a new generic adapter framework.

Redesign from First Principles changes the support contract to a finite chosen set. It removes universal compatibility claims rather than retaining unsupported fallback instructions.

Subtract Before You Add changes the delivery order. Remove runtime obligations before considering a directory move or a new model configuration design.
