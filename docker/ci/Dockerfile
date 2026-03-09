# CI tools for local Gate D reproduction (semgrep, etc.)
# Run: docker compose run --rm ci semgrep scan --config auto --config .semgrep --error
FROM python:3.12-slim

RUN apt-get update -qq && apt-get install -y -qq git --no-install-recommends && rm -rf /var/lib/apt/lists/*

WORKDIR /repo

RUN pip install --no-cache-dir semgrep

# Non-root user for security (semgrep rule: dockerfile.security.missing-user)
RUN adduser --disabled-password --gecos '' semgrep
USER semgrep

# Default: semgrep (override with docker compose run ci <cmd>)
CMD ["semgrep", "scan", "--config", "auto", "--config", ".semgrep", "--error"]
