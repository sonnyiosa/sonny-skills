// The runtimes other than Claude Code that pstack ships to: the table the
// generator iterates, with each runtime's Model names renderer, models.json
// check, versioned manifest, packaging validator, and hooks files.

import { code, codeList, PLUGIN, SKILLS } from "./plugin.mjs";

export const RUNTIMES = [
  {
    name: "Codex",
    key: "codex",
    mapping: "codex-tools.md",
    modelNames: codexModelNamesSection,
    checkModels: tierExamples("codex"),
    skillPreambles: true,
    manifest: `${PLUGIN}/.codex-plugin/plugin.json`,
    validate: ({ manifest, read, pathExists }) =>
      validateCodexMarketplace(read(".agents/plugins/marketplace.json"), { expectedName: manifest.name, pathExists }),
    hooks: (manifest) => [manifest.hooks],
  },
].map((runtime) => ({
  ...runtime,
  tools: `${SKILLS}/poteto-mode/references/${runtime.mapping}`,
  notesHeader: `| Skill | On ${runtime.name} |`,
  preamble: runtime.skillPreambles
    ? `On ${runtime.name}, read the [platform mapping](../poteto-mode/references/${runtime.mapping}), ` +
      "including its per-skill notes, before following this skill."
    : null,
}));

// poteto-mode's Platform Adaptation sentence points at each mapping in row
// order, so the order of RUNTIMES is the order a reader meets the runtimes.
export const PLATFORM_ADAPTATION_OPEN = "These skills use Claude Code tool names";

export function platformAdaptation() {
  const pointer = (runtime) => `On ${runtime.name}, read [\`references/${runtime.mapping}\`](references/${runtime.mapping})`;
  const [first, ...rest] = RUNTIMES;
  return [
    `${PLATFORM_ADAPTATION_OPEN} (the \`Skill\` tool, the \`Agent\` tool, \`AskUserQuestion\`) and the Claude model names ` +
      "the `Agent` tool accepts, as each Models section lists them. On Claude Code they work as written.",
    `${pointer(first)} for the ${first.name} equivalent of a Claude tool, model, or skill named by these workflows.`,
    ...rest.map((runtime) => `${pointer(runtime)} instead.`),
    "Other runtimes can discover the same Agent Skills tree, but they must use their own tool, model, and " +
      "configuration equivalents. No one of these mappings is a cross-runtime map.",
  ].join(" ");
}

// Codex has no Claude aliases, so the block gives a model per tier.
// A declaration, so the RUNTIMES rows above can call it at module load.
function tierExamples(label) {
  return (block, { raw, fail, unique }) => {
    for (const tier of Object.keys(raw.tiers)) {
      if (!Object.hasOwn(block, tier)) fail(`${label} has no example for tier "${tier}"`);
    }
    for (const [tier, value] of Object.entries(block)) {
      if (!Object.hasOwn(raw.tiers, tier)) fail(`${label} names "${tier}", which is not a tier`);
      unique([value].flat(), `${label} "${tier}"`);
    }
  };
}

const tierRoles = (models, tier) =>
  models.roles
    .filter((r) => r.tier === tier)
    .map((r) => code(r.role))
    .join(", ");

const panelSkills = (models) =>
  codeList([...new Set(models.roles.filter((r) => r.tier === "panel").map((r) => r.skill))]);

// The Model names section of a runtime whose models.json block gives a model
// per tier. `panel` follows "A good default panel", `dispatch` is an optional
// paragraph before the closing line, and `ids` names what the sheet lists.
function tierModelNamesSection(models, { label, block, worker, panel, dispatch, ids }) {
  return (
    "Skills name Claude defaults (a single-role default for code/prose/judgment, a worker model for " +
    "feature and refactoring code, plus a diverse-model panel for diverse-model panels; each model-consuming skill lists its own in a " +
    `Models section). These slugs do not resolve on ${label}. Substitute your configured ${label} models:\n\n` +
    `- Single-model roles: your primary ${label} model (for example ${code(block.default)}).\n` +
    `- Roles that default to the Claude worker model (${tierRoles(models, "worker")}): ` +
    `your ${worker} (for example ${code(block.worker)}).\n` +
    `- Roles that default to the strongest Claude model (${tierRoles(models, "strongest")}): ` +
    `your strongest ${label} model (for example ${code(block.strongest)}).\n` +
    `- Diverse-model panels (${panelSkills(models)}): the adversarial ` +
    `signal comes from model diversity, so use the distinct ${label} models available to you. A good default panel ` +
    panel(codeList(block.panel)) +
    "\n\n" +
    (dispatch ? `${dispatch}\n\n` : "") +
    `\`/setup-pstack\` writes the configured model list. On ${label}, set it to your ${ids}.`
  );
}

export function codexModelNamesSection(models) {
  return tierModelNamesSection(models, {
    label: "Codex",
    block: models.codex,
    worker: "fast Codex code model",
    panel: (list) =>
      `on ChatGPT is ${list}. If only one model family is reachable, vary reasoning ` +
      "effort and note in the verdict that diversity was reduced.",
    ids: "Codex model slugs",
  });
}

export function validateCodexMarketplace(text, { expectedName, pathExists }) {
  const manifest = JSON.parse(text);
  const plugins = manifest.plugins ?? [];
  if (plugins.length !== 1) {
    throw new Error(`.agents/plugins/marketplace.json: expected 1 plugin entry, found ${plugins.length}`);
  }
  const [plugin] = plugins;
  if (plugin.name !== expectedName) {
    throw new Error(
      `.agents/plugins/marketplace.json: plugin name "${plugin.name}" != Codex manifest name "${expectedName}"`,
    );
  }
  const path = plugin.source?.path;
  if (!path || !pathExists(path)) {
    throw new Error(`.agents/plugins/marketplace.json: source.path "${path}" does not resolve to a directory`);
  }
}

// The Copilot manifest keeps the Claude Code plugin's name and points at a
// hooks file in the plugin. Copilot loads skills/ and agents/ by default.
export const SESSION_START_STATUS = "Loading pstack routing";
