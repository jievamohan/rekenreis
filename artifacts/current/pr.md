# Remove ci-status.md; use exit code only

**Scope:**
- Stop writing `artifacts/current/ci-status.md` from `gh_watch.sh`
- Merge-ready gate: ci-watch exit code 0 instead of file check
- Remove ci-status.md from git tracking (no more "changes" after merge)

**Why:**
- ci-status.md updated every poll → noisy
- File stayed tracked → always showed as modified after PR merge

**Changes:**
- `scripts/ci/gh_watch.sh`: no STATUS_FILE writes; exit 0/1/2/3 only
- `.cursor/rules/50-ci-watch.mdc`: gate based on exit code
- `.cursor/commands/*`: remove ci-status.md references
- `git rm --cached artifacts/current/ci-status.md`

## Tasks

- [ ] ci-status exitcode-only
