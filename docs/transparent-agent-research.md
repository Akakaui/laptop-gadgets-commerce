# Transparent-agent interaction research

## Research scope

Lattice should combine the quiet workspace hierarchy visible in the provided Manus and Claude screenshots with the operational transparency found in OpenChamber. The goal is not to clone brand identity or protected layouts. The goal is to make agent work legible without turning the conversation into a terminal.

## Manus pattern

Manus positions the experience around **delivering work**, not merely answering. Its public toolkit description emphasizes that the agent can create files and finished deliverables, while users can monitor progress in real time. This supports a compact task-progress surface that sits near the workspace/session context rather than inside every assistant paragraph. The design implication for Lattice is a collapsible progress rail or activity header with a clear finish line, current step, and recovery status.

## Claude question pattern

Claude’s Agent SDK documents `AskUserQuestion` as a tool request handled through a callback. Execution pauses while the application presents generated questions and options, and the callback can remain pending indefinitely or defer the request for persisted resume. Questions are delivered as an array, each question can have options and multi-select behavior, answers are returned through an `answers` mapping, and free text can be supported through an “Other” path. The documented limit is 1–4 questions with 2–4 options per question. The design implication for Lattice is that questions are first-class run events, not ordinary assistant messages: they need pending, answered, dismissed, and deferred states, plus a visible relationship to the paused run.

The documentation also distinguishes tool approval from clarification. Approvals should expose the requested tool, input, risk, and available user decisions. Clarification should expose the question set and answer choices. Lattice should preserve this distinction in both the event schema and the visual language.

## OpenChamber pattern

OpenChamber describes itself as a workspace for running, supervising, and reviewing AI work across desktop, browser, editor, and mobile. Its product surface emphasizes session states, goals, multi-run, changes walkthroughs, preview context, scheduled work, provider limits, token use, and costs. The design implication for Lattice is an **activity stream** that can show the agent’s current phase, delegated specialist work, tool/MCP calls, context reads, approvals, and artifact results, while keeping the final answer readable.

OpenChamber also supports supervising multiple sessions and reviewing work without turning every session into an interactive peer chat. Lattice should therefore expose spawned subagent conversations as read-only nested views: the user can inspect the subagent’s goal, inputs, tools, progress, output, and citations, but cannot message the subagent directly. Any redirection should go through the primary orchestrator so context, approvals, and accountability remain centralized.

## Proposed Lattice behavior

| Event family | User-visible representation | Interaction rule |
|---|---|---|
| Thought / plan | Compact expandable reasoning summary | Show concise rationale and current objective; never expose hidden chain-of-thought verbatim or sensitive secrets |
| Tool call | Activity row with tool name, action, status, duration, and result summary | Expand for safe arguments and citations; redact secrets and unsafe implementation details |
| Remote MCP call | Distinct connector badge with endpoint label, scopes, and approval state | Remote-only; show requested scopes and require confirmation for consequential operations |
| Context read | Context-source row with files, project sources, memory mode, and token estimate | Explain why context was used; allow inspection, not arbitrary mutation |
| Subagent delegation | Nested session card with role, goal, progress, result, and citations | Read-only inspection; no direct user messaging to spawned subagents |
| Clarification | Claude-style question card attached to paused run | 1–4 questions, 2–4 options, optional “Other,” explicit submit/defer state |
| Approval | Risk-aware approval card | Approve, approve with changes, reject, or suggest alternative; preserve audit record |
| Artifact | Result row plus canvas | Rendered/source/history views, safe preview only, assistant revision request routed through primary agent |
| Recovery | Blocked or failed run panel | Explain what is missing, show safe next actions, and never imply machine execution occurred |

## Safety boundary

Lattice may display planning, reasoning summaries, tool activity, remote connector activity, file metadata, source citations, and safe artifacts. It must not expose arbitrary host shell execution, unrestricted filesystem operations, hidden credential material, or direct subagent control that bypasses the primary orchestrator. Any future execution capability must be a separately approved, isolated integration rather than an implicit chat feature.

## References

[1]: https://manus.im/tools "Manus AI Agent Toolkit for Delivering Work"
[2]: https://code.claude.com/docs/en/agent-sdk/user-input "Claude Agent SDK: Handle approvals and user input"
[3]: https://github.com/openchamber/openchamber "OpenChamber GitHub repository"
[4]: https://openchamber.dev/ "OpenChamber product site"
