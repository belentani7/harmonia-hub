import { describe, expect, it } from "vitest";
import { desiredLikeState } from "../shared/track-like-state";

describe("Library liked track state", () => {
  it("respects explicit like and unlike even when state has already changed", () => {
    for (const current of [false, true]) {
      expect(desiredLikeState(current, true)).toBe(true);
      expect(desiredLikeState(current, false)).toBe(false);
    }
  });

  it("does not flip likes if a successful request is retried", () => {
    let active = desiredLikeState(false, true);
    active = desiredLikeState(active, true);
    expect(active).toBe(true);
    active = desiredLikeState(active, false);
    active = desiredLikeState(active, false);
    expect(active).toBe(false);
  });

  it("keeps the backward-compatible toggle when older callers omit active", () => {
    expect(desiredLikeState(false)).toBe(true);
    expect(desiredLikeState(true)).toBe(false);
  });

  it("resolves each quick press against the latest synchronous local state", () => {
    const liked: Record<string, boolean> = {};
    function press(id: string) {
      liked[id] = desiredLikeState(Boolean(liked[id]));
      return liked[id];
    }
    expect(press("track-1")).toBe(true);
    expect(press("track-1")).toBe(false);
    expect(press("track-1")).toBe(true);
  });
});
