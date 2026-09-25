\# Argonyx QA Bug Tracker



| Bug ID | Component | Severity | Description | Status |
|---|---|---|---|---|
| BUG-01 | Camera / PWA | High | Non-leaf image (desk photo) classified with >85% confidence instead of rejection | **Resolved** (Added OOD background rejection class `Background_without_leaves` & Shannon entropy gate; rejects non-leaf with 87.1% confidence) |
| BUG-02 | Weather API | Medium | Coordinate lookup times out if GPS is disabled on mobile browser | **Resolved** (Introduced 84-district offline fallback registry across KA, TN, KL with instant preset coordinates) |
| BUG-03 | UI / Gauge | Low | Risk gauge needle clips on small screens (e.g., iPhone SE resolution) | **Resolved** (Rebuilt in `agropulse-web` with responsive viewBox SVG gauge and responsive breakpoints) |

