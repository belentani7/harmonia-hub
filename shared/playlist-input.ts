import { z } from "zod";

/**
 * Shared API contract for user-provided playlist preferences.
 * Both clients and tests should validate against the router's actual schema.
 */
export const playlistGenerateInputSchema = z.object({
  mood: z.enum(["focus", "chill", "energy", "sad", "party", "sleep", "romantic", "workout"]),
  context: z.enum(["work", "gym", "sleep", "drive", "study", "party", "meditation"]).optional(),
  genres: z.array(z.string().min(1).max(64)).max(12).optional(),
  trackCount: z.number().int().min(4).max(20).default(8),
  creativity: z.enum(["low", "high"]).default("high"),
  strictMode: z.boolean().default(false),
  listenerIntent: z.string().trim().max(500).optional(),
});

export type PlaylistGenerateInput = z.input<typeof playlistGenerateInputSchema>;
