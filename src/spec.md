# Specification

## Summary
**Goal:** Make “Verify Called Numbers” easier and faster by using 15 position-based inputs, adding voice-to-digits autofill, and showing clear verification failure details.

**Planned changes:**
- Replace the single comma/space-separated Verify Number input with exactly 15 separate input boxes (positions 1–15) that can each be manually typed/edited; verification reads these values and ignores empty boxes.
- Add a Record/Stop voice control in the Verify section using browser-native speech recognition to transcribe one recording, parse digits, and autofill the first 15 valid numbers into inputs 1–15 (with clear listening state and graceful fallback/errors if unsupported or permission is denied).
- Improve verification results messaging to list the specific entered number(s) that have not been called (unique, stable formatting) and keep the success message reflecting the verified count.

**User-visible outcome:** Users can verify called numbers by typing into 15 individual slots or by speaking numbers once to auto-fill them, and if verification fails they can see exactly which numbers were not called.
