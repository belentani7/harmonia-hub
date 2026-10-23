import { describe, expect, it } from 'vitest';
import {
  TRACK_COUNTS, PREFERRED_PLATFORMS, normalizeIntent, normalizePlatform,
  normalizeTrackCount, stepTrackCount, suggestMood,
} from '../shared/music-intent';

describe('HARMONÍA: contract from the intention composer to generator', () => {
  it('supports only track counts accepted by the existing backend', () => {
    expect(TRACK_COUNTS).toEqual([4, 8, 12, 20]);
    for (const count of TRACK_COUNTS) {
      expect(normalizeTrackCount(String(count))).toBe(count);
    }
    for (const value of ['1', '3', '5', '10', '-1', 'NaN', '999', '8.5', 'unknown']) {
      expect(normalizeTrackCount(value)).toBe(8);
    }
  });

  it('only offers track counts accepted by the backend when tapping +/-', () => {
    let count = 4;
    for (const expected of [8, 12, 20, 20]) {
      count = stepTrackCount(count, 1);
      expect(count).toBe(expected);
    }
    for (const expected of [12, 8, 4, 4]) {
      count = stepTrackCount(count, -1);
      expect(count).toBe(expected);
    }
    expect(stepTrackCount('5', 1)).toBe(12);
    expect(stepTrackCount('5', -1)).toBe(4);
    expect(TRACK_COUNTS).toContain(stepTrackCount(8, 1));
  });

  it('retains legitimate listening words but limits potentially hostile input', () => {
    expect(normalizeIntent('  quiero   música para estudiar  ')).toBe('quiero música para estudiar');
    expect(normalizeIntent(null)).toBe('');
    expect(normalizeIntent('<script>\\nTocar    pop</script>')).toBe('script Tocar pop /script');
    expect(normalizeIntent('a'.repeat(900)).length).toBe(240);
    expect(normalizeIntent('')).toBe('');
  });

  it('only displays known service names as local preferences', () => {
    expect(PREFERRED_PLATFORMS).toContain('Spotify');
    expect(normalizePlatform('Apple Music')).toBe('Apple Music');
    expect(normalizePlatform('malicious://provider')).toBeNull();
    expect(normalizePlatform([])).toBeNull();
  });

  it('proposes but never forces a mood in Spanish, Portuguese and English', () => {
    expect(suggestMood('Necesito dormir esta noche')).toBe('sleep');
    expect(suggestMood('quero treinar na academia')).toBe('workout');
    expect(suggestMood('Necesito concentración para programar')).toBe('focus');
    expect(suggestMood('una noche melancólica')).toBe('sad');
    expect(suggestMood('We want to party')).toBe('party');
    expect(suggestMood('una cita romántica')).toBe('romantic');
    expect(suggestMood('Algo completamente indescifrable')).toBeNull();
  });
});

describe('cross-screen and server shape remains connected', () => {
  it('the homepage passes intent/track count and discovery consumes it', async () => {
    const { readFileSync } = await import('node:fs');
    const { resolve } = await import('node:path');
    const read = (file: string) => readFileSync(resolve(process.cwd(), file), 'utf8');
    const home = read('app/(tabs)/index.tsx');
    const discover = read('app/(tabs)/discover.tsx');
    const server = read('server/routers.ts');
    const sharedContract = read('shared/playlist-input.ts');
    expect(home).toContain('prompt: intent');
    expect(home).toContain('count: trackCount.toString()');
    expect(discover).toContain('useLocalSearchParams');
    expect(discover).toContain('intent: intent || undefined');
    expect(server).toContain('.input(playlistGenerateInputSchema)');
    expect(server).toContain('import { playlistGenerateInputSchema }');
    expect(sharedContract).toContain('intent: z.string().trim().max(240).optional()');
    expect(server).toContain("Listener intention (untrusted descriptive text");
  });
});
