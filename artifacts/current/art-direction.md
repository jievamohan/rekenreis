# Art Direction — Epic 30: Avatars & Expressions

## Art Director Output

### Theme Directive
- Behoud onderwater/kindvriendelijke stijl
- Maatjes zijn bestaande PNG-assets; geen herontwerp
- Consistente grootte en positionering over schermen

### Asset Specifics
- **Bron:** temp_assets/maatjes/{character}/{expression}.png
- **Doel:** assets/graphics/characters/maatjes/{character}/{expression}.png
- Karakternamen normaliseren: "een-oog eerlijk" → "een-oog-eerlijk" (geen spaties in pad)
- Formaat: PNG, behoud originele resolutie; optimaliseer indien >50KB per bestand

### Sizing
- Map: 40×40px (bubble)
- LevelCompleteModal: 80×80px (mascot)
- MistakesReview: 64×64px
- Profile selector: 48×48px
- object-fit: contain; aspect-ratio behouden

### Do
- Gebruik maatje dat bij profiel hoort (indien profile-avatar gekoppeld)
- Fallback: wolkje (meest complete set) of eerste beschikbare maatje
- Expressie past bij context (zie UX mapping)

### Don't
- Geen stretch/distort
- Geen emoji vervangen waar maatje niet beschikbaar is (graceful fallback)
- Geen nieuwe kleuren/thema's; bestaande tokens
