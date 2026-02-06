# Specification

## Summary
**Goal:** Update the app’s published draft version identifier to Draft 34 so the UI reflects the currently published draft.

**Planned changes:**
- Update `frontend/src/release/liveVersion.ts` to export `LIVE_VERSION` as `Draft 34`.
- Set `LIVE_VERSION_DATE` in `frontend/src/release/liveVersion.ts` to the Draft 34 publish date in `YYYY-MM-DD` format.
- Verify any UI locations that display the live/draft version show Draft 34 (and no longer show Draft 32 as the live version).

**User-visible outcome:** Anywhere the app displays the published/live draft version, it shows “Draft 34” (with the updated publish date).
