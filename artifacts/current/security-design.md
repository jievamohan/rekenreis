# Security Design: ZAP Workflow Speed

## Impact

- **No reduction in ZAP coverage:** Same 4 URLs scanned.
- **Cache integrity:** Docker image caches use content-addressable keys where applicable; mysql/zap use static keys (images are upstream, not built by us).
- **Artifactory:** If used, ensure pull from trusted mirror; no credential exposure.

## Risks

| Risk | Mitigation |
|------|------------|
| Parallel ZAP may overload stack | 4 concurrent ZAP spiders; web/api can handle. Monitor for flakiness. |
| Shorter health wait may race | 29s typically sufficient; increase if flaky. |
| -m 1 reduces coverage | Only apply if user accepts; document trade-off. |
