# Specification

## Summary
**Goal:** Ensure host voice recordings play only for the exact drawn number (1–90), fix “digits-then-number” sequencing to avoid recording collisions, and provide a Host Voice Recordings manager UI consistent with the provided screenshot.

**Planned changes:**
- Update recorded-clip lookup to match numbers exactly (1–90) so a clip for “1” never triggers for “12”, “13”, “41”, etc.
- Adjust announcement sequencing for “digits-then-number” mode so digit steps always use TTS and only the final full-number step may use a host recording (based on voice source priority).
- Keep (or recreate if missing) the “Host Voice Recordings” dialog UI: title, instructions, scrollable 1–90 grid, per-number record/stop, per-number play/delete when a recording exists, recorded indicator per number, recorded count badge (“X / 90 recorded”), and Close action; refresh recorded state on open.

**User-visible outcome:** Host announcements reliably use the correct recording only for the exact drawn number, digit-by-digit announcements never accidentally trigger recordings, and users can manage recordings for numbers 1–90 via a dedicated dialog matching the shown design.
