# Lattice redesign checklist

## Research and audit
- [x] Inspect Claude-style conversation workspace references at desktop and mobile widths.
- [x] Audit current shell, navigation, conversation, artifact, store, and execution paths.
- [x] Record capability matrix, reference analysis, design brief, user flows, and asset manifest.

## Product and visual system
- [x] Define conversation-first information architecture and responsive layout rules.
- [x] Define typography, surface, color, icon, motion, and density tokens in `design.md`.
- [x] Define artifact semantics, activity visibility, question-tool behavior, and safety boundary.

## Implementation
- [x] Rebuild navigation shell and top bar around conversation focus.
- [x] Rework composer, welcome state, message rhythm, streamed activity, and error/recovery states.
- [x] Implement OpenCode-style question tool schema, pause/resume state, and multi-question flow.
- [x] Improve artifact canvas with rendered/source/history views and assistant revision flow.
- [x] Complete CRUD interactions across projects, sources, agents, skills, connectors, schedules, and memory.
- [x] Remove all demo identities and stale seeded workspace records from durable defaults/migrations.

## Verification and delivery
- [x] Verify desktop, tablet, and mobile layouts.
- [x] Verify keyboard/focus, reduced motion, no horizontal overflow, and safe artifact rendering.
- [x] Run lint, typecheck, and production build.
- [x] Package a ready-to-run repository and report known limitations honestly.

## Transparent-agent revision
- [x] Research Manus task progress, Claude question cards, and OpenChamber activity/context patterns from the provided references and primary documentation.
- [x] Define a visible event model for thoughts, tool calls, MCP calls, context reads, file operations, approvals, and recovery states.
- [x] Add read-only nested subagent conversations that open from delegation activity without allowing direct messages to subagents.
- [x] Add a compact task-progress surface in the workspace rail or activity header inspired by Manus.
- [x] Preserve safe artifact rendering and explicitly prohibit arbitrary machine-level code execution.
- [x] Validate nested activity, question handoff, MCP observability, and responsive behavior.

## Inline artifact revision
- [x] Research OpenCode sessions, parts, tool events, permissions, questions, and modern agent workspaces from primary sources.
- [x] Remove persistent sidebar task-progress and the default always-open artifact canvas treatment.
- [x] Define inline artifact semantics for HTML, CSS, JS, JSX, Mermaid, CSV, Markdown, SVG, tables, and images.
- [x] Implement safe in-chat renderers with preview/source/toggle controls and no arbitrary execution.
- [x] Keep tool/MCP activity and subagent inspection available as inline expandable transcript details.
- [x] Validate prompt-to-run, question pause/resume, artifact rendering, responsive behavior, and recovery states.

## Minimal conversation workspace revision
- [x] Research Vercel Eve, OpenCode agent modes, session parts, permissions, skills, questions, and modern conversation rails from primary sources.
- [x] Remove Tools, Agents, Skills, Connections, Memory, Schedules, and Artifacts from the primary left navigation.
- [x] Keep only New chat, Projects, and Recent Chats in the primary rail.
- [x] Move capability management into Settings sections and contextual `/` commands.
- [x] Add or verify agent behavior for plan, act, ask question, load skill, use safe tool/MCP, and resume.
- [x] Add concise profile/settings access modeled on the provided reference.
- [x] Validate the minimal rail, nested settings navigation, command palette, question flow, skill loading, and responsive layouts.

## Status
- Current phase: minimal-agent build validated; packaging next.
- Parallel research inputs: Claude reference behavior, current repository architecture, current browser-rendered UI, and current data/seed state.
- Safety boundary: no arbitrary machine-level code execution; only safe artifact rendering and explicitly approved remote tools/connectors.
- Question tool direction: OpenCode-style structured question event with resumable run state, not a hard-coded demo-only prompt trigger.

## GitHub push
- [ ] Inspect current branch, remotes, status, and upstream divergence.
- [ ] Confirm the target is `Akakaui/agentic-chatbot` and preserve unrelated history.
- [ ] Commit the latest validated Lattice build with a descriptive message.
- [ ] Push the commit to the current branch and verify the remote head.
