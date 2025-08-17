# Improvements Backlog — NYC Chatbot

_Status: living doc. Keep PR-sized slices. Prefer v0.1/v0.2 shippable steps._

## ✅ Completed (v0)
- [x] Google Gemini AI integration with proper prompt engineering
- [x] OpenWeatherMap weather API integration for Central Park (replaced Open-Meteo)
- [x] Weather-aware activity suggestions (no hallucinated events)
- [x] Clean, Google-like search interface with example queries
- [x] Responsive result cards with weather context
- [x] Error handling and loading states
- [x] Route segment configs preventing build-time execution
- [x] TypeScript types and ESLint compliance
- [x] Comprehensive documentation and setup instructions
- [x] Google-style dark mode UI transformation
- [x] Weather temperature conversion fixes (Celsius to Fahrenheit)
- [x] Modern search bar with AI Mode button, voice, and camera icons

## Now / Next / Later
- **Now**
  - [ ] Fix OpenWeatherMap API key configuration
  - [ ] Test Google-style UI functionality
  - [ ] v0 polish: empty-state copy, error states, loading shimmer
  - [ ] Cache weather for weekend window (per lat/lon)
  - [ ] p50/p95 latency instrumentation
  - [ ] Deploy to production environment
- **Next (v0.1)** — Events integration
  - [ ] Wire **NYC Parks Events** JSON feed
  - [ ] Weekend filter + Central Park only
  - [ ] "Sources" line with deep links
  - [ ] Prompt guardrails: never invent events; degrade gracefully
- **Later**
  - [ ] Geo intent: infer park/borough from free text
  - [ ] Voice I/O (browser Web Speech) for ask/answer
  - [ ] MCP server for data providers (NYC Open Data, Parks, MTA)
  - [ ] RAG over static civic FAQs; evals
  - [ ] Agentic tasks: weekend itinerary builder
  - [ ] SFT dataset collection from thumbs-up chats

## Quality Goals (measurable)
- p50 ≤ 2.5s, p95 ≤ 5s
- ≥ 80% useful votes from ≥ 10 sessions/day
- 0 regressions on AT‑1..AT‑3

## Tech Debt / Cleanup
- [x] Unified time helpers for "this weekend" in EST/EDT
- [x] Error taxonomy & user messages
- [x] Centralized fetch wrapper with retry/backoff
- [x] Weather API provider upgrade (OpenWeatherMap)
- [x] UI theme consistency (Google dark mode)
- [ ] Add unit tests for time utilities and prompt functions
- [ ] Add integration tests for API endpoints

## Ideas Parking Lot
- Weather-aware "best hour to go" suggestion
- SMS fallback
- Map pin preview (static image) with walking entrances
- Weekend weather alerts for Central Park visitors
- Integration with NYC MTA for transit recommendations
- Voice search integration (microphone icon functionality)
- Image search for Central Park locations (camera icon functionality)
