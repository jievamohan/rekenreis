# Epic 45 Design Bible — Authentication & Progress Sync

> PlanRef (master): artifacts/archive/epic-45.0/latest  
> This is a living document. Each planning agent owns its chapter only.

---

## 1. Vision & Success Criteria (BA + Game Designer)

- **Target audience:** Ouders/verzorgers (account), kinderen (kindnaam in game).
- **Primary experience goal:** Spelers moeten inloggen of registreren; voortgang wordt opgeslagen in en opgehaald uit de database.
- **"Looks/feels like" acceptance criteria:**
  - Registratie met email, wachtwoord, kindnaam
  - Login met email + wachtwoord
  - Niet-ingelogd → redirect naar /login
  - Pagina's: login, register, forgot-password, reset-password
  - Kindnaam zichtbaar in de game
  - Voortgang in DB, gesynchroniseerd
- **Non-goals:** Email verificatie, social login, meerdere kinderen per account.

## 2. Visual Direction (Art Director)

N/A: Auth forms gebruiken bestaande design tokens (--app-primary, --app-font, etc.). Geen nieuwe visuele stijl.

## 3. UX Layout & Components (UX Designer)

- **Primary screens impacted:** `/login`, `/register`, `/forgot-password`, `/reset-password` (nieuw); alle beschermde routes.
- **Global shell structure:** Auth-pagina's: minimale shell; na login: bestaande shell.
- **Navigation model:** Niet ingelogd: alleen login, register, forgot-password; ingelogd: alle game-pagina's.
- **Component catalog:** LoginForm, RegisterForm, ForgotPasswordForm, ResetPasswordForm.
- **Tap targets & accessibility:** Grote tap targets (min 44px), duidelijke labels, foutmeldingen, loading states.

## 4. Motion & Audio Rules (Motion/Audio)

N/A: Geen wijzigingen. Bestaande transitions.

## 5. Accessibility (UX + QA)

- **Keyboard model:** Tab door formulieren, Enter submit.
- **Focus states:** Duidelijke focus op inputs en buttons.
- **Screen reader:** Labels, foutmeldingen gekoppeld.

## 6. Technical Implementation Notes (Principal Architect + Solution Designer)

- **Auth:** Laravel Sanctum, SPA cookie-based.
- **API:** POST /api/login, /api/register, /api/forgot-password, /api/reset-password; GET /api/user, /api/progress; PUT /api/progress.
- **Web:** useAuth, useProgressSync, auth middleware.
- **Migrations:** user_progress (user_id, progress JSON).
- **Tokens:** Bestaande CSS vars; geen nieuwe.

## 7. Test Strategy & Regression Plan (QA Strategist)

- **Unit tests:** API controllers, useAuth, auth middleware.
- **E2E:** Login, register, protected redirect, password reset.
- **Non-flaky:** data-testid, wait for navigation.

## 8. Security/Privacy Notes (Security/Privacy)

- **Risks:** Auth/crypto, password reset token, progress isolation.
- **Mitigations:** Laravel hashed passwords, Sanctum CSRF, user_id-scoped progress.
- **Config:** CORS credentials, Sanctum stateful domains.

## 9. Slice Map (Orchestrator)

- **Epic 45.1** — API Auth + Sanctum + Progress Schema
  - **Visual milestone:** Geen (API-only).
  - **Files:** apps/api (Sanctum, migrations, controllers, routes).
  - **Acceptance:** Login, register, forgot, reset, progress CRUD werken via API.

- **Epic 45.2** — Web Auth Pages + Middleware
  - **Visual milestone:** Login, register, forgot-password, reset-password pagina's; redirect bij niet-ingelogd.
  - **Files:** apps/web/pages, middleware, composables.
  - **Acceptance:** Auth flows werken; middleware redirect.

- **Epic 45.3** — Progress Sync + Protected Routes
  - **Visual milestone:** Voortgang uit DB; kindnaam in game.
  - **Files:** apps/web (useProgressSync, profile integration, middleware op routes).
  - **Acceptance:** Progress fetch/save; kindnaam getoond; alle routes beschermd.

- **Epic 45.4** — E2E + Polish
  - **Visual milestone:** Geen regressie; foutmeldingen, i18n.
  - **Files:** E2E specs, i18n keys.
  - **Acceptance:** E2E green; CI green; UX polished.
