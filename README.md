# HARMONÍA HUB

**Music discovery, personal playlist library, and owner-controlled automation.** HARMONÍA is a distinct product: it is **not** NOIACORE, Michelle, Natalia or a generic mobile template.

The repository contains a React Native / Expo application, a Node.js + Express + tRPC API, MySQL via Drizzle, an authenticated CRM interface, and automation protocols. It is a multi-surface application rather than a static landing-page mockup.

## Product flows

| Surface | Implementation | Release notes |
| --- | --- | --- |
| Home / Discovery | Describe listening intention, select mood and track count; call the playlist generation API. | Requires a configured LLM provider. Track suggestions are **not** licensed audio streams. |
| Library / Player | Browse, save and play tracks for which actual playable assets exist. | Never present AI-generated track names as licensed catalog streams. |
| Account / Settings | OAuth session integration and preference screens. | Set real OAuth portal keys and allowed origins. |
| CRM / Council | Authenticated owner-scoped contacts, automation run history, admin controls and ledger. | Requires database migrations and owner authorization. |
| Scheduler | Local worker or authenticated managed callback. | Run **one** worker leader, configure durable DB and secret values. |

The homepage now passes the listener's text to the API as bounded optional creative context; the discovery page consumes the desired track count. The Spotify / Apple Music / other platform selector is **a preference only**, not an integration. No external playlist write is promised.

## Architecture

- Frontend: Expo SDK 54, React Native 0.81, Expo Router 6, TypeScript 5.9, NativeWind.
- Server: Express, tRPC v11, Zod, Node.js, MySQL + Drizzle.
- Governance: CRM owner permissions, admin-only Council, persistent automation state and PVC-U ledger.
- Scripts: pnpm 9.12, Vitest, Docker Compose, pnpm CLI.
- Brand: HARMONÍA, charcoal-glass, restrained purple accents. Keep its visual identity separate from other products.

## Requirements

Node.js 22, pnpm 9.12, and—when running the API with persistent features—a MySQL instance. Docker is optional for development and recommended for the documented service stack.

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm check
pnpm test
pnpm build
```

Run `pnpm dev` for the combined app/API development workflow (the Expo web default port is 8081 and API default port is 3000). For database-backed operations, provision the required environment variables and run migrations according to `docs/environment-and-operations.md`.

```bash
docker compose config --quiet
docker compose up --build
```

Do **not** commit OAuth secrets, database credentials, owner identifiers or runtime tokens. The owner identity must be provisioned and independently verified.

## Tests and release gate

```bash
pnpm exec tsc --noEmit --pretty false --incremental false
pnpm exec eslint app components lib server shared --ext .ts,.tsx
pnpm exec vitest run --pool=forks --poolOptions.forks.singleFork=true
pnpm build
docker compose config --quiet
```

Deploy API and app only after these checks **actually execute successfully**, environment secrets are configured, and end-to-end auth, playlist generation, data isolation, and scheduler callbacks are validated in the target environment. An unexecuted GitHub Actions run does not certify the release.

## Documents

Product, data, security, operations, deployment notes, and architecture decisions are preserved under `docs/`. Refer to `AGENTS.md` before introducing architectural changes. Previous template-specific notes remain in Git history; they are not the product's current identity.

## Scope limitations

AI generation needs configured external inference; a playlist title is not a guaranteed playable/licensed track. Personal library synchronization requires authenticated API and MySQL. The CRM ledger is persisted, but shared global sequence ordering is not multi-writer transaction-safe without further hardening. Do not advertise unrestricted autonomy or production release until the infrastructure is checked.

## License

See `LICENSE`.
