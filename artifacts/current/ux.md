# UX Design — Epic 30: Avatars & Expressions

## UX Designer Output

### Primary Screens Impacted
- `/map` — MapAvatar toont gekozen maatje (expressie: Blij of Neutraal)
- `/play` — (optioneel) maatje tijdens spel (Nadenken bij vraag, Blij bij correct)
- LevelCompleteModal — maatje met score-afhankelijke expressie (Feest/Blij/Verdrietig)
- MistakesReview — maatje met Nadenken of Verdrietig
- `/start` of index — introductie: maatje met Neutraal of Blij
- ProfileSelector / ProfileCreate — avatar-keuze kan maatje-tonen uitbreiden

### Expression Mapping (Context → Expressie)
| Context | Expressie |
|---------|-----------|
| Map (huidige positie) | Blij of Neutraal |
| Level complete 3 sterren | Feest |
| Level complete 2 sterren | Blij |
| Level complete 1 ster | Neutraal |
| Level complete 0 sterren | Verdrietig |
| Mistakes review | Nadenken of Verdrietig |
| Introductie / start | Neutraal of Blij |
| Tijdens vraag (play) | Nadenken |
| Correct antwoord (feedback) | Blij |
| Verkeerd antwoord (feedback) | Verdrietig of Verrast |

### Component Catalog
- **AvatarMatrix** (data/config): characterId × expressionId → asset path
- **MaatjeAvatar.vue**: component die maatje+expressie rendert (img of Picture)
- **MapAvatar**: vervang emoji door MaatjeAvatar (of hybride: emoji fallback)
- **LevelCompleteModal**: vervang MascotIcon door MaatjeAvatar met expressie op basis van stars
- **MistakesReview**: vervang MascotIcon door MaatjeAvatar (Nadenken)
- **ProfileSelector/ProfileCreate**: uitbreiden met maatje-keuze (character selectie)

### Tap Targets & Accessibility
- Avatars zijn decoratief; `aria-hidden="true"` of `role="img"` met `aria-label`
- Geen nieuwe interactieve elementen voor avatars zelf
- Profile-keuze: bestaande 48px tap targets behouden
