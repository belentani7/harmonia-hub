import type { Mood } from './types';

/**
 * Client/server contract for the existing single-playlist music generator.
 * No imaginary streaming integrations, autocomplete catalogs or external APIs.
 */
export const TRACK_COUNTS = [4, 8, 12, 20] as const;

export const PREFERRED_PLATFORMS = [
  'Spotify', 'iTunes', 'Apple Music', 'Deezer', 'Tidal', 'Amazon Music',
] as const;
export type PlatformPreference = typeof PREFERRED_PLATFORMS[number];

export function normalizeIntent(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value
    .normalize('NFKC')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/[<>]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 240);
}

export function normalizePlatform(value: unknown): PlatformPreference | null {
  if (typeof value !== 'string') return null;
  return PREFERRED_PLATFORMS.find(name => name === value) ?? null;
}

export function normalizeTrackCount(value: unknown): number {
  if (value == null || value === '') return 8;
  const numeric = Number(value);
  return Number.isInteger(numeric) && TRACK_COUNTS.some(x => x === numeric) ? numeric : 8;
}

/** Step through exactly the track counts accepted by playlist.generate. */
export function stepTrackCount(value: unknown, direction: -1 | 1): number {
  const count = normalizeTrackCount(value);
  const index = TRACK_COUNTS.findIndex(option => option === count);
  const nextIndex = Math.max(0, Math.min(TRACK_COUNTS.length - 1, index + direction));
  return TRACK_COUNTS[nextIndex];
}

/** Suggest a mood from the listener's words, without inventing a model response. */
export function suggestMood(intent: string): Mood | null {
  const text = normalizeIntent(intent)
    .toLocaleLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  const rules: readonly { mood: Mood; terms: RegExp }[] = [
    { mood: 'workout', terms: /\b(gym|gimnasio|entren\w*|trein\w*|fitness|correr|running|workout)\b/ },
    { mood: 'sleep', terms: /\b(dorm\w*|sleep\w*|insomn\w*|descans\w*|soninho|sono)\b/ },
    { mood: 'romantic', terms: /\b(amor|love|romant\w*|enamor\w*|cita)\b/ },
    { mood: 'sad', terms: /\b(trist\w*|sad|melancol\w*|saudad\w*|nostalg\w*|llor\w*)\b/ },
    { mood: 'party', terms: /\b(fiest\w*|fest\w*|party|bail\w*|danc\w*)\b/ },
    { mood: 'focus', terms: /\b(concentr\w*|focus|study|estud\w*|trabaj\w*|trabalh\w*|work|leitur\w*|program\w*|leer)\b/ },
    { mood: 'energy', terms: /\b(energ\w*|power|motiv\w*|intens\w*|activo|ativa)\b/ },
    { mood: 'chill', terms: /\b(relax\w*|calm\w*|chill|tranquil\w*|suave|quiet)\b/ },
  ];
  return rules.find(rule => rule.terms.test(text))?.mood ?? null;
}
