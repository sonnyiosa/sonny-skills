# Sonny skills

My personal collection of skills and plugins for coding agents. Superpowers, SWE Skills, and pstack each have their own plugin directory. This repository owns their marketplace catalogs and my personal skills.

## Repository layout

```text
skills/                    Personal skills, one directory per skill
development_skills/       Drafts outside installed skill directories
plugins/
  superpowers/             Superpowers skills and harness integrations
  swe-skills/              Software engineering guidance
  pstack/                  Agent workflows and principles
scripts/                   Collection checks and Codex distribution tools
tests/                     Collection and distribution checks
plans/                     Personal repository plans
```

Superpowers no longer supplies a plugin at the repository root. Its manifests, hooks, assets, runtime entrypoints, documentation, and tests live together in `plugins/superpowers/`. Bundled skill names and content remain unchanged.

## Install in Claude Code

Register the checkout as a local marketplace. Use the actual path to your clone.

```text
/plugin marketplace add /Users/kevin/projects/superpowers
/plugin install superpowers@sonny-skills
/plugin install swe-skills@sonny-skills
/plugin install pstack@sonny-skills
```

Choose the plugins you use. Superpowers supplies its workflow bootstrap. SWE Skills supplies engineering guidance. This bundled pstack snapshot supplies Claude skills and agents.

## Use other harnesses

The [Codex catalog](.agents/plugins/marketplace.json) includes Superpowers, SWE Skills, and pstack. To install pstack from this checkout, use the actual path to your clone.

```bash
codex plugin marketplace add /path/to/sonny-skills
codex plugin add pstack@sonny-skills
```

OpenCode's Superpowers adapter remains in the bundled plugin. For local OpenCode V2, configure the absolute plugin directory containing `index.js`.

```json
{
  "plugins": ["/Users/kevin/projects/superpowers/plugins/superpowers"]
}
```

For Pi, install the local package directory.

```bash
pi install /Users/kevin/projects/superpowers/plugins/superpowers
pi install /Users/kevin/projects/superpowers/plugins/swe-skills
```

For other harnesses, use the manifests and adapters inside the selected plugin directory. Git URL installs that expect a manifest at the repository root need a local clone and the nested plugin path. The [retained Superpowers README](plugins/superpowers/README.md) describes the upstream distribution; its upstream marketplace and Git URL commands install upstream Superpowers.

## Add personal skills

Create `skills/<name>/SKILL.md` with `name` and `description` frontmatter. Keep its references and scripts in that skill directory. Link root `skills/` into your harness's skill directory to install your personal skills. Keep unfinished material in `development_skills/`.

## Verify and package

Check collection ownership, marketplace sources, versions, and resource paths.

```bash
python3 scripts/check-layout.py
bash tests/codex/test-marketplace-manifest.sh
bash tests/swe-skills/test-plugin-layout.sh
node --test tests/swe-skills/test-opencode-plugin.mjs
bash plugins/superpowers/tests/hooks/test-session-start.sh
node --test plugins/superpowers/tests/pi/test-pi-extension.mjs
bash tests/codex/test-package-codex-plugin.sh
bash tests/codex-plugin-sync/test-sync-to-codex-plugin.sh
bash tests/codex-plugin-sync/test-publish-destination.sh
```

Plugin versions are independent. Superpowers' version tool lives at `plugins/superpowers/scripts/bump-version.sh` and updates only its own manifests. Update the root marketplace version entries after changing a bundled plugin version.

The Codex packager defaults to `plugins/superpowers`. Select another plugin with `--plugin-root`. It packages a committed Git ref, including required assets, and requires existing OpenAI skill metadata.

```bash
bash scripts/package-codex-plugin.sh --help
bash scripts/sync-to-codex-plugin.sh --help
```

The sync tool is retained for distribution work. Its default source is the nested Superpowers plugin. Preview a destination with `--local PATH -n`. Publishing requires an explicit `--repo OWNER/REPO`, including when you use a local checkout, and remains a separate action from repository maintenance.

## Sources and licenses

Superpowers originates from [obra/superpowers](https://github.com/obra/superpowers). Each bundled plugin retains its author metadata and license. See [Superpowers](plugins/superpowers/LICENSE), [SWE Skills](plugins/swe-skills/LICENSE), and [pstack](plugins/pstack/LICENSE).
