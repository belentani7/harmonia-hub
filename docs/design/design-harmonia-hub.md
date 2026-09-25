# SDD / Design Doc -- harmonia-hub
Fecha: 2026-09-25 | Estado: Draft

## Arquitectura general

Stack: Node.js, React, Tailwind, Express, TypeScript, Docker, Deploy: Dockerfile. Estructura de primer nivel detectada:

```
  .dockerignore
  .github
  .gitignore
  .gitkeep
  .npmrc
  .watchmanconfig
  Dockerfile
  LICENSE
  README.md
  SECURITY.md
  apk_build_guide.md
  app
  app.config.ts
  assets
  audit_belentani7_10_10.md
  audit_rubric_10_10.md
  babel.config.js
  client
  components
  constants
```

CI: ci.yml, deploy-pages.yml.

## Decisiones clave

Ver `docs/adr/`. Regla: una fuente de verdad por concern, contratos de frontera
claros y direccion de dependencias sin ciclos.

## Flujos criticos

1. Desarrollo local -> build -> test -> CI.
2. Cambio -> PR -> revision -> merge -> deploy (si aplica).

## Estrategia de verificacion

- Build y tests en CI en cada PR.
- Revision de seguridad (cero secretos, validacion).
- Comprobacion de deploy segun la matriz de plataforma.

## Limites y riesgos

- Deuda tecnica no documentada: registrar como ADR antes de refactor mayor.
- Dependencias externas: fijar versiones y lockfile.
