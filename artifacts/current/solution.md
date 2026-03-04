# Solution: ZAP Workflow Speed

## Approach

### 1. Parallel Build (buildx bake)

Replace two sequential `docker/build-push-action` steps with one `docker buildx bake`:

```yaml
- name: Build images
  uses: docker/build-push-action@v6
  with:
    context: .
    file: ./docker-bake.hcl  # or inline
    load: true
    cache-from: type=gha
    cache-to: type=gha,mode=max
```

Create `docker-bake.hcl` with web and api targets; bake builds both in parallel.

### 2. Cache Hardening

- Add `restore-keys` for mysql and zap: `docker-mysql-`, `docker-zaproxy-`.
- Ensure Pull step runs only on cache miss; Load step runs on hit.
- Consider caching node/composer base images if buildx cache is cold.

### 3. Parallel ZAP

```bash
docker run ... zap-baseline.py -t http://web:3000/start ... &
docker run ... zap-baseline.py -t http://web:3000/play ... &
docker run ... zap-baseline.py -t http://api:8000/api/health ... &
docker run ... zap-baseline.py -t http://api:8000/api/session-stats ... &
wait
```

4 runs in parallel → wall time ≈ 1× run (~45-60s) instead of 4× (~180s).

### 4. Tighter Health Wait

```bash
sleep 5
for i in $(seq 1 12); do
  curl -sf http://localhost:3000/start >/dev/null && curl -sf http://localhost:8001/api/health >/dev/null && echo "Stack ready" && exit 0
  echo "Waiting ($i/12)..."
  sleep 2
done
```

Max 29s instead of 185s.

### 5. ZAP -m 1 (Optional)

`-m 1` reduces max spider time from 2 min to 1 min per target. Saves ~4 min total if all 4 runs hit the limit. Trade-off: slightly less spider coverage. For baseline (passive scan), 1 min often sufficient.

### 6. Artifactory (If Available)

If Artifactory is configured:
- Add Artifactory as Docker registry mirror.
- Pull mysql/zap from `artifactory.example.com/docker-remote/...`.
- Faster pulls from local mirror.

**Scope out:** Only if user confirms Artifactory is available. Otherwise skip.

## Expected Outcome

| Scenario | Before | After |
|----------|--------|-------|
| Cold (no cache) | ~6 min | ~3 min |
| Warm (cache hit) | ~4 min | ~90-120s |

90s target achievable on warm runs with parallel ZAP + bake + tighter health.
