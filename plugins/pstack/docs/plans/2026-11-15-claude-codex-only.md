# Keep only Claude Code and Codex in pstack

Apply this migration only within `/Users/kevin/projects/sonny-skills/plugins/pstack`.
Keep Claude Code and Codex. Remove pstack support for every other coding agent.
Deliver four local changes in order, P1 through P4. Do not modify sibling plugins or collection-root files.
This document plans the migration. It does not implement it or authorize publication.

## How to read this

One box is one unit of work. Every box names the evidence that checks it. Check a box only when its evidence exists. Store receipts under an untracked `.audit/claude-codex-only/` directory inside the pstack bundle.

Execute under `plugins/pstack/skills/poteto-mode/playbooks/refactoring.md` relative to the pstack bundle. Keep workflow-policy edits separate. The operator owns publication and merging.

Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

All paths and commands are relative to the pstack bundle root, `/Users/kevin/projects/sonny-skills/plugins/pstack`. `R` means its existing `plugins/pstack` runtime subdirectory. Expand R before shell execution. Keep that nested runtime location during this migration.

## Program checklist

### Arm the program

- [ ] Record the confirmed support set, scope boundary, starting SHA, and `git status --short` in `.audit/claude-codex-only/baseline.txt`.
- [ ] Read pstack contributor guidance and the repository instructions. Record the installed plugin guidance used, but edit only repository copies.
- [ ] Record standing orders. Every edited, created, moved, or deleted tracked file must be inside the pstack bundle. Preserve user configuration and licenses.
- [ ] Record that no hourly unattended loop is needed. Write a status message and evidence receipt at each phase boundary.

### Spawn owners

- [ ] Assign one sequential owner to P1, P2, P3, and P4. Delegated inspection, if needed, must respect the same directory boundary.
- [ ] Start each phase only after the preceding phase's evidence has been reviewed. Do not run concurrent writers against shared generation output.
- [ ] Do not schedule Superpowers, SWE Skills, collection catalog repair, or runtime flattening in this plan.

### PR mechanics

- [ ] Use phase identifiers for local commits. Do not publish or open PRs unless separately requested.
- [ ] Review the complete diff before each commit and save executed checks and their exit codes.
- [ ] Keep migration changes separate from workflow-policy changes. Keep VERSION, package version, changelog release headings, and manifest versions unchanged. A release bump requires a separately authorized collection marketplace update.
- [ ] Preserve pre-existing changes outside the bundle. Do not stage them. Record collection version or catalog follow-ups without editing those files.

### Verdict and merge

- [ ] Require unit, live, and distribution-cost evidence at the verified phase SHA. Keep unavailable signed-in CLI checks visibly blocked.
- [ ] Verify no tracked path outside the allowed bundle changed as a result of the migration.
- [ ] Review shared callers before deleting helpers. Keep unrelated orchestration, PR tooling, and model override behavior.
- [ ] Leave publication and merging to a separate operator instruction.

### Boot recipe

- [ ] Use isolated temporary Claude Code and Codex installations of this bundle's own local marketplace or package. Do not depend on collection-root catalog repair.
- [ ] Inspect local CLI help and record exact invocation commands and versions in `boot.txt`. Use supported authentication without storing secrets in receipts.
- [ ] Drive scenarios through public CLI interfaces. No repository control skill was identified. Save complete transcripts and terminal screenshots.
- [ ] Run ten verification scenarios per phase, sequentially when practical. Use independent temporary configurations to avoid shared writes.
- [ ] Save evidence to `/tmp/claude-codex-only/<phase>/` and preserve receipts inside the bundle's untracked audit directory.

## Capture the pstack baseline and installation contract (P1)

**Depends on.** None.

**Files.**

- [ ] Create local receipts under `.audit/claude-codex-only/`.
- [ ] Inspect `README.md`, `CONTRIBUTING.md`, `tools/plugin.mjs`, `tools/runtimes.mjs`, internal marketplaces, and R manifests. Do not edit collection files.

**Build.**

- [ ] Record the current pstack skill inventory, supported agents, generated output, package dependencies, and runtime consumers.
- [ ] Run generator check mode and the existing pstack tests before modifying runtime code. Save baseline failures separately from later regressions.
- [ ] Verify both retained agents can install using the bundle-local marketplace or package path. Record exact commands from local CLI help.
- [ ] Run the read-only collection checks listed in Appendix D. Record the existing catalog failure and every other baseline failure with command and exit code. Do not edit outside pstack or block bundle-local installation on catalog repair.

**You see.**

- [ ] The baseline receipts identify retained behavior and existing failures.
- [ ] Both retained installation paths are documented without editing collection catalogs.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Run `bun tools/generate.mjs --check && bun test tests/` from the pstack bundle root. Expand R in any additional commands. Save command logs and exit codes in `P1/unit.txt`.
- [ ] Run generation with writes, then check mode, then generation again. Save a diff proving the second run changes nothing. For the baseline-only phase, record existing generation drift without rewriting output.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on the configured `swarm workers` model at the PR head. Run sequentially when no swarm is needed.

- [ ] Lane 1. Regression lane against trunk. Install pstack through the bundle-local installation path on both agents and invoke poteto-mode. Save `/tmp/claude-codex-only/P1/lane-1.png`. Pass when retained behavior agrees at trunk and head, except the explicitly repaired catalog or removed support. Save the transcript and observed result beside the screenshot.
- [ ] Lane 2. Install the affected plugin independently on Claude Code. Save `/tmp/claude-codex-only/P1/lane-2.png`. Pass when the expected public skills are discoverable. Save the transcript and observed result beside the screenshot.
- [ ] Lane 3. Install the affected plugin independently on Codex. Save `/tmp/claude-codex-only/P1/lane-3.png`. Pass when the expected public skills are discoverable. Save the transcript and observed result beside the screenshot.
- [ ] Lane 4. Load the primary workflow on Claude Code. Save `/tmp/claude-codex-only/P1/lane-4.png`. Pass when no deleted runtime mapping or resource is requested. Save the transcript and observed result beside the screenshot.
- [ ] Lane 5. Invoke a mapped workflow directly on Codex. Save `/tmp/claude-codex-only/P1/lane-5.png`. Pass when tool names resolve without loading poteto-mode first. Save the transcript and observed result beside the screenshot.
- [ ] Lane 6. Exercise an existing model-role override on both retained agents. Save `/tmp/claude-codex-only/P1/lane-6.png`. Pass when the selected saved models reach the intended delegated roles.  Save the transcript and observed result beside the screenshot.
- [ ] Lane 7. Run with optional routing disabled where supported. Save `/tmp/claude-codex-only/P1/lane-7.png`. Pass when explicit invocation works.  Save the transcript and observed result beside the screenshot.
- [ ] Lane 8. Inspect installed references and execute one bundled script where present. Save `/tmp/claude-codex-only/P1/lane-8.png`. Pass when every resource resolves within its owning plugin.  Save the transcript and observed result beside the screenshot.
- [ ] Lane 9. Check the phase-specific contract. The bundle-local Claude installation resolves the expected runtime. Save `/tmp/claude-codex-only/P1/lane-9.png`. Pass when the stated phase-specific contract holds. Save the transcript and observed result beside the screenshot.
- [ ] Lane 10. Check the phase-specific contract. The bundle-local Codex installation resolves the same canonical skills. Save `/tmp/claude-codex-only/P1/lane-10.png`. Pass when the stated phase-specific contract holds. Save the transcript and observed result beside the screenshot.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. Measure total regular-file bytes in the installed affected plugin, plus its active runtime registration count. Use the same archive extraction procedure at trunk and head. This gates distribution cost, not model latency.
- [ ] Probe. Extract trunk and head archives into separate temporary directories. Sum file sizes with a local script and save the file inventories in `P1/package-cost.tsv`. Repeat trunk, head, trunk, head to check deterministic input.
- [ ] Baseline. Record trunk bytes and registration count before inspecting head values. Exclude audit files and temporary install state from both packages.
- [ ] Rule. Fail on unexplained package-byte growth above zero bytes or any new unsupported registration. Attribute necessary metadata growth file by file before changing this budget. Do not report runtime speedups from archive size.

**Review gate.** None. P1 is not review-gated. The supported-agent removal is already selected by the owner. There is no new visual interaction.

**Merge.**

- [ ] Review the complete diff at the verified SHA and attach `P1/unit.txt`, live transcripts, and package-cost evidence to the local handoff.
- [ ] Confirm every new failure is fixed and baseline failures remain explicitly identified.
- [ ] Leave the local commit ready for the next phase. Do not publish or merge without a separate request.

## Remove the pstack Pi runtime (P2)

**Depends on.** P1.

**Files.**

- [ ] Delete `R/pi/`, `tests/pi/`, `tools/pi-package.mjs`, `tools/typecheck-pi.mjs`, and `docs/pi-equivalence.md`.
- [ ] Delete `tests/pi-package.test.mjs`, `tests/pi-equivalence.test.mjs`, and `R/skills/poteto-mode/references/pi-tools.md`.
- [ ] Edit `package.json`, `bun.lock`, `tools/runtimes.mjs`, `tools/generate.mjs`, `R/models.json`, affected shared tests, docs, sync policy, and retained workflow definitions.

**Build.**

- [ ] Remove the Pi registration, provider maps, metadata, optional peer dependencies, and Pi-only CI job. Retain dependencies only where a retained caller needs them.
- [ ] Remove Pi branches from setup, runtime guidance, and generation. Remove Pi transcript-root discovery and parsing from `R/skills/poteto-mode/scripts/worktree-audit.mjs` and `R/skills/reflect/scripts/find-transcript.mjs`. Historical Pi transcript reading is intentionally unsupported after this migration. Keep a narrow unsupported-format rejection so Pi records cannot fall through as Claude transcripts. Update callers, fixtures, and docs together.
- [ ] Keep R/skills/poteto-mode/scripts/orch and watch-pr unchanged unless a direct Pi dependency requires a surgical edit.
- [ ] Update upstream exclusions and fork declarations in this phase so the next import cannot restore Pi material. Add a fixture proving that invariant.
- [ ] Regenerate lockfiles and retained output. Remove every active link to the deleted mapping and extension.

**You see.**

- [ ] No Pi runtime module, package registration, provider map, or install instruction remains active in pstack.
- [ ] Both retained agents still execute pstack workflows.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Run `bun tools/generate.mjs --check && bun test tests/` from the pstack bundle root. Expand R in any additional commands. Save command logs and exit codes in `P2/unit.txt`.
- [ ] Run generation with writes, then check mode, then generation again. Save a diff proving the second run changes nothing. For the baseline-only phase, record existing generation drift without rewriting output.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on the configured `swarm workers` model at the PR head. Run sequentially when no swarm is needed.

- [ ] Lane 1. Regression lane against trunk. Run a delegated pstack investigation on both retained agents from a clean local installation. Save `/tmp/claude-codex-only/P2/lane-1.png`. Pass when retained behavior agrees at trunk and head, except the explicitly repaired catalog or removed support. Save the transcript and observed result beside the screenshot.
- [ ] Lane 2. Install the affected plugin independently on Claude Code. Save `/tmp/claude-codex-only/P2/lane-2.png`. Pass when the expected public skills are discoverable. Save the transcript and observed result beside the screenshot.
- [ ] Lane 3. Install the affected plugin independently on Codex. Save `/tmp/claude-codex-only/P2/lane-3.png`. Pass when the expected public skills are discoverable. Save the transcript and observed result beside the screenshot.
- [ ] Lane 4. Load the primary workflow on Claude Code. Save `/tmp/claude-codex-only/P2/lane-4.png`. Pass when no deleted runtime mapping or resource is requested. Save the transcript and observed result beside the screenshot.
- [ ] Lane 5. Invoke a mapped workflow directly on Codex. Save `/tmp/claude-codex-only/P2/lane-5.png`. Pass when tool names resolve without loading poteto-mode first. Save the transcript and observed result beside the screenshot.
- [ ] Lane 6. Exercise an existing model-role override on both retained agents. Save `/tmp/claude-codex-only/P2/lane-6.png`. Pass when the selected saved models reach the intended delegated roles.  Save the transcript and observed result beside the screenshot.
- [ ] Lane 7. Run with optional routing disabled where supported. Save `/tmp/claude-codex-only/P2/lane-7.png`. Pass when explicit invocation works.  Save the transcript and observed result beside the screenshot.
- [ ] Lane 8. Inspect installed references and execute one bundled script where present. Save `/tmp/claude-codex-only/P2/lane-8.png`. Pass when every resource resolves within its owning plugin.  Save the transcript and observed result beside the screenshot.
- [ ] Lane 9. Check the phase-specific contract. No Pi extension or typebox-only runtime dependency enters the installed package. Save `/tmp/claude-codex-only/P2/lane-9.png`. Pass when the stated phase-specific contract holds. Save the transcript and observed result beside the screenshot.
- [ ] Lane 10. Check the phase-specific contract. Claude transcript lookup still works. Preserve existing Codex worktree-audit discovery and its metadata reader, while reflect/find-transcript continues to reject Codex rollouts and accept a session digest through the existing workflow. Saved model overrides remain unchanged. Save `/tmp/claude-codex-only/P2/lane-10.png`. Pass when the stated phase-specific contract holds. Save the transcript and observed result beside the screenshot.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. Measure total regular-file bytes in the installed affected plugin, plus its active runtime registration count. Use the same archive extraction procedure at trunk and head. This gates distribution cost, not model latency.
- [ ] Probe. Extract trunk and head archives into separate temporary directories. Sum file sizes with a local script and save the file inventories in `P2/package-cost.tsv`. Repeat trunk, head, trunk, head to check deterministic input.
- [ ] Baseline. Record trunk bytes and registration count before inspecting head values. Exclude audit files and temporary install state from both packages.
- [ ] Rule. Fail on unexplained package-byte growth above zero bytes or any new unsupported registration. Attribute necessary metadata growth file by file before changing this budget. Do not report runtime speedups from archive size.

**Review gate.** None. P2 is not review-gated. The supported-agent removal is already selected by the owner. There is no new visual interaction.

**Merge.**

- [ ] Review the complete diff at the verified SHA and attach `P2/unit.txt`, live transcripts, and package-cost evidence to the local handoff.
- [ ] Confirm every new failure is fixed and baseline failures remain explicitly identified.
- [ ] Leave the local commit ready for the next phase. Do not publish or merge without a separate request.

## Remove pstack Copilot and simplify runtime guidance (P3)

**Depends on.** P2.

**Files.**

- [ ] Delete `R/.github/plugin/`, `R/skills/setup-pstack/copilot.md`, and `R/skills/poteto-mode/references/copilot-tools.md`.
- [ ] Delete Copilot-only hooks listed in the specification and `tests/copilot.test.mjs`, `copilot-smoke.sh`, `copilot-tui.py`, and `pre-tool-use.test.mjs` after confirming exclusive ownership.
- [ ] Edit `tools/runtimes.mjs`, `tools/generate.mjs`, setup scripts, shared hook tests, model tests, documentation, fork declarations, and sync exclusions.

**Build.**

- [ ] Remove Copilot model discovery, setup barriers, saved-sheet enforcement, hook context, and generated role lists as one unit. Before deleting its runtime registration, inventory every stamped Copilot preamble. Explicitly remove those paragraphs from every affected canonical skill. The generator derives recognized lines from current registrations, so removing the registration alone does not remove old paragraphs. Verify no active skill retains the old preamble or deleted mapping link after two generation runs.
- [ ] Remove Copilot transcript-root discovery and parsing from `R/skills/poteto-mode/scripts/worktree-audit.mjs` and `R/skills/reflect/scripts/find-transcript.mjs`. Historical Copilot transcript reading is intentionally unsupported. Retain a narrow unsupported-format rejection to prevent Claude-parser fallthrough. Test default-root exclusion and explicit removed-format rejection alongside retained Claude lookup and Codex digest behavior.
- [ ] Trace callers of json.awk, script-contracts.awk, and shared sheet validators. Delete only helpers whose last consumer disappears.
- [ ] Remove Prime Agent, OpenCode, and Gemini CLI compatibility and installation claims in pstack. Preserve historical and license mentions.
- [ ] Retain one explicit Codex mapping and concise guidance for directly invoked skills. Keep Claude model aliases distinct from Codex model IDs.
- [ ] Simplify the remaining generator by deleting dead branches. Preserve reproducible versions, model sections, Codex prompts, agent registration, and necessary assets.
- [ ] Add a generator fixture seeded with an actual old Copilot-stamped skill. Apply the migration cleanup, remove Copilot registration, and generate twice. Assert the skill preserves its body and Codex guidance while the obsolete paragraph and mapping link are absent. Prove a fixture upstream import cannot restore removed Copilot material or unsupported preambles.

**You see.**

- [ ] Pstack advertises and packages only Claude Code and Codex.
- [ ] Direct Codex skill invocation works without loading poteto-mode first.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Run `bun tools/generate.mjs --check && bun test tests/` from the pstack bundle root. Expand R in any additional commands. Save command logs and exit codes in `P3/unit.txt`.
- [ ] Run generation with writes, then check mode, then generation again. Save a diff proving the second run changes nothing. For the baseline-only phase, record existing generation drift without rewriting output.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on the configured `swarm workers` model at the PR head. Run sequentially when no swarm is needed.

- [ ] Lane 1. Regression lane against trunk. Invoke a mapped skill directly on Codex and exercise routing enabled and disabled on both agents. Save `/tmp/claude-codex-only/P3/lane-1.png`. Pass when retained behavior agrees at trunk and head, except the explicitly repaired catalog or removed support. Save the transcript and observed result beside the screenshot.
- [ ] Lane 2. Install the affected plugin independently on Claude Code. Save `/tmp/claude-codex-only/P3/lane-2.png`. Pass when the expected public skills are discoverable. Save the transcript and observed result beside the screenshot.
- [ ] Lane 3. Install the affected plugin independently on Codex. Save `/tmp/claude-codex-only/P3/lane-3.png`. Pass when the expected public skills are discoverable. Save the transcript and observed result beside the screenshot.
- [ ] Lane 4. Load the primary workflow on Claude Code. Save `/tmp/claude-codex-only/P3/lane-4.png`. Pass when no deleted runtime mapping or resource is requested. Save the transcript and observed result beside the screenshot.
- [ ] Lane 5. Invoke a mapped workflow directly on Codex. Save `/tmp/claude-codex-only/P3/lane-5.png`. Pass when tool names resolve without loading poteto-mode first. Save the transcript and observed result beside the screenshot.
- [ ] Lane 6. Exercise an existing model-role override on both retained agents. Save `/tmp/claude-codex-only/P3/lane-6.png`. Pass when the selected saved models reach the intended delegated roles.  Save the transcript and observed result beside the screenshot.
- [ ] Lane 7. Run with optional routing disabled where supported. Save `/tmp/claude-codex-only/P3/lane-7.png`. Pass when explicit invocation works.  Save the transcript and observed result beside the screenshot.
- [ ] Lane 8. Inspect installed references and execute one bundled script where present. Save `/tmp/claude-codex-only/P3/lane-8.png`. Pass when every resource resolves within its owning plugin.  Save the transcript and observed result beside the screenshot.
- [ ] Lane 9. Check the phase-specific contract. Saved model overrides retain their existing precedence. Save `/tmp/claude-codex-only/P3/lane-9.png`. Pass when the stated phase-specific contract holds. Save the transcript and observed result beside the screenshot.
- [ ] Lane 10. Check the phase-specific contract. Disabled automatic routing still permits explicit skill invocation. Save `/tmp/claude-codex-only/P3/lane-10.png`. Pass when the stated phase-specific contract holds. Save the transcript and observed result beside the screenshot.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. Measure total regular-file bytes in the installed affected plugin, plus its active runtime registration count. Use the same archive extraction procedure at trunk and head. This gates distribution cost, not model latency.
- [ ] Probe. Extract trunk and head archives into separate temporary directories. Sum file sizes with a local script and save the file inventories in `P3/package-cost.tsv`. Repeat trunk, head, trunk, head to check deterministic input.
- [ ] Baseline. Record trunk bytes and registration count before inspecting head values. Exclude audit files and temporary install state from both packages.
- [ ] Rule. Fail on unexplained package-byte growth above zero bytes or any new unsupported registration. Attribute necessary metadata growth file by file before changing this budget. Do not report runtime speedups from archive size.

**Review gate.** None. P3 is not review-gated. The supported-agent removal is already selected by the owner. There is no new visual interaction.

**Merge.**

- [ ] Review the complete diff at the verified SHA and attach `P3/unit.txt`, live transcripts, and package-cost evidence to the local handoff.
- [ ] Confirm every new failure is fixed and baseline failures remain explicitly identified.
- [ ] Leave the local commit ready for the next phase. Do not publish or merge without a separate request.

## Enforce and document pstack-only support (P4)

**Depends on.** P3.

**Files.**

- [ ] Edit `tools/generate.mjs`, `tools/runtimes.mjs`, and relevant invariant, packaging, sync, and reference tests.
- [ ] Edit `README.md`, `docs/reference.md`, `CONTRIBUTING.md`, `CHANGES.md`, and pstack internal manifests as needed.
- [ ] Update the specification and final receipts inside this bundle.

**Build.**

- [ ] Enforce Claude Code and Codex as the only active pstack runtime registrations. Extend existing validators instead of adding an adapter framework.
- [ ] Add fixture coverage that rejects reintroduced Pi or Copilot metadata and proves upstream sync does not restore removed files or preambles.
- [ ] Simplify active install and setup documentation. Remove unsupported-agent compatibility promises. Preserve historical mentions and license attribution.
- [ ] Keep one canonical skills tree, one Codex mapping, and the existing nested runtime root. Do not move files whose relocation would require collection catalog edits.
- [ ] Keep all version metadata unchanged during this migration. Do not bump internal versions while deferring mandatory collection marketplace changes. Record release versioning and marketplace synchronization as a separate, out-of-scope release task.
- [ ] Verify packages contain all referenced scripts and notices and omit removed runtime entrypoints. Run local installation checks for Claude Code and Codex separately and together.
- [ ] Review the complete diff and confirm every changed tracked path stays beneath the allowed pstack bundle root.

**You see.**

- [ ] Pstack packages and advertises only Claude Code and Codex.
- [ ] All migration changes stay within the approved pstack directory.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Run `bun tools/generate.mjs --check && bun test tests/` from the pstack bundle root. Expand R in any additional commands. Save command logs and exit codes in `P4/unit.txt`.
- [ ] Run generation with writes, then check mode, then generation again. Save a diff proving the second run changes nothing. For the baseline-only phase, record existing generation drift without rewriting output.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on the configured `swarm workers` model at the PR head. Run sequentially when no swarm is needed.

- [ ] Lane 1. Regression lane against trunk. Install the final pstack bundle on each retained agent and exercise routing, direct invocation, saved models, and referenced scripts. Save `/tmp/claude-codex-only/P4/lane-1.png`. Pass when retained behavior agrees at trunk and head, except the explicitly repaired catalog or removed support. Save the transcript and observed result beside the screenshot.
- [ ] Lane 2. Install the affected plugin independently on Claude Code. Save `/tmp/claude-codex-only/P4/lane-2.png`. Pass when the expected public skills are discoverable. Save the transcript and observed result beside the screenshot.
- [ ] Lane 3. Install the affected plugin independently on Codex. Save `/tmp/claude-codex-only/P4/lane-3.png`. Pass when the expected public skills are discoverable. Save the transcript and observed result beside the screenshot.
- [ ] Lane 4. Load the primary workflow on Claude Code. Save `/tmp/claude-codex-only/P4/lane-4.png`. Pass when no deleted runtime mapping or resource is requested. Save the transcript and observed result beside the screenshot.
- [ ] Lane 5. Invoke a mapped workflow directly on Codex. Save `/tmp/claude-codex-only/P4/lane-5.png`. Pass when tool names resolve without loading poteto-mode first. Save the transcript and observed result beside the screenshot.
- [ ] Lane 6. Exercise an existing model-role override on both retained agents. Save `/tmp/claude-codex-only/P4/lane-6.png`. Pass when the selected saved models reach the intended delegated roles.  Save the transcript and observed result beside the screenshot.
- [ ] Lane 7. Run with optional routing disabled where supported. Save `/tmp/claude-codex-only/P4/lane-7.png`. Pass when explicit invocation works.  Save the transcript and observed result beside the screenshot.
- [ ] Lane 8. Inspect installed references and execute one bundled script where present. Save `/tmp/claude-codex-only/P4/lane-8.png`. Pass when every resource resolves within its owning plugin.  Save the transcript and observed result beside the screenshot.
- [ ] Lane 9. Check the phase-specific contract. The generated package contains no active unsupported integration. Save `/tmp/claude-codex-only/P4/lane-9.png`. Pass when the stated phase-specific contract holds. Save the transcript and observed result beside the screenshot.
- [ ] Lane 10. Check the phase-specific contract. The final path inventory confirms no tracked edits outside pstack. Save `/tmp/claude-codex-only/P4/lane-10.png`. Pass when the stated phase-specific contract holds. Save the transcript and observed result beside the screenshot.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. Measure total regular-file bytes in the installed affected plugin, plus its active runtime registration count. Use the same archive extraction procedure at trunk and head. This gates distribution cost, not model latency.
- [ ] Probe. Extract trunk and head archives into separate temporary directories. Sum file sizes with a local script and save the file inventories in `P4/package-cost.tsv`. Repeat trunk, head, trunk, head to check deterministic input.
- [ ] Baseline. Record trunk bytes and registration count before inspecting head values. Exclude audit files and temporary install state from both packages.
- [ ] Rule. Fail on unexplained package-byte growth above zero bytes or any new unsupported registration. Attribute necessary metadata growth file by file before changing this budget. Do not report runtime speedups from archive size.

**Review gate.** None. P4 is not review-gated. The supported-agent removal is already selected by the owner. There is no new visual interaction.

**Merge.**

- [ ] Review the complete diff at the verified SHA and attach `P4/unit.txt`, live transcripts, and package-cost evidence to the local handoff.
- [ ] Confirm every new failure is fixed and baseline failures remain explicitly identified.
- [ ] Leave the local commit ready for the next phase. Do not publish or merge without a separate request.

## Close the program

- [ ] Check each phase against saved evidence and leave blocked live checks unchecked.
- [ ] Run pstack's retained suite and generator check. Verify a second generation produces no diff.
- [ ] Rerun the Appendix D collection checks after manifest or layout changes and at final verification. Compare receipts against P1. Fix any newly introduced failure inside pstack before completion. Leave pre-existing external failures documented without editing those files.
- [ ] Review installed package inventories and test both agents through bundle-local installation.
- [ ] Confirm the migration changed no collection-root catalog, sibling plugin, or user configuration.
- [ ] Report deferred collection catalog and release integration work separately. Do not claim collection-wide support removal or release readiness.

## Appendix A. Prototype evidence

The owner confirmed Claude Code and Codex and restricted scope to pstack. No product choice remains.
No runtime prototypes or performance measurements were run while authoring this plan. Capture actual baseline evidence in P1.
The existing collection catalog mismatch is outside this migration. Use bundle-local marketplaces to verify retained behavior.

## Appendix B. Alternatives rejected

Do not trim sibling plugins or collection catalogs. They are outside the owner's explicit directory boundary.
Do not flatten the nested runtime directory in this migration. Its consumers include collection catalogs outside the allowed directory.
Do not create generic adapters or generated full skill copies. Keep the current shared tree and a tested Codex mapping.
Do not change upstream synchronization policy to a frozen import. Maintain exclusions and declared forks within existing tooling.

## Appendix C. Risks

Shared generator, model, sheet, and hook code can serve retained agents. Trace actual consumers before deleting helpers.
Missing signed-in CLIs block live evidence. Static tests do not substitute for installation and workflow execution.
The system Node executable previously failed on a missing llhttp library. Use Bun where compatible and distinguish toolchain errors from repository defects.
Collection catalogs and version entries may remain inconsistent. Record the external follow-up without editing them or expanding this task.
Historical plans and license files can retain agent names. Validate active registrations rather than enforcing a whole-tree keyword ban.

## Appendix D. Links and reading list

Read the [specification](../specs/2026-11-15-agent-support-simplification.md), `CONTRIBUTING.md`, `tools/plugin.mjs`, `tools/generate.mjs`, `tools/runtimes.mjs`, and `tools/upstream.json` before execution.
Read `tools/forks.json`, `tools/substitutions.json`, retained hook tests, runtime packaging tests, model tests, and sync fixtures before removal.
The Copilot-only hook candidates under R/hooks are `copilot-hooks.json`, `copilot-context.awk`, `session-start-copilot.md`, `session-start-copilot-sheet.md`, `session-start-copilot-setup.md`, `pre-tool-use.sh`, and `pre-tool-use.awk`.
Inspect `json.awk`, `script-contracts.awk`, and shared setup validators for retained consumers before deletion.
Keep R/skills/poteto-mode/scripts/orch and watch-pr, retained agent definitions, necessary portable notices, and formal-verification assets.
Use the how skill for ownership questions and the interrogate skill for contested design. Record execution decisions in a local TSV trail.

Laziness Protocol selects deletion of unsupported adapters instead of new abstractions. Sequence Work into Verifiable Units separates Pi removal, Copilot removal, and final enforcement.

### Run required collection checks without expanding the edit scope

Run these commands from the collection root, `/Users/kevin/projects/sonny-skills`. Store receipts only in the pstack audit directory. Running existing checks does not authorize editing their source or sibling plugins. Record any generated artifacts and keep tracked changes within pstack.

```shell
python3 scripts/check-layout.py
python3 -m unittest discover -s tests -p 'test_*.py'
bash tests/codex/test-marketplace-manifest.sh
bash tests/swe-skills/test-plugin-layout.sh
node --test tests/swe-skills/test-opencode-plugin.mjs
bash plugins/superpowers/tests/hooks/test-session-start.sh
node --test plugins/superpowers/tests/pi/test-pi-extension.mjs
bash tests/codex/test-package-codex-plugin.sh
bash tests/codex-plugin-sync/test-sync-to-codex-plugin.sh
bash tests/codex-plugin-sync/test-publish-destination.sh
```

Capture command, exit code, output, and SHA in P1 and after relevant manifest or layout changes. The known catalog mismatch is an existing external failure, not permission to skip the collection checks. Separate toolchain failures from assertion failures. Do not claim all collection checks pass while any remains failed or unavailable.

### Record verified P1 review corrections

The standalone Terra reviewer completed its review. Source verification confirmed three P1 issues.

- `tools/generate.mjs` derives recognized preambles from registered runtimes and strips only recognized paragraphs. P3 now explicitly cleans old Copilot paragraphs and tests the migration fixture.
- `defaultTranscriptRoots` in worktree-audit and the reflect transcript READERS table include Pi and Copilot. P2 and P3 now remove that historical compatibility deliberately, preserve unsupported-format rejection, and distinguish reflect's Codex digest path from worktree-audit's Codex session discovery.
- Collection `AGENTS.md` requires collection checks and matching marketplace updates for version changes. The plan now runs existing collection checks without edits outside pstack and prohibits version bumps in this scoped migration.
