// Runtime packaging contracts: manifests and hook commands.
import { describe, expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { validateHooks } from "../tools/generate.mjs";
import { validateCodexMarketplace } from "../tools/runtimes.mjs";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));

describe("validateCodexMarketplace", () => {
  const manifest = (plugins) => JSON.stringify({ plugins });
  test("needs one entry whose name matches and whose path exists", () => {
    const ok = { name: "pstack", source: { path: "./plugins/pstack" } };
    expect(() =>
      validateCodexMarketplace(manifest([ok]), { expectedName: "pstack", pathExists: () => true }),
    ).not.toThrow();
    expect(() => validateCodexMarketplace(manifest([]), { expectedName: "pstack", pathExists: () => true })).toThrow(
      "expected 1 plugin entry, found 0",
    );
    expect(() =>
      validateCodexMarketplace(manifest([{ ...ok, name: "other" }]), { expectedName: "pstack", pathExists: () => true }),
    ).toThrow('plugin name "other" != Codex manifest name "pstack"');
    expect(() => validateCodexMarketplace(manifest([ok]), { expectedName: "pstack", pathExists: () => false })).toThrow(
      "does not resolve to a directory",
    );
  });
});

function codexHookEvents(read) {
  const root = read("plugin.json");
  if (root !== null && JSON.parse(root).$schema?.startsWith("https://agent-plugins.org/schemas/")) return [];
  const { hooks } = JSON.parse(read(".codex-plugin/plugin.json"));
  return Object.keys(JSON.parse(read(hooks)).hooks);
}

describe("Codex hook discovery", () => {
  const pluginRoot = join(repoRoot, "plugins/pstack");
  const shipped = (rel) => (existsSync(join(pluginRoot, rel)) ? readFileSync(join(pluginRoot, rel), "utf8") : null);

  test("Codex registers the shipped SessionStart hook", () => {
    expect(codexHookEvents(shipped)).toContain("SessionStart");
  });

  test("an Agent Plugins manifest at the plugin root hides the hooks, as 0.9.83 did", () => {
    const manifest = JSON.stringify({ $schema: "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json", name: "pstack" });
    expect(codexHookEvents((rel) => (rel === "plugin.json" ? manifest : shipped(rel)))).toEqual([]);
  });
});

describe("validateHooks", () => {
  const hooks = (command, commandWindows, powershell) =>
    JSON.stringify({ hooks: { SessionStart: [{ hooks: [{ type: "command", command, commandWindows, powershell }] }] } });
  const exec = { mode: 0o755 };
  const plain = { mode: 0o644 };

  test("accepts an executable script under the plugin root", () => {
    const statOf = (rel) => (rel === "hooks/session-start.sh" ? exec : null);
    expect(() => validateHooks(hooks('"${CLAUDE_PLUGIN_ROOT}/hooks/session-start.sh"'), { statOf })).not.toThrow();
  });

  test("checks the script, not the runtime argument after it", () => {
    const cmd = hooks('"${CLAUDE_PLUGIN_ROOT}/hooks/session-start.sh" codex');
    const statOf = (rel) => (rel === "hooks/session-start.sh" ? exec : null);
    expect(() => validateHooks(cmd, { statOf })).not.toThrow();
    expect(() => validateHooks(cmd, { statOf: () => plain })).toThrow("hooks/session-start.sh is not executable");
    expect(() => validateHooks(cmd, { statOf: () => null, file: "hooks/codex-hooks.json" })).toThrow(
      "hooks/codex-hooks.json:\n  SessionStart: hooks/session-start.sh does not exist",
    );
  });

  test("checks references under the runtime's own root variable", () => {
    const statOf = (rel) => (rel === "hooks/session-start.sh" ? exec : null);
    const copilotCmd = hooks('"${COPILOT_PLUGIN_ROOT}/hooks/session-start.sh" copilot');
    expect(() => validateHooks(copilotCmd, { statOf, root: "COPILOT_PLUGIN_ROOT" })).not.toThrow();
    expect(() => validateHooks(copilotCmd, { statOf })).toThrow("command does not reference ${CLAUDE_PLUGIN_ROOT}");
    expect(() => validateHooks(hooks('"${CLAUDE_PLUGIN_ROOT}/hooks/session-start.sh"'), { statOf, root: "COPILOT_PLUGIN_ROOT" })).toThrow(
      "command does not reference ${COPILOT_PLUGIN_ROOT}",
    );
  });

  test("names a missing or non-executable target", () => {
    expect(() => validateHooks(hooks('"${CLAUDE_PLUGIN_ROOT}/hooks/nope"'), { statOf: () => null })).toThrow(
      "SessionStart: hooks/nope does not exist",
    );
    expect(() => validateHooks(hooks('"${CLAUDE_PLUGIN_ROOT}/hooks/session-start.sh"'), { statOf: () => plain })).toThrow(
      "hooks/session-start.sh is not executable",
    );
  });

  test("a host without POSIX execute bits still checks every hook path", () => {
    const cmd = hooks('"${CLAUDE_PLUGIN_ROOT}/hooks/session-start.sh"');
    expect(() => validateHooks(cmd, { statOf: () => plain, checkExecutable: false })).not.toThrow();
    expect(() => validateHooks(cmd, { statOf: () => null, checkExecutable: false })).toThrow(
      "SessionStart: hooks/session-start.sh does not exist",
    );
  });

  test("checks the Windows override path without requiring an executable bit for PowerShell", () => {
    const cmd = hooks(
      '"${CLAUDE_PLUGIN_ROOT}/hooks/session-start.sh" codex',
      'powershell.exe -NoProfile -ExecutionPolicy Bypass -File "${CLAUDE_PLUGIN_ROOT}/hooks/session-start.ps1"',
    );
    const statOf = (rel) => rel.endsWith(".sh") ? exec : plain;
    expect(() => validateHooks(cmd, { statOf })).not.toThrow();
    expect(() => validateHooks(cmd, { statOf: (rel) => rel.endsWith(".sh") ? exec : null })).toThrow(
      "SessionStart: hooks/session-start.ps1 does not exist",
    );
  });

  test("checks a Copilot PowerShell override under the runtime's own root variable", () => {
    const root = "COPILOT_PLUGIN_ROOT";
    const sh = '"${COPILOT_PLUGIN_ROOT}/hooks/session-start.sh" copilot';
    const ps = 'powershell.exe -NoProfile -ExecutionPolicy Bypass -File "$env:COPILOT_PLUGIN_ROOT/hooks/session-start.ps1" copilot';
    const statOf = (rel) => (rel.endsWith(".sh") ? exec : plain);
    expect(() => validateHooks(hooks(sh, undefined, ps), { statOf, root })).not.toThrow();
    expect(() => validateHooks(hooks(sh, undefined, ps), { statOf: (rel) => (rel.endsWith(".sh") ? exec : null), root })).toThrow(
      "SessionStart: hooks/session-start.ps1 does not exist",
    );
    const otherRoot = 'powershell.exe -File "$env:CLAUDE_PLUGIN_ROOT/hooks/session-start.ps1"';
    expect(() => validateHooks(hooks(sh, undefined, otherRoot), { statOf, root })).toThrow("does not reference ${COPILOT_PLUGIN_ROOT}");
  });

  test("accepts exit 0 as the only PowerShell override that names no plugin file", () => {
    const root = "COPILOT_PLUGIN_ROOT";
    const sh = '"${COPILOT_PLUGIN_ROOT}/hooks/pre-tool-use.sh"';
    expect(() => validateHooks(hooks(sh, undefined, "exit 0"), { statOf: () => exec, root })).not.toThrow();
    for (const ps of [
      'powershell.exe -File "$env:COPILOT_PLUGN_ROOT/hooks/session-start.ps1" copilot',
      'powershell.exe -File "${COPILOT_PLUGIN_ROOT}/hooks/missing.ps1" copilot',
      "Write-Output allow",
    ]) {
      expect(() => validateHooks(hooks(sh, undefined, ps), { statOf: () => exec, root })).toThrow("does not reference ${COPILOT_PLUGIN_ROOT}");
    }
  });

  test("names a hook without a command, even when it has a Windows override", () => {
    const windows = 'powershell.exe -File "${CLAUDE_PLUGIN_ROOT}/hooks/session-start.ps1"';
    for (const cmd of [hooks(undefined), hooks(undefined, windows)]) {
      expect(() => validateHooks(cmd, { statOf: () => plain })).toThrow(
        "SessionStart: hook must have required properties command",
      );
    }
  });

  test("faults a Windows override that is not a string and names the file", () => {
    const cmd = hooks('"${CLAUDE_PLUGIN_ROOT}/hooks/session-start.sh"', 5);
    expect(() => validateHooks(cmd, { statOf: () => exec, file: "hooks/codex-hooks.json" })).toThrow(
      "hooks/codex-hooks.json:\n  SessionStart: commandWindows must be string",
    );
  });

  test("faults a key no hook type documents, so a misspelt override is not dropped", () => {
    const hook = { type: "command", command: '"${CLAUDE_PLUGIN_ROOT}/hooks/session-start.sh"', commandWindow: "x.ps1" };
    const cmd = JSON.stringify({ hooks: { SessionStart: [{ hooks: [hook] }] } });
    expect(() => validateHooks(cmd, { statOf: () => exec })).toThrow("SessionStart: unknown key commandWindow");
  });

  test("accepts a prompt hook, which carries a prompt instead of a command", () => {
    const stop = (hook) => JSON.stringify({ hooks: { Stop: [{ hooks: [hook] }] } });
    expect(() => validateHooks(stop({ type: "prompt", prompt: "Review $ARGUMENTS" }), { statOf: () => null })).not.toThrow();
    expect(() => validateHooks(stop({ type: "prompt" }), { statOf: () => null })).toThrow(
      "Stop: hook must have required properties prompt",
    );
    expect(() => validateHooks(stop({ type: "webhook", command: "x" }), { statOf: () => null })).toThrow(
      'Stop: hook type "webhook" is not one of command, http, mcp_tool, prompt, agent',
    );
    expect(() => validateHooks(stop({ type: "constructor" }), { statOf: () => null })).toThrow(
      'Stop: hook type "constructor" is not one of command, http, mcp_tool, prompt, agent',
    );
  });

  test("faults an event whose value is not a list of matcher groups", () => {
    expect(() => validateHooks(JSON.stringify({ hooks: { SessionStart: {} } }), { statOf: () => exec })).toThrow(
      "hooks/hooks.json:\n  hooks.SessionStart must be array",
    );
  });

  test("a file the command reads only has to exist", () => {
    const cmd = hooks('cat "${CLAUDE_PLUGIN_ROOT}/hooks/session-start-context.md"');
    expect(() => validateHooks(cmd, { statOf: () => plain })).not.toThrow();
    expect(() => validateHooks(cmd, { statOf: () => null })).toThrow(
      "SessionStart: hooks/session-start-context.md does not exist",
    );
  });

  test("rejects a command that does not go through the plugin root", () => {
    expect(() => validateHooks(hooks("cat /etc/motd"), { statOf: () => exec })).toThrow(
      "does not reference ${CLAUDE_PLUGIN_ROOT}",
    );
  });
});
