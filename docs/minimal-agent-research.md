# Minimal conversation rail and agent architecture research

## Vercel Eve

Vercel Eve describes an agent as a filesystem-first directory. The conventional structure separates always-on instructions, typed tools, on-demand Markdown skills, channels, schedules, and optional subagents.[1] The important product implication is that these capabilities are not all primary navigation destinations. They are configuration and runtime capabilities owned by the agent and surfaced contextually when needed.

Eve’s public product description says skills are Markdown playbooks loaded on demand, tools are typed TypeScript functions, subagents are delegated by the main agent, and human-in-the-loop tools park the workflow until the user responds, then resume.[2] This maps directly to Lattice’s desired plan → act → ask → skill/tool → resume flow.

## OpenCode

OpenCode separates primary agents from subagents. Primary agents are the assistants the user speaks with directly; subagents are specialized assistants invoked automatically or with `@` mentions.[3] OpenCode’s built-in primary modes include Build and Plan. Plan restricts edits and shell actions while Build is allowed to act; this is a useful model for Lattice even though Lattice intentionally does not expose local shell execution.

OpenCode configures an agent with a description, model, prompt, maximum steps, and granular permissions. Skills are loaded through a first-class skill tool, and question is a first-class user-interaction tool. Tool calls and results appear as typed parts in the assistant message, while approval states and denied outputs are rendered in the same transcript.[4]

OpenCode supports child sessions and navigation between parent and child sessions, but the primary agent remains the user’s direct conversational surface. Lattice should keep delegated subagent inspection nested and read-only, with continuation routed through the parent orchestrator.

## Vercel AI SDK UI

Vercel AI SDK UI models assistant messages as a sequence of typed `parts`, including text parts and typed tool parts. Tool parts move through states such as input-streaming, input-available, approval-requested, approval-responded, output-available, output-error, and output-denied.[5] This is the correct mental model for Lattice’s activity stream and question UI: one transcript, typed operational parts, and a continuation when tool outputs or user decisions are available.

## Product decision for Lattice

The primary rail will contain only New chat, Projects, and recent conversations. Tools, Skills, Agents, MCP Connections, Memory, Schedules, and Artifacts will be accessible from Settings and contextual `/` commands, not as everyday sidebar navigation. Profile, Settings, Language, Help, and account actions belong in a bottom-left identity menu modeled on the provided reference.

The agent will expose two primary modes in the composer/header: **Plan** and **Act**. Plan can research, read sources, load skills, ask questions, and create a proposed plan, but it does not mutate durable state without confirmation. Act can execute safe tools, create inline work products, delegate subagents, and resume after questions or approvals. Both modes remain inside one conversation.

## References

[1]: https://github.com/vercel/eve "Vercel Eve GitHub repository"
[2]: https://vercel.com/eve "Vercel Eve product documentation"
[3]: https://opencode.ai/docs/agents/ "OpenCode Agents"
[4]: https://opencode.ai/docs/tools/ "OpenCode Tools and Questions"
[5]: https://ai-sdk.dev/docs/ai-sdk-ui/chatbot-tool-usage "Vercel AI SDK UI Chatbot Tool Usage"
