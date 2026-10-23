import { z } from "zod";

/** The same contract is consumed by the API router and its regression tests. */
export const playlistGenerateInputSchema = z.object({
  mood: z.enum(["focus", "chill", "energy", "sad", "party", "sleep", "romantic", "workout"]),
  intent: z.string().trim().max(240).optional(),
  context: z.enum(["work", "gym", "sleep", "drive", "study", "party", "meditation"]).optional(),
  genres: z.array(z.string().min(1).max(64)).max(12).optional(),
  trackCount: z.number().int().min(4).max(20).default(8),
  creativity: z.enum(["low", "high"]).default("high"),
  strictMode: z.boolean().default(false),
});

export type PlaylistGenerateInput = z.input<typeof playlistGenerateInputSchema>;


// Model output is untrusted even when the provider promises JSON schema.
// Preserve the exact user request and reject duplicate track identities.
export function validateGeneratedPlaylist(
  result: { mood?: string; tracks: readonly { id: string }[] },
  request: { mood: string; trackCount: number },
): void {
  if (result.mood !== request.mood) {
    throw new Error("Generated playlist mood differs from the requested mood");
  }
  if (result.tracks.length !== request.trackCount) {
    throw new Error("Generated playlist contains the wrong number of tracks");
  }
  if (new Set(result.tracks.map(track => track.id)).size !== result.tracks.length) {
    throw new Error("Generated playlist contains duplicate track IDs");
  }
}
