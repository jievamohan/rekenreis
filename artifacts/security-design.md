# Security Design: Artifact Lifecycle Hardening

## Threat Model

- **Scope**: Pipeline scripts and artifact storage
- **No new attack surface**: No auth, no network, no user input beyond branch name

## Considerations

- **Archive contents**: May include CI logs, PR metadata. Ensure no secrets in artifact files (existing policy)
- **Path traversal**: Epic-id and timestamp are derived from `git branch` and `date`; no user input
- **File permissions**: Archive uses `cp -r`; inherits permissions of source

## Compliance

- No changes to auth, crypto, or payment flows
- No PII in artifacts (existing)
