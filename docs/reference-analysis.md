# Reference analysis

## Sources reviewed

| Reference | What was actually observed | Principle to reinterpret |
|---|---|---|
| [Claude Artifacts help](https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them) | Artifacts are substantial, self-contained outputs that open in a dedicated window beside chat. They support rendered views, source/code views, version selection, downloads, direct editing, and an error recovery action such as “Try fixing with Claude.” | Lattice should treat artifacts as durable work products, not decorative message cards. The artifact surface needs a clear open/close affordance, render/source/history modes, revision prompts, and a recovery path. |
| [Anthropic Projects](https://www.anthropic.com/news/projects) | Projects combine curated knowledge, project instructions, conversations, and side-by-side artifacts. The product uses projects to solve the cold-start problem while keeping a chat surface central. | Lattice should let standalone chat stay lightweight and make project context explicit only when selected. Project setup should be a quiet context layer, not a permanent admin dashboard. |
| [OpenAI Canvas](https://openai.com/index/introducing-canvas/) | Canvas opens when the task benefits from iterative editing. It supports targeted edits, selected-text feedback, shortcuts, revision history, and a larger work surface alongside the conversation. | Lattice should open the artifact canvas when the work becomes substantial, with edit intent and history visible without forcing users through a separate management page. |
| [OpenCode Tools](https://opencode.ai/docs/tools/) | The question tool is an explicit tool that asks for preferences, clarifications, decisions, or directional choices. Questions contain a header, prompt, options, and custom-answer support; multiple questions can be navigated before submitting. | Lattice needs a first-class, resumable `question` tool event. It should support one or more questions, custom answers, answer submission, cancel/retry, and a paused execution state. |
| User-provided Claude screenshot | The chat surface uses a narrow reading column with generous vertical rhythm, a quiet header, a large composer anchored near the bottom, and activity expressed as readable narrative rather than a dense control panel. | Lattice should reduce chrome, make the composer the visual anchor, and show agent work as compact progressive disclosure instead of a dashboard of permanent cards. |

## Observations, inferences, and exclusions

The references consistently separate **conversation**, **work product**, and **control plane**. Conversation should remain the default surface. Artifacts and project configuration should appear when needed, with dedicated but reversible surfaces. The most important design move is therefore not a new color palette; it is a hierarchy change from “workspace admin console” to “chat first, tools when relevant.”

The redesign will borrow principles, not identity. Lattice will not copy Claude’s logo, typography, exact layout, proprietary copy, screenshots, or brand colors. It will retain its own orange accent and neutral dark material language, but use softer surfaces, better type scale, and less telemetry-like labeling.

## Rejected patterns from the current build

The current screenshot exposes too many technical labels at once: “question required,” “execution plan,” “sequential,” role names, and low-level steps are all competing for attention. The plan is visually presented as a card stack before the user understands the assistant’s response. The composer is too low-contrast and too small for the primary action. The left rail is overly dense and the active conversation is visually disconnected from the main reading column. These are hierarchy and density problems, not just color problems.

## Design consequences

Lattice will use a narrow readable conversation column, a visually quiet header, a composer that grows with content, inline assistant activity summaries, a collapsible detailed run trace, a right artifact canvas that opens only when an artifact exists or the user requests it, and a mobile one-surface-at-a-time model. The primary answer will be visible before implementation detail; plan and tool activity will be available as evidence, not as the default reading order.

## References

[1]: https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them "Claude Artifacts help"
[2]: https://www.anthropic.com/news/projects "Anthropic Projects"
[3]: https://openai.com/index/introducing-canvas/ "OpenAI Canvas"
[4]: https://opencode.ai/docs/tools/ "OpenCode Tools"
