# Discovery — Epic 30: Avatars & Expressions

## Business Analyst Output

### Feature Intent (User)
- Avatars staan in `temp_assets/maatjes`
- Van de avatars zijn er verschillende expressies
- Maak een matrix daarvan
- Laat avatars op de juiste momenten voorkomen (scores, introductie, op de map)
- Kopieer avatars naar de juiste locatie

### Current State
- **temp_assets/maatjes** bevat 3 karakters:
  - **wolkje**: Blij, Neutraal, Verdrietig, Nadenken (4 expressies)
  - **een-oog eerlijk**: Blij, Feest, Neutraal, Verrast, Verdrietig, Nadenken (6 expressies)
  - **slimme rekenaar**: Blij, Feest, Verdrietig, Nadenken (4 expressies)
- App gebruikt nu: emoji-avatars (MapAvatar, ProfileSelector), SVG MascotIcon (LevelCompleteModal, MistakesReview)
- Geen PNG-avatar afbeeldingen in gebruik

### Target Audience
- Kleuters (4–6 jaar), Dutch-speaking
- Kindvriendelijke mascottes die emotionele feedback geven

### Success Criteria
1. Avatar-matrix gedocumenteerd (character × expression)
2. Avatars gekopieerd naar `assets/graphics/characters/maatjes/`
3. Avatars verschijnen op: map (huidige level), level complete (score-afhankelijke expressie), introductie/start, mistakes review
4. Profile-avatar selectie kan maatje tonen (optioneel uitbreiding)

### Non-Goals
- Geen nieuwe minigames
- Geen backend-wijzigingen
- Geen cloud sync van avatars
