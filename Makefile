# Rekenreis — Build and deploy
# Epic 46.1: Unified public folder (Laravel API + Vue frontend)
# Epic 46.2: Pre-push build verification

.PHONY: build install-hooks verify-build
build:
	./scripts/build-for-prod.sh

install-hooks:
	./scripts/ci/install-hooks.sh

# Verify build artifacts exist (used by pre-push hook after make build)
verify-build:
	@test -d apps/api/public/_nuxt/ || (echo "Missing apps/api/public/_nuxt/ — run: make build" >&2; exit 1)
	@test -f apps/api/public/index.html || (echo "Missing apps/api/public/index.html — run: make build" >&2; exit 1)
	@echo "OK: index.html, _nuxt/ present"
