# Epic 4 Architecture

## Web
- **Schema**: rekenreis_progress v1 = { version: 1, bestScore, ... }; migrations for future v2+
- **Storage**: localStorage; migrate on load
- **Telemetry**: Optional call to POST /api/session-stats when opt-in
- **Privacy**: usePreferences(telemetryOptOut) in localStorage

## API
- POST /api/session-stats: body { score?, rounds? }; anonymous; no auth; log or store minimally
