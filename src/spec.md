# Specification

## Summary
**Goal:** Add a Quick Reset button and require confirmation dialogs for Quick Reset and New Game, with distinct reset behaviors.

**Planned changes:**
- Add a new gameplay control button labeled “Quick Reset” alongside existing controls, ensuring it works in both mobile and desktop responsive layouts.
- Add confirmation popups (Yes/No) for both “Quick Reset” and “New Game” with English prompts, and only execute the action on “Yes”.
- Implement separate reset handlers:
  - Quick Reset: reset numbers-related game state and stop auto-draw while preserving the current interval value.
  - New Game: full reset including restoring auto-draw settings to their default values.
- Ensure the updated state is persisted to browser storage and remains consistent after refresh.

**User-visible outcome:** Players can tap “Quick Reset” or “New Game” and will see a Yes/No confirmation; confirming performs the appropriate reset, and canceling leaves the game unchanged.
