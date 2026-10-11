import contextlib
import importlib.util
import io
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch


SCRIPT = Path(__file__).resolve().parents[1] / "scripts/check-layout.py"
SPEC = importlib.util.spec_from_file_location("check_layout", SCRIPT)
layout = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(layout)


class CheckLayoutTests(unittest.TestCase):
    def setUp(self):
        temporary = tempfile.TemporaryDirectory()
        self.addCleanup(temporary.cleanup)
        self.root = Path(temporary.name).resolve()
        self.package = self.root / "plugins/example"
        self.package.mkdir(parents=True)
        (self.package / "LICENSE").write_text("Fixture license", encoding="utf-8")
        for directory in (".agents/plugins", ".muse-plugin"):
            self.write_json(self.root / directory / "marketplace.json", {
                "name": "sonny-skills", "plugins": [],
            })

    def write_json(self, path, data):
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(data), encoding="utf-8")

    def catalog(self, source):
        self.write_json(self.root / ".claude-plugin/marketplace.json", {
            "name": "sonny-skills",
            "plugins": [{"name": "example", "version": "1.0.0", "source": source}],
        })

    def plugin(self, nested=False, agents=None):
        plugin = self.package / "plugins/example" if nested else self.package
        manifest = {"name": "example", "version": "1.0.0"}
        if agents is not None:
            manifest["agents"] = agents
        self.write_json(plugin / ".claude-plugin/plugin.json", manifest)
        skill = plugin / "skills/example/SKILL.md"
        skill.parent.mkdir(parents=True)
        skill.write_text("Fixture skill", encoding="utf-8")
        self.catalog(f"./{plugin.relative_to(self.root)}")
        return plugin

    def check(self):
        with patch.object(layout, "ROOT", self.root), contextlib.redirect_stdout(io.StringIO()):
            layout.check_layout()

    def test_flat_source(self):
        self.plugin()
        self.check()

    def test_nested_source(self):
        self.plugin(nested=True)
        self.check()

    def test_wrapper_source_fails(self):
        self.plugin(nested=True)
        self.catalog("./plugins/example")
        with self.assertRaises(FileNotFoundError):
            self.check()

    def test_missing_skills_fails(self):
        plugin = self.plugin(nested=True)
        (plugin / "skills/example/SKILL.md").unlink()
        with self.assertRaisesRegex(AssertionError, "no discoverable skills"):
            self.check()

    def test_license_stays_at_package_root(self):
        plugin = self.plugin(nested=True)
        (self.package / "LICENSE").rename(plugin / "LICENSE")
        with self.assertRaisesRegex(AssertionError, "missing license"):
            self.check()

    def test_explicit_agents(self):
        plugin = self.plugin(nested=True)
        for path in ("agents/example.md", "effort-agents/example.md"):
            agent = plugin / path
            agent.parent.mkdir(parents=True)
            agent.write_text("Fixture agent", encoding="utf-8")
        for agents in ("./agents/example.md", ["./agents/example.md", "./effort-agents/example.md"]):
            with self.subTest(agents=agents):
                self.write_json(plugin / ".claude-plugin/plugin.json", {
                    "name": "example", "version": "1.0.0", "agents": agents,
                })
                self.check()

    def test_agent_directory_fails(self):
        plugin = self.plugin(nested=True)
        for path in ("./agents/", "./agents.md"):
            with self.subTest(path=path):
                (plugin / path).mkdir()
                self.write_json(plugin / ".claude-plugin/plugin.json", {
                    "name": "example", "version": "1.0.0", "agents": [path],
                })
                with self.assertRaisesRegex(AssertionError, "wrong agent path|missing agent"):
                    self.check()

    def test_missing_agent_fails(self):
        self.plugin(agents=["./effort-agents/missing.md"])
        with self.assertRaisesRegex(AssertionError, "missing agent"):
            self.check()

    def test_invalid_source_fails(self):
        self.plugin()
        for source in ("plugins/example", str(self.package), "./plugins/example/../example", "./plugins", "./outside"):
            with self.subTest(source=source):
                self.catalog(source)
                with self.assertRaisesRegex(AssertionError, "wrong source"):
                    self.check()

    def test_source_symlink_inside_package(self):
        plugin = self.plugin(nested=True)
        (self.package / "runtime").symlink_to(plugin, target_is_directory=True)
        self.catalog("./plugins/example/runtime")
        self.check()

    def test_source_symlink_escape_fails(self):
        plugin = self.plugin(nested=True)
        outside = self.root / "outside"
        plugin.rename(outside)
        plugin.symlink_to(outside, target_is_directory=True)
        with self.assertRaisesRegex(AssertionError, "wrong source"):
            self.check()

    def test_agent_escape_fails(self):
        self.plugin(agents=["./../../outside.md"])
        (self.root / "outside.md").write_text("Outside agent", encoding="utf-8")
        with self.assertRaisesRegex(AssertionError, "wrong agent path"):
            self.check()

    def test_agent_symlink_escape_fails(self):
        plugin = self.plugin(agents=["./agent.md"])
        outside = self.root / "outside.md"
        outside.write_text("Outside agent", encoding="utf-8")
        (plugin / "agent.md").symlink_to(outside)
        with self.assertRaisesRegex(AssertionError, "wrong agent path"):
            self.check()


if __name__ == "__main__":
    unittest.main()
