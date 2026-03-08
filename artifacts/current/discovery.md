# Discovery — Epic 26

## Business Analyst Output

### Intent (user input)
- When the map loads, the page should scroll so that the level we're currently on is preferably in the center of the view.
- The background decoration is now only the width of the path. It should be across the full width of the page.
- The decoration can be nicely densely filled.

### Target audience
- Kleuters (kindergarten-age children) and their parents using the Rekenreis app.

### Primary experience goal
- Improve map page usability: user immediately sees their current level without manual scrolling.
- Improve visual richness: full-width underwater decoration creates a more immersive, playful atmosphere.

### Success criteria
- On map load: current level node is centered (or near-center) in the viewport.
- Background decoration spans full page width (not constrained to path band).
- Decoration density is noticeably increased ("lekker dense").

### Non-goals
- New minigames or gameplay changes.
- New assets or illustrations (reuse existing underwater SVGs).
- Changes to path drawing or node behavior.

### Impact
- Map page only. No API, no persistence, no auth changes.
