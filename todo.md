# BELENTANI — Project TODO

## Setup & Branding
- [x] Generate BELENTANI logo with AI
- [x] Configure dark theme colors (Spotify-like)
- [x] Update app.config.ts with BELENTANI branding
- [x] Update theme.config.js with BELENTANI color palette

## Navigation Structure
- [x] Configure bottom tab bar (Home, Discover, Library, Profile)
- [x] Add icon mappings for all tabs
- [x] Create modal stack for Player screen
- [x] Create CEO Dashboard screen (admin)

## Onboarding
- [x] 4-step onboarding carousel
- [x] AsyncStorage flag to skip on subsequent launches

## Home Screen
- [x] Personalized greeting header
- [x] CEO Daily Strategy card
- [x] Quick mood chips (horizontal scroll)
- [x] Recent playlists (horizontal scroll)
- [x] Trending playlists section

## Discover / AI Playlist Generator
- [x] Mood selector grid (8 moods with colors/emojis)
- [x] Context selector chips
- [x] Genre multi-select pills
- [x] "Generate Playlist" CTA button
- [x] AI playlist generation via server LLM
- [x] Generated playlist result view
- [x] Save to library functionality

## Library Screen
- [x] My playlists grid
- [x] Liked songs list
- [x] Recently played list
- [x] Artist marketplace section

## Player Screen
- [x] Full-screen player modal
- [x] Album art display
- [x] Progress bar with scrubbing
- [x] Playback controls (shuffle, prev, play/pause, next, repeat)
- [x] Like / add to playlist / share actions
- [x] Mini player sticky bar
- [x] AI insight card ("why this song")
- [x] Lyrics tab (premium gate)

## Profile Screen
- [x] User avatar and stats
- [x] Subscription badge (Free/Premium/Creator)
- [x] Link to CEO Dashboard (admin)
- [x] Settings link
- [x] Sign in/out

## CEO Dashboard
- [x] 5 Agent cards (CEO, COO, CMO, CPO, CTO)
- [x] Daily Strategy card with AI analysis
- [x] Key metrics display (Users, Revenue, Churn, Engagement)
- [x] Autonomous actions log
- [x] "Trigger Council Analysis" button with LLM integration
- [x] Kill Switch toggle with confirmation modal
- [x] Risks tab

## Data & State Management
- [x] Playlist data model (mock data)
- [x] Player state context (current track, queue, playback)
- [x] CEO strategy mock data
- [x] Liked tracks state

## Monetization
- [x] Subscription tiers UI (Free, Premium $4.99, Creator $14.99)
- [x] Premium feature gates (lyrics)
- [x] Upgrade prompt banner in Profile

## Backend / AI
- [x] Server router with playlist.generate endpoint (AI + fallback)
- [x] Server router with council.analyze endpoint (AI + fallback)
- [x] LLM integration with Gemini 2.5 Flash model
- [x] JSON schema validation for LLM responses
- [x] Structured fallback data when LLM fails
- [x] TypeScript 0 errors
