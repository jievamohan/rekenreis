# Infra Review: 0003-vertical-slice-skeleton

## Changes

- **docker-compose.yml**: New file with web, api, mysql services
- **apps/web/Dockerfile**: Node 22 Alpine, pnpm, Nuxt dev server
- **apps/api/Dockerfile**: PHP 8.4 CLI, composer, Laravel serve + migrate
- **.env.example**: Root env with API_URL for local/docker
- **docs/runbooks/commands.md**: Added Docker Compose section

## Reversibility

- Remove docker-compose.yml, Dockerfiles, revert runbook changes
- No CI changes; gates unchanged

## Rollback

```bash
git revert <commit>
```
