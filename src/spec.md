# Specification

## Summary
**Goal:** Show the most recent/last drawn Tambola number in a dedicated box above the existing Call History panel.

**Planned changes:**
- Add a new responsive UI card/box above the Call History card in the left column to display the latest drawn number.
- Bind the display to the existing frontend game state (e.g., `gameState.lastDrawn` and `gameState.isComplete`) and update it whenever a new number is drawn.
- Reuse the existing `LastNumberDisplay` component where appropriate, and show a clear placeholder when no number has been drawn yet.

**User-visible outcome:** Players can always see the latest called Tambola number above Call History on both mobile and desktop, with a placeholder shown before any number is drawn.
