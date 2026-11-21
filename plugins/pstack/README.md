# pstack

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-yellow?logo=buy-me-a-coffee&logoColor=white)](https://buymeacoffee.com/codenyer)
[![Mentioned in Awesome Claude Code](https://awesome.re/mentioned-badge.svg)](https://github.com/hesreallyhim/awesome-claude-code)

Lauren Tan's [pstack](https://github.com/cursor/plugins/tree/main/pstack) is an opinionated Cursor skill stack that improves agent outcomes. This bundle supports Claude Code and Codex. It tracks upstream and also carries named policy forks, each declared in [`tools/forks.json`](tools/forks.json).

Tell `poteto-mode` your goal and it will invoke the correct workflow for the task. It keeps your code concise, simple and verified.

For concurrency bugs and invariants that tests cannot reach, `/create-formal-verification-skill` picks the riskiest property in your code, verifies it with a tool that fits, and leaves a project skill the next agent reruns. The separate [agent-formal-verify](https://github.com/michael-denyer/agent-formal-verify) plugin goes deeper on the method, with guided TLA+ model checking, Lean proofs, and Kani for Rust.

## Built for Claude Code

This port translates upstream's Cursor skills for Claude Code before installation. [Upstream's Claude Code install](https://github.com/cursor/plugins/tree/0b46ec3/harness/pstack/claude-code) asks agents to translate Cursor names at runtime, using extra tokens and relying on them to apply the mapping correctly. This port also adds a SessionStart hook that routes tasks to `poteto-mode`.

## Install

<details>
<summary><strong>Claude Code</strong></summary>

In Claude Code, add the Sonny Skills marketplace if needed and install pstack:

```text
/plugin marketplace add sonnyiosa/sonny-skills
/plugin install pstack@sonny-skills
```

Claude Code leaves auto-update off for third-party marketplaces, so pstack stays on the version you installed. To turn it on, run `/plugin`, open the **Marketplaces** tab, select `sonny-skills`, and choose **Enable auto-update**. To update once by hand, run `claude plugin update pstack@sonny-skills`.

</details>

<a id="codex"></a>
<details>
<summary><strong>Codex</strong></summary>

Run in your terminal:

```shell
codex plugin marketplace add sonnyiosa/sonny-skills
codex plugin add pstack@sonny-skills
```

Invoke a skill by typing `$` and its name, such as `$poteto-mode` or `$babysit`, then choosing its entry, which inserts `$pstack:<name>`. `/skills` lists every skill.

</details>

### Configure

The Claude Code and Codex plugins use a SessionStart hook to load the poteto-mode routing instruction.

Run `setup-pstack` to turn automatic routing on or off, change model defaults, or set a reasoning effort per role (`arena runners: opus @xhigh, fable @max`). Set `PSTACK_SESSION_HOOK=off` to turn off routing for the current environment.

## Getting started

```text
Use poteto-mode to fix the search filter resetting when I change pages.
```

For a bug, it reproduces the failure, uses `how` and `why` to investigate, delegates the fix, then reruns the failing case. If the fix crosses a function boundary, it brings in `architect` before implementation. You receive the fix and the failing and passing evidence.

A localized bug with a demonstrated cause can use the [focused-fix exception](plugins/pstack/skills/poteto-mode/playbooks/bug-fix.md#focused-fix-exception). One delegate investigates and implements the correction when it preserves existing interfaces and state semantics and has a focused regression check. Reproduction, verification, and required independent review still apply; a small patch alone does not qualify.

[Other playbooks](plugins/pstack/skills/poteto-mode/SKILL.md#playbooks) cover planning, features, refactoring, performance issues, investigations, prototypes, PR maintenance, shipping, and longer projects.

![poteto-mode on Claude Code and Codex turns a request into verified work. Choose a playbook, plan and delegate with architect, arena, or swarm, then review and verify with interrogate, tests, and measurements. Project playbooks customize the workflow, and setup-pstack configures the model and reasoning effort per role. Supporting skills include how, why, and unslop.](assets/pstack-overview.png)

## Details

- [Skills and slash commands](docs/reference.md#slash-commands)
- [Runtime setup](docs/reference.md#runtime-support)
- [Models and dependencies](docs/reference.md#configuration-and-dependencies)
- [Maintenance and port scope](docs/reference.md#maintenance)

## Data handling

pstack has no server or telemetry. Anything its skills ask your agent to read, including session transcripts, goes to your model provider. Scripts run locally, and PR tools use your GitHub CLI login.

This port has no automatic agent-diary reporting or diary opt-in setting. For a local decision trail, ask for [`show-me-your-work`](plugins/pstack/skills/show-me-your-work/SKILL.md). Longer or unattended workflows also invoke it. The trail stays uncommitted by default. If the trail is committed and pushed to a shared PR, anyone with access to the PR can read it.

To share feedback, submit a short, manually reviewed report through [GitHub issues](https://github.com/michael-denyer/pstack-claude/issues). Include the pstack version, runtime, relevant workflow, and observed result. Remove credentials, customer data, private repository links, and sensitive log or configuration values before posting; share a summary instead of raw transcripts.

## Contributing

Thanks for helping make this port better. Bug reports, documentation fixes, and runtime improvements are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for the checks and where your change belongs. Report vulnerabilities privately as described in [SECURITY.md](SECURITY.md).

To support maintenance of this port, [buy the maintainer a coffee](https://buymeacoffee.com/codenyer).

## License

This port, including its modifications and additions, is also [MIT-licensed](LICENSE), © 2026 Michael Denyer. Original pstack © 2026 Lauren Tan; imported cursor-team-kit and thermos skills © 2026 Cursor. See [LICENSE-cursor-team-kit](LICENSE-cursor-team-kit), [LICENSE-thermos](LICENSE-thermos), and [NOTICE.md](NOTICE.md).
