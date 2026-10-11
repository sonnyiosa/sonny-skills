#!/usr/bin/env python3
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def read_json(path):
    return json.loads(path.read_text(encoding="utf-8"))


def check_layout():
    claude = read_json(ROOT / ".claude-plugin/marketplace.json")
    assert claude["name"] == "sonny-skills", "incorrect marketplace name"
    expected = {path.name for path in (ROOT / "plugins").iterdir() if path.is_dir()}
    entries = claude["plugins"]
    assert len(entries) == len(expected), "duplicate or missing Claude plugin entries"
    assert {entry["name"] for entry in entries} == expected, "Claude inventory differs from plugins/"

    for entry in entries:
        package = ROOT / "plugins" / entry["name"]
        source = entry["source"]
        assert isinstance(source, str) and source.startswith("./") and ".." not in Path(source).parts, f"wrong source for {entry['name']}"
        plugin = (ROOT / source).resolve()
        assert plugin.is_relative_to(package), f"wrong source for {entry['name']}"
        manifest = read_json(plugin / ".claude-plugin/plugin.json")
        assert manifest["name"] == entry["name"], f"wrong plugin name in {plugin}"
        assert manifest["version"] == entry["version"], f"stale Claude version for {entry['name']}"
        assert (package / "LICENSE").is_file(), f"missing license in {package}"
        skills = list((plugin / "skills").glob("*/SKILL.md"))
        assert skills, f"no discoverable skills in {plugin}"
        agents = manifest.get("agents", [])
        if isinstance(agents, str):
            agents = [agents]
        assert isinstance(agents, list), f"invalid agents in {plugin}"
        for path in agents:
            assert isinstance(path, str) and path.startswith("./") and path.endswith(".md") and ".." not in Path(path).parts, f"wrong agent path in {plugin}: {path}"
            agent = (plugin / path).resolve()
            assert agent.is_relative_to(plugin), f"wrong agent path in {plugin}: {path}"
            assert agent.is_file(), f"missing agent in {plugin}: {path}"

    for directory, manifest_directory, source_field in [
        (".agents/plugins", ".codex-plugin", "local"),
        (".muse-plugin", ".muse-plugin", "string"),
    ]:
        catalog = read_json(ROOT / directory / "marketplace.json")
        assert catalog["name"] == claude["name"], f"marketplace name drift in {directory}"
        supported = {name for name in expected if (ROOT / "plugins" / name / manifest_directory / "plugin.json").is_file()}
        assert len(catalog["plugins"]) == len(supported), f"duplicate or missing entries in {directory}"
        assert {entry["name"] for entry in catalog["plugins"]} == supported, f"incorrect inventory in {directory}"
        for entry in catalog["plugins"]:
            plugin = ROOT / "plugins" / entry["name"]
            source = f"./plugins/{entry['name']}"
            expected_source = {"source": "local", "path": source} if source_field == "local" else source
            assert entry["source"] == expected_source, f"wrong source in {directory} for {entry['name']}"
            manifest = read_json(plugin / manifest_directory / "plugin.json")
            assert manifest["name"] == entry["name"], f"wrong manifest name in {plugin}"
            assert manifest["version"] == entry["version"], f"stale version in {directory} for {entry['name']}"
            if source_field == "local":
                assert manifest["skills"] == "./skills/", f"wrong Codex skill path in {plugin}"
                assert manifest.get("hooks") == {}, f"Codex hook suppression missing in {plugin}"
                for field in ("composerIcon", "logo"):
                    resource = manifest.get("interface", {}).get(field)
                    if resource:
                        assert (plugin / resource).is_file(), f"missing {field} in {plugin}"

    for path in [".claude-plugin/plugin.json", ".codex-plugin/plugin.json", "package.json", "index.js", "gemini-extension.json", "hooks"]:
        assert not (ROOT / path).exists(), f"root still owns a runtime plugin at {path}"
    for name in expected:
        assert not (ROOT / "skills" / name).exists(), f"bundled skill mirror in root skills/{name}"
    print(f"PASS: sonny-skills owns {len(expected)} independent plugins with valid catalogs and resource paths")


if __name__ == "__main__":
    check_layout()
