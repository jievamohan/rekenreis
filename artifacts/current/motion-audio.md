# Motion & Audio — Epic 30: Avatars & Expressions

## Motion/Audio Designer Output

### Animations
- **MapAvatar:** bestaande avatar-bounce behouden (0.4s ease-out)
- **LevelCompleteModal:** maatje fade-in met modal (geen extra animatie)
- **Expressie-switch:** crossfade 150–200ms (optioneel, low priority)
- **Reduced motion:** instant; geen bounce op map-avatar

### Timing/Easing
- Bestaande tokens: `--app-ease-celebrate`, `--app-transition`
- Geen nieuwe keyframes voor avatars

### Reduced Motion
- Map: avatar-bounce uit bij prefers-reduced-motion
- Overige: statische weergave, geen expressie-transitions

### Sound
- N/A: geen nieuwe audio voor avatars
- Bestaande playCelebrate e.d. ongewijzigd
