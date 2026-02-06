# Specification

## Summary
**Goal:** Swap the on-screen positions of the Number Board and Call History panels in the main gameplay UI while keeping the layout responsive.

**Planned changes:**
- Update the main gameplay layout so the Call History panel renders where the Number Board previously appeared, and the Number Board renders where the Call History previously appeared (desktop breakpoints).
- Apply the same swapped ordering on mobile breakpoints (responsive swap, not desktop-only).
- Ensure only one Call History panel instance is rendered per breakpoint (avoid duplicate responsive variants showing at once).

**User-visible outcome:** Players see the Number Board and Call History panels swapped in position on both desktop and mobile, with gameplay behavior and call history ordering unchanged.
