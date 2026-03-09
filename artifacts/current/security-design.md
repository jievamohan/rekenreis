# Security & Privacy — Epic 30: Avatars & Expressions

## Security/Privacy Output

### New Risks
- **Low:** PNG assets in repo; geen user upload, geen external fetch
- Geen PII in avatars
- Geen auth/crypto/payment impact

### Config Constraints
- Assets served from same origin (static)
- Geen eval of dynamic script from asset paths

### Data Handling
- Geen persoonlijke data
- Profile.avatarId blijft lokaal (localStorage); geen wijziging aan privacy model

### Checks Required
- gitleaks: clean (geen secrets in PNG)
- SAST: geen nieuwe vectors
