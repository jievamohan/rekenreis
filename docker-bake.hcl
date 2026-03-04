# Bake file for zap-baseline job: parallel web+api build
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
