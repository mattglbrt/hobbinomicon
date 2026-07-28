---
description: End-of-session wrap — session log, STATUS.md, board
---
You are ending a working session. Do the following in order:

1. Summarize this session: what happened, decisions made (with reasoning), artifacts created (with paths), what's still open. Append it as a new entry at the TOP of this project's SESSION_LOG.md (check `docs/SESSION_LOG.md` first, else project root), matching the existing entry format.
2. Rewrite STATUS.md: Now / Next (ranked) / Blockers / Recently done / Open questions. Stamp today's date. Keep it under one page.
3. If the project's phase, next action, or blockers changed: update the client-level STATUS.md (one directory up) and this project's row in the clients-root PROJECTS.md (walk up to the directory containing `_system/`).
4. If SESSION_LOG.md now exceeds ~50KB, compact per `_system/PLAYBOOK.md` §8.
5. Reply with the refreshed "Next" list so the user leaves with clear next actions.
