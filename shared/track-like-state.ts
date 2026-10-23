/**
 * A desired track like state is idempotent: retries cannot accidentally
 * undo a user's action. The optional target retains legacy toggle behavior
 * for callers that have not yet migrated to an explicit intent.
 */
export function desiredLikeState(currentlyLiked: boolean, active?: boolean): boolean {
  return active ?? !currentlyLiked;
}
