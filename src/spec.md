# Specification

## Summary
**Goal:** Roll back and redeploy the live app using Draft 52 exactly as-is (discarding Drafts 53/54), and ensure live version metadata reflects Draft 52.

**Planned changes:**
- Rebuild and deploy the application from Draft 52 code only (do not include Draft 53/54), with no intentional functional or visual changes.
- Verify the “Voice Announcements” toggle default state on fresh load matches Draft 52 behavior (OFF by default) and is not carrying over Draft 54 behavior.
- Update `frontend/src/release/liveVersion.ts` to set `LIVE_VERSION` to “Draft 52” and set `LIVE_VERSION_DATE` to the deployment date (YYYY-MM-DD).

**User-visible outcome:** The live app runs the Draft 52 build; on a fresh session the “Voice Announcements” toggle defaults to OFF (as in Draft 52), and the app’s live version label shows Draft 52 with the updated date.
