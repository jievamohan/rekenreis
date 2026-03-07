# Solution — Epic 24 (Solution Designer)

## Levers

### 1. MySQL Image Cache (hoogste impact)

**Probleem:** e2e-container pulled mysql:8.0 elke run.

**Oplossing:** Voeg MySQL image cache toe aan e2e-container job (zelfde patroon als zap-baseline):

```yaml
- name: Cache mysql image
  uses: actions/cache@v4
  id: mysql-cache
  with:
    path: /tmp/docker-cache/mysql
    key: docker-mysql-8.0
    restore-keys: docker-mysql-

- name: Pull mysql image
  if: steps.mysql-cache.outputs.cache-hit != 'true'
  run: docker pull mysql:8.0 && mkdir -p /tmp/docker-cache/mysql && docker save mysql:8.0 -o /tmp/docker-cache/mysql/mysql.tar

- name: Load mysql image
  if: steps.mysql-cache.outputs.cache-hit == 'true'
  run: docker load -i /tmp/docker-cache/mysql/mysql.tar
```

Plaats vóór "Build images (cached)" zodat MySQL beschikbaar is bij `docker compose up`.

### 2. Build Images Cache Verbeteren

**Probleem:** Bake-action bouwt ondanks cache.

**Opties:**
- **A:** Voeg `pull: false` of `pull-policy` toe waar van toepassing
- **B:** Gebruik `cache-from` met fallback: `type=registry` als backup (indien images gepusht)
- **C:** Bake cache key verfijnen — bv. `scope=web-${{ hashFiles('apps/web/Dockerfile', 'apps/web/package.json') }}` — nee, dat breekt sharing
- **D:** Eerste run benchmarken; mogelijk is cache wel OK maar duurt restore lang
- **E:** Overweeg `docker/build-push-action` met expliciete cache opts

Praktisch: eerst benchmarken. Als cache-hit duurt restore nog ~30s, dan is dat acceptabel. Als er geen hit is, dan cache-key/cache-from onderzoeken.

### 3. Volgorde Optimaliseren

- MySQL cache + load vóór build, zodat bij `docker compose up` alle images lokaal zijn.
- Eventueel: build en mysql-load parallel (niet triviaal in GHA).

### 4. Optioneel: Registry Cache

Als GHA cache onbetrouwbaar is: push web/api images naar GHCR op main, pull in PRs. Verhoogt complexiteit; alleen als GHA cache echt faalt.

## Aanbevolen Volgorde

1. **24.1:** Benchmark — meet huidige duur per stap (build, start, e2e)
2. **24.2:** MySQL cache — voeg toe aan e2e-container (copy from zap-baseline)
3. **24.3:** Build cache — analyseer + fix bake cache; documenteer
4. **24.4:** Fine-tune — eventuele extra optimalisaties tot target bereikt
