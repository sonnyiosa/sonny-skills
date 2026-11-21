// Each runtime's shipped SessionStart command, run for real: the mandate is
// injected unless that runtime's model sheet turns it off.
import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { chmodSync, cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { agentSkills } from "../tools/generate.mjs";
import { SESSION_START_STATUS } from "../tools/runtimes.mjs";
import { sessionHookValues, sheetCases, writeSheet } from "./session-hook-sheets.mjs";

const pluginRoot = fileURLToPath(new URL("../plugins/pstack/", import.meta.url));
const mandate = readFileSync(join(pluginRoot, "hooks/session-start-context.md"), "utf8");
const codexManifest = JSON.parse(readFileSync(join(pluginRoot, ".codex-plugin/plugin.json"), "utf8"));
const sessionStart = Object.fromEntries(
  Object.entries({ claude: "hooks/hooks.json", codex: codexManifest.hooks }).map(([runtime, file]) => [
    runtime,
    JSON.parse(readFileSync(join(pluginRoot, file), "utf8")).hooks.SessionStart[0],
  ]),
);

// Codex puts the plugin's path into the command string itself, so a hook can
// run without CLAUDE_PLUGIN_ROOT in its environment.
const expandRoot = (command, root) => command.replaceAll("${CLAUDE_PLUGIN_ROOT}", root);

// CODEX_HOME and CLAUDE_CONFIG_DIR are only present when the user has
// relocated that runtime's directory. PLUGIN_ROOT is a generic name any shell
// profile may export, so it must not move a Claude Code session to Codex's sheet.
const runtimes = {
  claude: { hooks: "claude", sheetDir: ".claude", env: () => ({}) },
  "claude with CLAUDE_CONFIG_DIR": {
    hooks: "claude",
    sheetDir: "claude-config",
    env: (sheetRoot) => ({ CLAUDE_CONFIG_DIR: sheetRoot }),
  },
  "claude with PLUGIN_ROOT exported": { hooks: "claude", sheetDir: ".claude", env: () => ({ PLUGIN_ROOT: pluginRoot }) },
  codex: { hooks: "codex", sheetDir: ".codex", env: () => ({}) },
  "codex with CODEX_HOME": {
    hooks: "codex",
    sheetDir: "codex-home",
    env: (sheetRoot) => ({ CODEX_HOME: sheetRoot }),
  },
  // Codex may not export CLAUDE_PLUGIN_ROOT, and starts the hook in the
  // session's directory, so the hook finds the plugin from its own path.
  "codex without CLAUDE_PLUGIN_ROOT": {
    hooks: "codex",
    sheetDir: ".codex",
    cwd: tmpdir(),
    command: expandRoot(sessionStart.codex.hooks[0].command, pluginRoot),
    env: () => ({ CLAUDE_PLUGIN_ROOT: undefined }),
  },
  "codex with CODEX_HOME without CLAUDE_PLUGIN_ROOT": {
    hooks: "codex",
    sheetDir: "codex-home",
    cwd: tmpdir(),
    command: expandRoot(sessionStart.codex.hooks[0].command, pluginRoot),
    env: (sheetRoot) => ({ CLAUDE_PLUGIN_ROOT: undefined, CODEX_HOME: sheetRoot }),
  },
};

function runHook(runtime, sheet, command, extraEnv = {}) {
  const home = mkdtempSync(join(tmpdir(), "pstack-hook-"));
  const { sheetDir, env, cwd, hooks } = runtimes[runtime];
  command ??= runtimes[runtime].command ?? sessionStart[hooks].hooks[0].command;
  const sheetRoot = join(home, sheetDir);
  if (sheet !== null) {
    mkdirSync(sheetRoot, { recursive: true });
    writeSheet(join(sheetRoot, "pstack-models.md"), sheet);
  }
  try {
    const r = spawnSync("sh", ["-c", command], {
      cwd,
      env: { PATH: process.env.PATH, HOME: home, CLAUDE_PLUGIN_ROOT: pluginRoot, ...env(sheetRoot), ...extraEnv },
      encoding: "utf8",
    });
    return { status: r.status, out: r.stdout, err: r.stderr };
  } finally {
    rmSync(home, { recursive: true, force: true });
  }
}

describe("SessionStart hook", () => {
  // The manifest names Codex's own hooks file instead of relying on Codex's
  // default discovery; `resume` keeps the mandate present after a restart.
  test("declares the hook in the Codex manifest", () => {
    expect(codexManifest.hooks).toBe("./hooks/codex-hooks.json");
    expect(sessionStart.claude.matcher).toBe("startup|resume|clear|compact");
    expect(sessionStart.codex.matcher).toBe("startup|resume|clear|compact");
  });

  // Codex shows a hook without a statusMessage under a generic label when it
  // asks the user to trust it.
  test("names the hook for Claude Code and Codex", () => {
    expect(sessionStart.claude.hooks[0].statusMessage).toBe(SESSION_START_STATUS);
    expect(sessionStart.codex.hooks[0].statusMessage).toBe(SESSION_START_STATUS);
  });

  test.each([
    ["Claude Code", mandate],
  ])("the %s mandate names only skills that exist", (_, text, pattern = /(?:pstack:|`\/)([a-z0-9-]+)/g) => {
    const named = [...text.matchAll(pattern)].map((m) => m[1]);
    const skills = new Set(agentSkills(join(pluginRoot, "skills")).map(({ name }) => name));
    expect(named).toContain("poteto-mode");
    expect(named.filter((name) => !skills.has(name))).toEqual([]);
  });

  for (const arg of ["cursor", ""]) {
    test(`fails on runtime argument ${JSON.stringify(arg)}`, () => {
      const r = runHook("claude", null, `"\${CLAUDE_PLUGIN_ROOT}/hooks/session-start.sh" ${arg}`);
      expect(r.status).not.toBe(0);
      expect(r.out).toBe("");
      expect(r.err.trimEnd().split("\n")).toEqual([`session-start.sh: unknown runtime '${arg}' (expected claude or codex)`]);
    });
  }

  for (const runtime of Object.keys(runtimes)) {
    const expected = (off) => off ? "" : mandate;
    describe(runtime, () => {
      test("injects the mandate when no sheet exists", () => {
        const r = runHook(runtime, null);
        expect(r).toEqual({ status: 0, out: expected(false), err: "" });
      });

      for (const { name, sheet, off } of sheetCases) {
        test(`${off ? "injects nothing" : "injects the mandate"} when the sheet has ${name}`, () => {
          const r = runHook(runtime, sheet);
          expect(r).toEqual({ status: 0, out: expected(off), err: "" });
        });
      }

      // A cloud session starts with an empty home, so no user sheet survives it.
      for (const [label, value, off] of sessionHookValues) {
        test(`${off ? "injects nothing" : "injects the mandate"} when PSTACK_SESSION_HOOK is ${label} and no sheet exists`, () => {
          const r = runHook(runtime, null, undefined, { PSTACK_SESSION_HOOK: value });
          expect(r).toEqual({ status: 0, out: expected(off), err: "" });
        });
      }

      for (const [value, sheet] of [["off", "session hook: on\n"], ["on", "session hook: off\n"]]) {
        test(`injects nothing when PSTACK_SESSION_HOOK is "${value}" and the sheet has "${sheet.trim()}"`, () => {
          const r = runHook(runtime, sheet, undefined, { PSTACK_SESSION_HOOK: value });
          expect(r).toEqual({ status: 0, out: expected(true), err: "" });
        });
      }
    });
  }

  test("a Claude Code project's own sheet replaces the user's sheet", () => {
    const home = mkdtempSync(join(tmpdir(), "pstack-hook-"));
    const project = join(home, "project");
    const sheet = (dir, text) => {
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, "pstack-models.md"), text);
    };
    const run = (projectDir) =>
      spawnSync("sh", ["-c", sessionStart.claude.hooks[0].command], {
        env: { PATH: process.env.PATH, HOME: home, CLAUDE_PLUGIN_ROOT: pluginRoot, CLAUDE_PROJECT_DIR: projectDir },
        encoding: "utf8",
      }).stdout;
    try {
      mkdirSync(project);
      sheet(join(home, ".claude"), "session hook: off\n");
      expect(run(project)).toBe("");
      sheet(join(project, ".claude"), "session hook: on\n");
      expect(run(project)).toBe(mandate);
      expect(run(undefined)).toBe("");
      sheet(join(project, ".claude"), "session hook: off\n");
      rmSync(join(home, ".claude"), { recursive: true });
      expect(run(project)).toBe("");
    } finally {
      rmSync(home, { recursive: true, force: true });
    }
  });

  // Claude Code sets CLAUDE_PROJECT_DIR to the directory it starts in, which
  // can be below the repository root that holds the committed sheet.
  test("a Claude Code session started in a subdirectory reads the repository's sheet", () => {
    const home = mkdtempSync(join(tmpdir(), "pstack-hook-"));
    const repo = join(home, "repo");
    try {
      mkdirSync(join(repo, ".claude"), { recursive: true });
      mkdirSync(join(repo, "sub", "deep"), { recursive: true });
      writeFileSync(join(repo, ".claude", "pstack-models.md"), "session hook: off\n");
      expect(spawnSync("git", ["init", repo]).status).toBe(0);
      const out = spawnSync("sh", ["-c", sessionStart.claude.hooks[0].command], {
        env: { PATH: process.env.PATH, HOME: home, CLAUDE_PLUGIN_ROOT: pluginRoot, CLAUDE_PROJECT_DIR: join(repo, "sub", "deep") },
        encoding: "utf8",
      }).stdout;
      expect(out).toBe("");
    } finally {
      rmSync(home, { recursive: true, force: true });
    }
  });
});

describe("Codex SessionStart without CLAUDE_PLUGIN_ROOT", () => {
  // A plugin copy whose path has a space, beside a directory the session starts in.
  function withCopy(name, body) {
    const tmp = mkdtempSync(join(tmpdir(), "pstack-codex-"));
    const copy = (dir) => {
      const root = join(tmp, "plugin cache", dir);
      for (const sub of ["hooks", "skills/setup-pstack/scripts"]) cpSync(join(pluginRoot, sub), join(root, sub), { recursive: true });
      writeFileSync(join(root, "hooks/session-start-context.md"), `mandate from ${dir}\n`);
      return root;
    };
    mkdirSync(join(tmp, "project dir"), { recursive: true });
    try {
      return body({ tmp, root: copy(name), copy, project: join(tmp, "project dir"), home: join(tmp, "home") });
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  }
  const run = (command, { home, cwd, env = {} }) => {
    const r = spawnSync("sh", ["-c", command], { cwd, env: { PATH: process.env.PATH, HOME: home, ...env }, encoding: "utf8" });
    return { status: r.status, out: r.stdout, err: r.stderr };
  };
  const shipped = sessionStart.codex.hooks[0].command;

  test("runs the shipped command from an install path with spaces, started in another directory", () =>
    withCopy("pstack 0.9", ({ root, project, home }) => {
      expect(run(expandRoot(shipped, root), { home, cwd: project })).toEqual({ status: 0, out: "mandate from pstack 0.9\n", err: "" });
    }));

  test("reads the sheet through the plugin's own reader", () =>
    withCopy("pstack 0.9", ({ root, project, home }) => {
      mkdirSync(join(home, ".codex"), { recursive: true });
      writeFileSync(join(home, ".codex", "pstack-models.md"), "session hook: on\n");
      // A reader that turns the hook off proves the hook ran the copy's reader.
      writeFileSync(join(root, "skills/setup-pstack/scripts/read-sheet.sh"), "#!/bin/sh\necho 'session hook: off'\n");
      expect(run(expandRoot(shipped, root), { home, cwd: project })).toEqual({ status: 0, out: "", err: "" });
    }));

  test("an explicit CLAUDE_PLUGIN_ROOT still names the plugin", () =>
    withCopy("pstack 0.9", ({ root, copy, project, home }) => {
      const other = copy("other pstack");
      const env = { CLAUDE_PLUGIN_ROOT: other };
      expect(run(expandRoot(shipped, root), { home, cwd: project, env })).toEqual({ status: 0, out: "mandate from other pstack\n", err: "" });
    }));

  test("an empty CLAUDE_PLUGIN_ROOT counts as unset", () =>
    withCopy("pstack 0.9", ({ root, project, home }) => {
      const env = { CLAUDE_PLUGIN_ROOT: "" };
      expect(run(expandRoot(shipped, root), { home, cwd: project, env })).toEqual({ status: 0, out: "mandate from pstack 0.9\n", err: "" });
    }));

  // `cd` prints its target when CDPATH supplies it, which would join the plugin root to its own copy.
  test("finds the plugin from a relative script path, whatever CDPATH holds", () =>
    withCopy("pstack 0.9", ({ tmp, project, home }) => {
      const decoy = join(tmp, "decoy");
      mkdirSync(join(decoy, "pstack 0.9", "hooks"), { recursive: true });
      const cwd = join(tmp, "plugin cache");
      for (const script of ["pstack 0.9/hooks/session-start.sh", "./pstack 0.9/hooks/session-start.sh"]) {
        expect(run(`sh "${script}" codex`, { home, cwd, env: { CDPATH: decoy } })).toEqual({ status: 0, out: "mandate from pstack 0.9\n", err: "" });
      }
      expect(run(`cd '${join(cwd, "pstack 0.9", "hooks")}' && sh session-start.sh codex`, { home, cwd: project })).toEqual({
        status: 0,
        out: "mandate from pstack 0.9\n",
        err: "",
      });
    }));
});
