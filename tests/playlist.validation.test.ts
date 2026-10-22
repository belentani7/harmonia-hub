import { describe, expect, it } from "vitest";
import { playlistGenerateInputSchema } from "../shared/playlist-input";

describe("Playlist generation — router's real input contract", () => {
  it("accepts every track count offered by the homepage", () => {
    for (const trackCount of [4, 8, 12, 20]) {
      const parsed = playlistGenerateInputSchema.safeParse({
        mood: "focus",
        trackCount,
        intent: "  música para trabajar  ",
      });
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.trackCount).toBe(trackCount);
        expect(parsed.data.intent).toBe("música para trabajar");
      }
    }
  });

  it("defaults to eight tracks with optional preference fields", () => {
    expect(playlistGenerateInputSchema.parse({ mood: "chill" })).toMatchObject({
      trackCount: 8,
      creativity: "high",
      strictMode: false,
    });
  });

  it("rejects invalid counts, unknown mood and overlong intent", () => {
    for (const trackCount of [0, 3, 21, 7.5]) {
      expect(playlistGenerateInputSchema.safeParse({ mood: "focus", trackCount }).success).toBe(false);
    }
    expect(playlistGenerateInputSchema.safeParse({ mood: "invalid" }).success).toBe(false);
    expect(playlistGenerateInputSchema.safeParse({
      mood: "focus",
      intent: "x".repeat(241),
    }).success).toBe(false);
  });

  it("supports a known context and a bounded genre list", () => {
    expect(playlistGenerateInputSchema.safeParse({
      mood: "energy",
      intent: "Música para conducir",
      context: "drive",
      genres: ["rock", "pop"],
      trackCount: 12,
    }).success).toBe(true);
    expect(playlistGenerateInputSchema.safeParse({
      mood: "energy",
      genres: ["y".repeat(65)],
    }).success).toBe(false);
  });
});
