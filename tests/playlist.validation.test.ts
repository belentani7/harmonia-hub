import { describe, it, expect } from "vitest";
import { playlistGenerateInputSchema } from "../shared/playlist-input";

describe("Playlist generation input — actual API schema", () => {
  it("accepts the homepage choices and forwards a listener intention", () => {
    for (const trackCount of [4, 8, 12, 20]) {
      const parsed = playlistGenerateInputSchema.safeParse({
        mood: "focus",
        trackCount,
        listenerIntent: "  Calma para estudiar de noche  ",
      });
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.trackCount).toBe(trackCount);
        expect(parsed.data.listenerIntent).toBe("Calma para estudiar de noche");
      }
    }
  });

  it("applies defaults used by the discovery screen", () => {
    const parsed = playlistGenerateInputSchema.parse({ mood: "chill" });
    expect(parsed.trackCount).toBe(8);
    expect(parsed.creativity).toBe("high");
    expect(parsed.strictMode).toBe(false);
  });

  it("rejects impossible counts and maliciously large input", () => {
    for (const count of [0, 3, 21, NaN, 8.5]) {
      expect(playlistGenerateInputSchema.safeParse({ mood: "focus", trackCount: count }).success).toBe(false);
    }
    expect(playlistGenerateInputSchema.safeParse({
      mood: "focus",
      listenerIntent: "x".repeat(501),
    }).success).toBe(false);
  });

  it("rejects invalid moods and very long genre terms", () => {
    expect(playlistGenerateInputSchema.safeParse({ mood: "unknown" }).success).toBe(false);
    expect(playlistGenerateInputSchema.safeParse({
      mood: "energy",
      genres: ["a".repeat(65)],
    }).success).toBe(false);
  });

  it("accepts valid listener context and optional genres", () => {
    expect(playlistGenerateInputSchema.safeParse({
      mood: "party",
      context: "drive",
      genres: ["dance", "pop"],
      trackCount: 10,
    }).success).toBe(true);
  });
});
