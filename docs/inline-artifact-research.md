# OpenCode and inline artifact research

## OpenCode’s actual interaction model

OpenCode treats tools as typed capabilities that an LLM can invoke, with permissions resolving each action to `allow`, `ask`, or `deny`.[1] The built-in tool surface includes read, edit, write, grep, glob, LSP, webfetch, websearch, skill, todowrite, task, and question. MCP servers extend the same tool model rather than becoming a separate visual universe. The key UI implication is that Lattice should show tool calls as typed transcript parts with status, input/output summaries, and permission outcomes.

OpenCode’s question tool is a first-class tool. Each question has a header, question text, options, and optional custom answer. Multiple questions are navigable before one final submission. Lattice’s current structured question flow is directionally correct, but it should be displayed as an inline paused tool part attached to the assistant turn instead of as an isolated dashboard card.

OpenCode’s permissions are granular and scoped. A tool can run automatically, ask for approval, or be denied; patterns can match tool inputs, MCP namespaces, agent modes, and external directories.[2] The design implication is that approvals and blocked operations should appear inline exactly where the tool call occurred, with concise actions such as **Allow once**, **Allow for this session**, **Reject**, or **Use a safer alternative**. Lattice must keep its stricter product boundary: no local shell or arbitrary machine execution is exposed, so its tool registry can contain safe rendering, web search, remote-only MCP, memory, source reads, and artifact operations only.

OpenCode sessions are resumable and addressable. The CLI supports continuing, forking, attaching to a running backend, choosing a model or agent, and returning formatted or raw JSON events.[3] The design implication is that the durable unit should be the **session transcript**, and every agent output should be a typed part inside that transcript. Plans, thoughts, tool calls, question requests, subagent delegation, artifacts, citations, and completion summaries should not be rendered as unrelated panels.

OpenCode explicitly supports primary and subagent modes, agent-specific permissions, MCP server management, model listing, session listing, and stats. Lattice should mirror this through one primary conversation with nested, read-only subagent parts. The user can inspect a delegated session but cannot directly message the subagent, because all continuation and permission decisions belong to the primary orchestrator.

## Inline artifact model

Open WebUI’s artifact documentation describes artifacts as substantial, standalone generated content that can be viewed, modified, built upon, or referenced separately from the main conversation.[4] It supports single-page HTML, SVG, complete HTML/CSS/JavaScript webpages, and ThreeJS/D3 visualizations. It uses a sandboxed `srcdoc` iframe with optional Content Security Policy, and supports version switching, copying, full-screen viewing, and targeted revisions.[4]

For Lattice, this should become an **inline work product** inside the assistant turn. The transcript should show a compact artifact header, a safe rendered preview by default for visual formats, and a source toggle for inspection. The artifact should only expand into a larger view when the user chooses it. A persistent artifact sidebar should not be the primary interaction.

| Format | Inline default | Safe rendering strategy |
|---|---|---|
| HTML/CSS/JS | Rendered preview plus Source toggle | Sandboxed iframe with restrictive CSP, no network access, no parent access, no arbitrary host APIs |
| JSX/React | Source plus component preview when transpilation is available | Render only through a controlled preview adapter; otherwise show syntax-highlighted source and a safe static fallback |
| Mermaid | Rendered diagram plus source toggle | Mermaid renderer with sanitization and no executable HTML labels |
| CSV/TSV | Table preview plus raw data toggle | Parse into bounded rows/columns; cap size and never execute formulas or macros |
| Markdown | Rendered document plus source toggle | Sanitized Markdown renderer; links are visible and safe, raw HTML restricted |
| SVG | Rendered image plus source toggle | Sanitized SVG; remove scripts, event handlers, external references, and dangerous URLs |
| JSON/YAML | Structured tree plus raw source toggle | Parse and display data only; no evaluation |
| Image/document | Inline preview plus metadata | Browser-safe object URL or sanitized document renderer; no active content |

The inline artifact card should offer **Rendered**, **Source**, **History**, **Copy**, **Download**, **Save to project**, and **Ask for a revision**. The revision action returns to the primary composer and keeps the artifact attached to the original assistant turn.

## Interaction decision

Remove the persistent `Task progress` sidebar block and remove the default always-open right artifact canvas. Keep a compact recent-chat sidebar and use the central transcript as the workspace. Activity should be an expandable inline group inside the assistant turn. Artifacts should be inline cards that can expand temporarily, preserving the conversation’s vertical rhythm.

## References

[1]: https://opencode.ai/docs/tools/ "OpenCode Tools"
[2]: https://opencode.ai/docs/permissions/ "OpenCode Permissions"
[3]: https://opencode.ai/docs/cli/ "OpenCode CLI"
[4]: https://docs.openwebui.com/features/chat-conversations/chat-features/code-execution/artifacts/ "Open WebUI Artifacts"
