# Rekenreis — Build and deploy
# Epic 46.1: Unified public folder (Laravel API + Vue frontend)
# Epic 46.2: Pre-push build verification
# Epic 46.3: Deploy scripts for TransIP VPS + DirectAdmin
#
# Deploy env vars (set in .env or shell; never commit secrets):
#   DEPLOY_HOST    — SSH host (e.g. user@vps.example.com)
#   DEPLOY_PATH   — Path on server (e.g. /home/user/domains/example.com)

.PHONY: build install-hooks verify-build deploy deploy-pull deploy-rsync
build:
	./scripts/build-for-prod.sh

install-hooks:
	./scripts/ci/install-hooks.sh

# Verify build artifacts exist (used by pre-push hook after make build)
verify-build:
	@test -d apps/api/public/_nuxt/ || (echo "Missing apps/api/public/_nuxt/ — run: make build" >&2; exit 1)
	@test -f apps/api/public/index.html || (echo "Missing apps/api/public/index.html — run: make build" >&2; exit 1)
	@echo "OK: index.html, _nuxt/ present"

# Deploy via git pull on server (SSH, pull, composer, cache clear)
deploy-pull:
	@test -n "$(DEPLOY_HOST)" || (echo "Set DEPLOY_HOST (e.g. user@vps.example.com)" >&2; exit 1)
	@test -n "$(DEPLOY_PATH)" || (echo "Set DEPLOY_PATH (e.g. /home/user/domains/example.com)" >&2; exit 1)
	ssh $(DEPLOY_HOST) "cd $(DEPLOY_PATH) && git pull && composer install --no-dev --optimize-autoloader && php artisan config:cache && php artisan route:cache && php artisan view:cache"
	@echo "deploy-pull done"

# Deploy via rsync: sync public + vendor to VPS (run make build first)
# Requires: composer install in apps/api (vendor/) before rsync
deploy-rsync:
	@test -n "$(DEPLOY_HOST)" || (echo "Set DEPLOY_HOST (e.g. user@vps.example.com)" >&2; exit 1)
	@test -n "$(DEPLOY_PATH)" || (echo "Set DEPLOY_PATH (e.g. /home/user/domains/example.com)" >&2; exit 1)
	@$(MAKE) verify-build
	@test -d apps/api/vendor/ || (echo "Missing apps/api/vendor/ — run: cd apps/api && composer install --no-dev" >&2; exit 1)
	rsync -avz --delete apps/api/public/ $(DEPLOY_HOST):$(DEPLOY_PATH)/public/
	rsync -avz --delete apps/api/vendor/ $(DEPLOY_HOST):$(DEPLOY_PATH)/vendor/
	@echo "deploy-rsync done (public + vendor)"

# Alias: deploy = deploy-pull (most common)
deploy: deploy-pull
