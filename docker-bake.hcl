# Bake file for zap-baseline and image publish.
# docker/*.Dockerfile: explicit per-service Dockerfiles; e2e is self-contained (no runtime pnpm install).
group "default" {
  targets = ["web", "api"]
}

target "web" {
  context    = "./apps/web"
  dockerfile = "docker/web.Dockerfile"
  tags       = ["rekenreis-web:latest"]
}

target "api" {
  context    = "./apps/api"
  dockerfile = "docker/api.Dockerfile"
  tags       = ["rekenreis-api:latest"]
}

target "e2e" {
  context    = "."
  dockerfile = "docker/e2e.Dockerfile"
  tags       = ["rekenreis-e2e:latest"]
}
