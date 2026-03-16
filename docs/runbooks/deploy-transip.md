# Deploy to TransIP VPS + DirectAdmin

Epic 46.3: Makefile deploy targets for TransIP VPS with DirectAdmin.

## Prerequisites

- SSH key access to the VPS
- Repo cloned on the server under the DirectAdmin document root
- Makefile env vars set: `DEPLOY_HOST`, `DEPLOY_PATH`

## Environment variables

Set before running deploy targets (e.g. in `.env` or shell):

```bash
export DEPLOY_HOST="user@vps.example.com"
export DEPLOY_PATH="/home/user/domains/example.com"
```

Never commit these; use `.env` (gitignored) or pass inline:

```bash
DEPLOY_HOST=user@vps.example.com DEPLOY_PATH=/home/user/domains/example.com make deploy-pull
```

## Deploy methods

### deploy-pull (recommended for TransIP)

SSH to server, git pull, composer install, Laravel cache clear.

1. Push code to your git remote
2. Run: `DEPLOY_HOST=... DEPLOY_PATH=... make deploy-pull`

For frontend changes (Vue), use **deploy-rsync** instead — build artifacts are gitignored and are not pushed via deploy-pull.

Server steps performed:
- `git pull`
- `composer install --no-dev --optimize-autoloader`
- `php artisan config:cache`
- `php artisan route:cache`
- `php artisan view:cache`

### deploy-rsync

Sync built `public/` and `vendor/` from local to VPS. Use when:
- Server cannot run `make build` (no Node/Docker)
- You build locally and want to push artifacts only

1. Locally: `make build` (produces unified public folder)
2. Run: `DEPLOY_HOST=... DEPLOY_PATH=... make deploy-rsync`

Syncs:
- `apps/api/public/` → `$(DEPLOY_PATH)/public/`
- `apps/api/vendor/` → `$(DEPLOY_PATH)/vendor/`

## DirectAdmin configuration

1. **Document root**: Point the domain to `$(DEPLOY_PATH)/public` (e.g. `public_html` symlink or DirectAdmin “Document Root” setting)
2. **.htaccess**: Ensure `apps/api/public/.htaccess` routes `/api/*` to `index.php` and SPA fallback to `index.html`
3. **PHP**: Laravel requires PHP 8.1+; set via DirectAdmin “Select PHP Version”

## Troubleshooting

- **Permission denied**: Ensure SSH key is added: `ssh-copy-id user@vps.example.com`
- **composer not found**: Composer must be installed on the server
- **Missing _nuxt/**: Run `make build` before `deploy-rsync`; `deploy-pull` assumes the server runs `make build` after pull (or use deploy-rsync instead)
