# Bake file for zap-baseline job: parallel web+api build
# e2e: custom Playwright + pnpm (Epic 25.2)
group "default" {
  targets = ["web", "api"]
}

target "web" {
  context    = "./apps/web"
  dockerfile = "Dockerfile"
  tags       = ["rekenreis-web:latest"]
}

target "api" {
  context    = "./apps/api"
  dockerfile = "Dockerfile"
  tags       = ["rekenreis-api:latest"]
}

target "e2e" {
  context    = "./docker/e2e"
  dockerfile = "Dockerfile"
  tags       = ["rekenreis-e2e:latest"]
}
