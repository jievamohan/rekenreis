# Epic 22: UX Specification

**Artifact:** `ux.md`  
**Author:** ux-designer

---

## /play Screen Model

- **Top bar:** progress + optional timer state + settings entry.
- **Mechanic stage:** dynamic region per interaction model.
- **Hint/feedback rail:** `aria-live="polite"` for supportive guidance.
- **Action footer:** continue/retry controls with Dutch copy.

## Interaction Blueprints (4 Upgrades)

1. **Drag/Drop game (`drag-drop`, `layout-dnd-dualzone`)**
   - Source tray + target zones with snap feedback.
   - Keyboard fallback: pick item (`Space`), move target (`Arrow`), drop (`Enter`).

2. **Timed-kind game (`timed-pop`, `layout-pop-field`)**
   - Gentle countdown, no fail state on timeout.
   - Timeout flow: show hint and allow immediate continue.

3. **Sorting game (`sort-into-bins`, `layout-sort-bins`)**
   - Buckets with icon+label cues (not color only).
   - Keyboard fallback required and test-covered.

4. **Spatial/sequence game (`build-sequence` or `trace-numberline`, `layout-sequence-track`)**
   - Ordered slots/path nodes with clear progression states.
   - Mistakes produce local hints, not round reset.

## Layout Class Taxonomy (for Diversity Gate)

- `layout-tap-grid`
- `layout-dnd-dualzone`
- `layout-pop-field`
- `layout-sort-bins`
- `layout-sequence-track`
- `layout-route-canvas`

`new` minigames must not duplicate `interactionType + layoutClass` without justification metadata.

## Dutch Copy and Tone

- Tone: warm, short, non-punitive.
- Timeout examples:
  - "Even pauze, je doet het goed."
  - "Hier is een hint. Probeer het nog eens."
  - "Ga rustig verder."

## Accessibility Requirements

- All core actions keyboard reachable and operable.
- Visible focus states and logical tab order.
- Reduced motion removes non-essential animations.
- Status feedback is text-based, not color-only.
# Epic 22 UX Specificatie - Minigame Mechanics Overhaul

## 1) Screen/region changes in `/play`

### Doel
De `/play`-pagina ondersteunt meerdere **duidelijk verschillende interactietypen** zonder visuele reskins. Elk type heeft een eigen layoutcompositie, inputgedrag, focusvolgorde en ARIA-semantiek.

### Regio-indeling (globaal)
1. **Topbar regio**
   - Inhoud: niveau/progressie, optionele timerstatus, instellingenknop.
   - ARIA: `role="region"` met label "Spelstatus".
   - Focusvolgorde: na paginaheader, voor speelveld.
2. **Speelveld regio (primair)**
   - Dynamische compositie per mechanic (zie blueprint-sectie).
   - ARIA: `role="region"` met label "Speelveld".
   - Bevat interactieve elementen in logische volgorde links->rechts, boven->onder.
3. **Hint/feedback regio**
   - Inhoud: vriendelijke hints, bevestiging, aanmoediging.
   - ARIA: `aria-live="polite"` voor hints; `aria-live="assertive"` alleen voor kritieke "tijd bijna op"-melding.
4. **Actie/footer regio**
   - Inhoud: "Volgende", "Opnieuw proberen", "Pauze", optionele "Doorgaan zonder timer".
   - ARIA: `role="toolbar"` met duidelijke knoplabels.

### Regionale variaties per interactietype (geen reskin)
- **Selectie (tap/klik)**: kaartgrid of lijstlayout met duidelijke hit targets.
- **Sleep (drag-and-drop)**: bron- en doelzones naast elkaar of in banen.
- **Rangschikken (order/sequencing)**: verticale stapel met drag-handles en toetsenbordreorder.
- **Pad/trace (pointer pad volgen)**: canvas-achtig traject met checkpoints.

### Settings-affordance voor timers
- Altijd bereikbaar via topbar: knop **"Instellingen"**.
- In instellingenpaneel:
  - Toggle: **"Tijdslimiet gebruiken"** (standaard aan, kindvriendelijk te wijzigen).
  - Beschrijving: uitschakelen zet alle minigames in "zonder tijdsdruk".
- Bij timer uit:
  - Timercomponent verdwijnt visueel.
  - UX-copy bevestigt: **"Je speelt zonder tijdslimiet."**

### Kid-safe timing UX (zonder fail-state)
- Timeout veroorzaakt **geen verlies**, **geen game-over**, **geen straf**.
- Bij timeout:
  1. Vriendelijke hint verschijnt.
  2. Huidige opgave blijft beschikbaar.
  3. CTA: **"Probeer nog eens"** of **"Ga verder"**.
- Indien speler vaker vastloopt:
  - Progressieve hulp: extra voorbeeld, highlight van eerstvolgende stap.

### Reduced motion compliance
- Respecteer `prefers-reduced-motion: reduce`.
- Bij reduced motion:
  - Geen parallax, geen spring/scale-animaties, geen snelle transities.
  - Gebruik subtiele opacity/fade (max 150ms) of direct state change.
  - Audio cues blijven optioneel en zacht; geen noodzakelijke informatie enkel via animatie.

---

## 2) Interaction blueprints voor 4 upgraded minigames

## Minigame A: **Vormensorteerbaan** (drag-and-drop)

**Interactiedoel**
- Sleep vormen naar juiste vakken op kleur/vormregel.

**Distinct UI composition**
- Links: bronkolom met draggable tegels.
- Rechts: 3-4 duidelijke doelvakken met iconische labels.
- Midden: optionele "hulpbaan" met visuele pijlrichting.

**Inputmodel**
- Pointer: klik+sleep of tap+sleep.
- Drag: ghost-preview + snap-indicatie op valide dropzone.
- Keyboard fallback:
  - `Tab` naar tegel.
  - `Spatie` om "op te pakken".
  - `Pijltjestoetsen` tussen doelvakken.
  - `Enter` of `Spatie` om neer te zetten.
  - `Esc` annuleert oppakken.

**Accessibility specifics**
- Draggables: `role="button"` + `aria-grabbed="true|false"`.
- Dropzones: `aria-dropeffect="move"` (of equivalent via statuslabel).
- Live feedback: "Opgepakt", "Boven doelvak X", "Geplaatst in X".
- Focus blijft voorspelbaar: na drop naar volgende nog-ongeplaatste tegel.

**Timer UX**
- Bij timeout: hint markeert 1 passende zone en speler gaat verder zonder penalty.

---

## Minigame B: **Rekenroute** (pointer/keyboard pad volgen)

**Interactiedoel**
- Kies de correcte route van start naar eind op basis van som-uitkomsten.

**Distinct UI composition**
- Groot middenveld met knooppunten en paden.
- Linkerzijpaneel met actieve opdracht.
- Onderbalk met "Stap terug" en "Hint".

**Inputmodel**
- Pointer: klik op volgende knooppunt.
- Drag (optioneel): pad tekenen langs verbonden punten.
- Keyboard fallback:
  - `Tab` focust routepunten in logische buurvolgorde.
  - `Enter` selecteert punt.
  - `Backspace` doet laatste stap ongedaan.

**Accessibility specifics**
- Knooppunten als knoppen met `aria-label` inclusief waarde en status.
- Verbondenheid in copy: "Van 6 kun je naar 8 of 9."
- Focus ring altijd zichtbaar, ook op canvas-achtige elementen.

**Timer UX**
- Timeout triggert "kies één stap"-hint, daarna kan speler direct doorgaan.

---

## Minigame C: **Volgorde Sprint** (sequencing/reorder)

**Interactiedoel**
- Zet kaarten in juiste volgorde (klein naar groot, eerst naar laatst, etc.).

**Distinct UI composition**
- Verticale kaartstapel met nummerbadges.
- Rechts compacte statuskolom: resterende stappen + feedback.

**Inputmodel**
- Pointer: drag kaart naar nieuwe positie.
- Drag: insertion marker toont drop-plek.
- Keyboard fallback:
  - `Tab` naar kaart.
  - `Ctrl`+`Pijl omhoog/omlaag` verplaatst kaart.
  - `Enter` bevestigt huidige volgordecheck.

**Accessibility specifics**
- Lijstcontainer: `role="list"`, kaarten: `role="listitem"`.
- Bij reorder live melding: "Kaart 3 staat nu op positie 1."
- Knop "Controleer volgorde" pas actief bij minimale input.

**Timer UX**
- Bij timeout: systeem geeft subtiele aanwijzing op eerste foutpositie, zonder reset.

---

## Minigame D: **Snel Kiezen** (multi-choice selectie)

**Interactiedoel**
- Selecteer het juiste antwoord uit meerdere opties.

**Distinct UI composition**
- Grote centrale vraagtegel.
- Onderin 2x2 antwoordraster met kleur-onafhankelijke iconen/labels.
- Feedback direct onder raster.

**Inputmodel**
- Pointer: klik/tap op antwoordkaart.
- Drag: niet primair; optioneel swipe-navigatie tussen vragen.
- Keyboard fallback:
  - `Tab`/`Shift+Tab` tussen antwoordkaarten.
  - `Pijltjestoetsen` binnen raster.
  - `Enter` selecteert.

**Accessibility specifics**
- Antwoordgroep als `role="radiogroup"`.
- Antwoordkaarten als `role="radio"` met `aria-checked`.
- Correct/fout altijd tekstueel (niet enkel kleur).

**Timer UX**
- Timeout toont hinttekst + "Kies rustig, je kunt doorgaan".

---

## 3) Layout classes taxonomy (diversity gate)

De diversity gate controleert dat minigames niet enkel thematische varianten zijn, maar structureel verschillende UX-layouts gebruiken.

### Taxonomie
- `layout-select-grid`
  - Rasterselectie met gelijke kaartgrootte.
  - Primair voor choice/identificatie.
- `layout-dnd-dualzone`
  - Bron/doel gescheiden, visuele transportflow.
  - Primair voor drag-and-drop.
- `layout-sequence-stack`
  - Herordening in lineaire (meestal verticale) stapel.
  - Primair voor volgorde- en sorteertaken.
- `layout-route-canvas`
  - Vrijere route- of padnavigatie over knooppunten.
  - Primair voor trace/route mechanics.
- `layout-hybrid-assist`
  - Combinatie met expliciet hulp-paneel (max 1/4 games per sessie).

### Gate-regels
- Minimaal 4 unieke layoutclasses in Epic 22 set.
- Geen twee opeenvolgende levels met dezelfde layoutclass in dezelfde moeilijkheidsband.
- Class wissel vereist ook inputmodel-verschil (bijv. select -> drag of drag -> sequence).
- "Alleen andere skin/achtergrond" telt expliciet als **niet voldoende**.

---

## 4) Copy tone + sample Dutch microcopy (timeout/hints)

### Tone of voice
- Nederlands, eenvoudig B1-niveau.
- Vriendelijk, aanmoedigend, zonder negatieve labels.
- Kort en direct; 1 boodschap per regel.
- Geen strafwoorden zoals "fout", "mislukt", "verloren" als eindstatus.

### Copyregels
- Timeout-copy biedt altijd hulp + vervolgactie.
- Hint-copy benoemt volgende stap, niet alleen uitkomst.
- Gebruik "je/jij" consistent en positief.
- Geen Engelse woorden in UI-copy.

### Voorbeeldmicrocopy (alleen Nederlands)
- **Timeout titel:** "Even pauze, je doet het goed!"
- **Timeout tekst:** "Zal ik je een hint geven? Daarna kun je meteen verder."
- **Timeout CTA primair:** "Geef een hint"
- **Timeout CTA secundair:** "Ga verder zonder hint"
- **Hint 1:** "Kijk eerst naar het vak met dezelfde kleur."
- **Hint 2:** "Begin met de kleinste waarde."
- **Hint 3:** "Kies de volgende stap die bij de som past."
- **Timer uit bevestiging:** "Je speelt nu zonder tijdslimiet."
- **Progressieve hulp:** "Goed bezig. Probeer deze stap eerst."

---

## 5) Acceptance checklist voor UX

- [ ] `/play` heeft duidelijke regio's: topbar, speelveld, hint/feedback, actie/footer.
- [ ] Minimaal 4 minigames gebruiken elk een **andere layoutclass** (geen reskin).
- [ ] Elke minigame ondersteunt pointerinput.
- [ ] Minimaal de relevante minigames ondersteunen drag-interactie met duidelijke drop-feedback.
- [ ] Elke minigame heeft een volledig keyboard fallback model (navigeren, activeren, annuleren/bevestigen).
- [ ] Focusvolgorde is logisch en zichtbaar; geen focus-traps.
- [ ] ARIA-rollen en states zijn per mechanic gedefinieerd en worden geüpdatet bij interactie.
- [ ] Timeout leidt tot hint + doorgaan; nooit fail-state, reset-straf of game-over.
- [ ] Instellingen bevatten een duidelijke toggle om timer uit te schakelen.
- [ ] Bij uitgeschakelde timer wordt dit expliciet gecommuniceerd in Nederlandse copy.
- [ ] `prefers-reduced-motion: reduce` schakelt niet-essentiële bewegingen uit.
- [ ] Alle UX-copy in spelcontext is Nederlands; geen Engelse fallback zichtbaar.
- [ ] Feedback gebruikt niet alleen kleur, maar ook tekst/iconen voor betekenis.
- [ ] UX voldoet aan kindvriendelijke toon: positief, kort, niet-bestraffend.
# UX — Epic 21.6

## Layout

MinigameRenderer integrated **below** ProblemCard in keypad mode.

## Structure

```
[ProblemCard]
[MinigameRenderer]  ← interaction wrapper
```

- ProblemCard: canonical math display
- MinigameRenderer: tap/drag interaction for answer
- Fallback: Keypad if minigame unavailable
