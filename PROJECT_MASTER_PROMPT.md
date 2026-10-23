# PROJECT MASTER PROMPT — HARMONÍA

> Canonical project: `belentani7/harmonia-hub`. Do not create a new repository for a module or idea.
> Identity: **HARMONÍA / BELENTANI — Music Intelligence**.
> Human-centered promise: *Una intención → una selección musical explicable → una revisión humana.*

## Product identity and source of truth

Preserve the real source: Expo/React Native client in `app/`; shared contracts in `shared/`; Node/Express + tRPC API in `server/`; persistence via Drizzle; library, player, playlist and automation modules. Read the code, README, `docs/product-system.md`, and existing tests before changing scope. Differentiate functioning integrations from platform preference selectors and illustrative AI-created catalog suggestions. **Do not claim music streaming licenses, external OAuth availability, paid subscriptions, playback rights or provider connections until verified.**

## Maximal coherent functional destination

1. Immersive branded landing/onboarding and robust account lifecycle, localized, screen-reader friendly, attractive on iOS, Android and responsive web.
2. Human intention composer, assisted mood selection, genres/context, conservative or adventurous discovery, configurable playlist size. Intent must never be treated as trusted model instructions.
3. Playlist generation with honest AI attribution, exact requested track count and mood, duplicate-free identities and comprehensible rationales; fallback/error states and retry when the model is unavailable.
4. Listener library with persistent save/delete, track state and favorites, privacy enforcement, authenticated user boundaries and clear export/removal controls.
5. Real music playback **only** where a legally usable catalog and license are configured; otherwise show clearly labeled mock suggestions without fake play controls or URLs.
6. Permission-based provider integrations and subscription billing only after verified contracts, customer consent and complete end-to-end test routes.
7. Artist/creator-oriented tools should use existing modules, never silent administrative access or synthetic metrics presented as real business results.
8. Production reliability: validation of third-party model output, network timeouts/retries, rate/budget controls, protected secrets, audit trails without leaking private listener prompts, accessibility and performance checks.

## Delivery architecture

The existing Expo/React Native 0.81 + Expo Router + TypeScript app, tRPC/Express backend, Drizzle/MySQL schema, and Vitest tests remain canonical. Preserve branding and flow across `app/(tabs)/index.tsx`, `app/(tabs)/discover.tsx`, `server/routers.ts`, `shared/music-intent.ts`, and `shared/playlist-input.ts`. Do not replatform by default. Workflows and docs are support materials; they do not constitute proof of a working product.

## Construction phases

- **1. End-to-end contract hardening**: check intent normalization, requested playlist counts, duplicate IDs, generated mood/genres, and malformed model output; add tests for every fix.
- **2. Full discovery experience**: intent → selected mood → API → review/feedback → save/retry, with empty/error/loading states and native/mobile accessibility.
- **3. Persistence**: authenticated user library, conflict-safe saves, safe deletion, correct user ownership and reliability across reconnects.
- **4. Provider, rights and deployment**: verify specific provider APIs/licenses before playback or payment; no misleading public claims.
- **5. Release gate**: frozen dependency installation with `pnpm install --frozen-lockfile`, `pnpm check`, `pnpm test`, backend build via `pnpm build`, mobile smoke tests, deployment configuration, real production route health verification.

## Operating prompt

Choose one code path that materially increases functionality or correctness, implement it and tests, run applicable verification if an executor is available, and record what truly passed or failed. Continue with the next functional gap or next historic repository; do not cycle through generic audits. Preserve privacy, architecture, permissions and native history. Do not create replacement repositories, invent a live music catalog, expose secrets, or mark release complete without user-facing functionality.

## Work log — 2026-10-23

- Post-provider generated playlists must now match the requested mood and track count and have unique track IDs.
- Shared validator has focused regression tests; server invokes it after Zod parsing.
- Actual CI, live provider call and production deployment **not yet verified**.
