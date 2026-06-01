# BELENTANI — Project TODO

## Design & Aesthetics (v3.0 Redesign)
- [x] Glassmorphism: backdrop-filter blur(16px) + border 1px rgba(255,255,255,0.08)
- [x] Color palette: Negro + Blanco + Púrpura suave (no colores saturados)
- [x] Remove excessive buttons and info from Home
- [x] Input AI at top of Home (minimalista, sin botones visibles)
- [x] Platform buttons discrete under tab: Spotify, iTunes, Apple Music, Deezer, Tidal, Amazon
- [x] Playlist count expandible (predeterminado visible)
- [x] Negative relief UI, discrete interface

## Security Implementation (Protocolo Completo)
- [x] CAPA 1: HttpOnly + Secure + SameSite cookies (config)
- [x] CAPA 1: Refresh token rotation (invalidate old on new)
- [x] CAPA 1: Rate limiting por usuario (5 login/15min, 1000 API/min auth)
- [x] CAPA 2: XSS prevention (textContent, DOMPurify, CSP header)
- [x] CAPA 2: CSRF tokens en POST/PUT/DELETE
- [x] CAPA 2: SQL injection prevention (parametrized queries)
- [x] CAPA 2: Path traversal protection
- [x] CAPA 3: No sensitive content behind blur
- [x] CAPA 3: No GPU tier info in responses
- [x] CAPA 3: CSS sanitization
- [x] CAPA 4: Encryption at rest (AES-256-CBC for tokens)
- [x] CAPA 4: Logs without sensitive data (no emails, no full IPs)
- [x] CAPA 4: Session timeout on inactivity (30 min)
- [x] CAPA 5: Security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- [x] CAPA 5: DDoS protection (rate limit at load balancer)
- [x] CAPA 5: CORS restrictivo (solo dominios permitidos)
- [x] CAPA 6: Anomaly detection (failed login alerts)
- [x] CAPA 6: Structured logging (JSON format, redacted IPs)
- [x] CAPA 6: Incident response plan

## Discover Screen Redesign
- [x] Advanced settings hidden (creativity: high/low toggle)
- [x] Creativity high = experimental, low = conservative
- [x] Strict mode vs. free mode toggle
- [x] Generation based on AI idea, not limited to presets
- [x] Less clicks, more fluidity

## Existing Features (Completed v1.0)
- [x] 9 pantallas completas
- [x] Consejo Ejecutivo Autónomo (5 agentes)
- [x] Kill Switch
- [x] Monetización Freemium
- [x] Player completo
- [x] Diseño dark tipo Spotify

## Existing Features (Completed v2.0)
- [x] LLM integration (Gemini 2.5 Flash)
- [x] Playlist generation with JSON schema
- [x] Fallback mock data
- [x] Discover screen with mood/context/genre selectors
- [x] Error handling and loading states
- [x] Validation tests (9/9 passing)
