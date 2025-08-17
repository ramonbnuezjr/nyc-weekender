# Activity Log — NYC Chatbot

> Keep terse, timestamped notes. One line per meaningful change.

- 2025-08-17 00:03 UTC — Created `project_spec.md`, `improvements.md`, and `activity_log.md`. Locked v0 scope to Gemini + Open‑Meteo. Defined AT‑1..AT‑3 and KPIs.
- 2025-08-17 00:15 UTC — Installed Node.js via Homebrew, created Next.js project with TypeScript + Tailwind
- 2025-08-17 00:20 UTC — Installed @google/generative-ai dependency for Gemini integration
- 2025-08-17 00:25 UTC — Created project structure: /lib (time.ts, prompts.ts), /api (weather, chat), /components (Search, Result)
- 2025-08-17 00:30 UTC — Implemented weather API route with Open-Meteo integration and weekend date logic
- 2025-08-17 00:35 UTC — Built chat API route orchestrating Gemini + weather with prompt selection
- 2025-08-17 00:40 UTC — Created Search component with Google-like UI and example queries
- 2025-08-17 00:45 UTC — Built Result component displaying AI responses + weather data in clean cards
- 2025-08-17 00:50 UTC — Updated main page with full chatbot interface, error handling, loading states
- 2025-08-17 00:55 UTC — Updated layout metadata, created comprehensive README with setup instructions
- 2025-08-17 01:00 UTC — Fixed build-time execution issues with route segment configs (dynamic, revalidate, fetchCache, runtime)
- 2025-08-17 01:05 UTC — Successfully built project, started development server for testing
- 2025-08-17 01:10 UTC — Resolved all TypeScript and ESLint issues, project builds successfully
- 2025-08-17 01:15 UTC — Updated documentation files, preparing for GitHub repository push
- 2025-08-17 01:20 UTC — Successfully pushed NYC Chatbot v0 to GitHub repository: https://github.com/ramonbnuezjr/nyc-weekender
