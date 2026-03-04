# Epic 19 — Test Strategy (QA Strategist)

## Unit Tests Required

- No new logic; existing unit tests remain
- If token/theme switching logic added: test fallbacks

## E2E Smoke Updates

- Update selectors if class names change
- Verify nav tabs still work (Sticker book, Progress, Settings)
- Verify play flow still works
- Verify mode selector and skin picker

## Non-Flaky UI Assertions

- Prefer role/label over class names
- Avoid asserting exact colors in E2E

## Visual Regression Approach

- Lightweight: manual check of each page
- Optional: screenshot comparison (if tooling exists)
- Document expected look in design bible
