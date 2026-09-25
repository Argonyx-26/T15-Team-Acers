# T15-Team-Acers

## AgroPulse Status

| Area | Status | Current state |
| --- | --- | --- |
| Expo app and UI | In progress | Mobile/web dashboard with camera and gallery upload |
| ML label mapping | Ready | All 16 PlantVillage classes mapped in TypeScript |
| Trained model inference | Pending | Model artifact and tensor contract still required |
| Weather pipeline | Working | OpenWeather current conditions plus cached fallback |
| Crop risk engine | Working | Preetham's 24-hour Open-Meteo criteria ported to TypeScript |
| Kannada/Hindi speech | Device-dependent | Voice detection, playback state, and missing-voice errors implemented |
| Ishan advisory data | Draft | Advisory CSV/JSON and dosage draft exist; verification is pending |
| Offline behavior | In progress | Weather cache is active; verified advisory/model assets remain to be connected |
| Physical-device release | Pending | Development build required for native TFLite inference |

The detailed implementation handoff is documented in
[`agropulse-app/PROJECT_STATUS.md`](agropulse-app/PROJECT_STATUS.md).

## Agri-Logic & Content Manager MVP

This repository contains the content and data contract for the AgriPulse advisory
feature. The current hackathon intake covers crop problems in Karnataka, Kerala,
and Tamil Nadu. The original starter records remain a small demonstration set;
the Word-document intake and its gaps are tracked in
`data/hackprojectinfo-review.md`.

### Deliverables

- `data/advisories.csv` - importable advisory records for the app team
- `data/README.md` - field definitions, validation rules, and dosage-calculation rules
- `data/kerala-tamilnadu-crop-sources.csv` - source and package register for the additional states
- `data/kerala-tamilnadu-packages.md` - package-of-practices collection guide
- `data/target-districts.csv` - all districts in Karnataka, Kerala, and Tamil Nadu
- `data/word-doc-dosage-draft.csv` - dosage values transcribed from the submitted Word document, pending verification
- `data/updated-source-register.csv` - source/package records from the updated Word document
- `data/updated-crop-problems.csv` - crop symptoms and preventive guidance from the updated Word document
- `data/latest-product-verification.csv` - latest product-label and dosage records, pending evidence
- `data/latest-final-status.csv` - final readiness status for each crop problem
- `data/app-safety-settings.txt` - team-approved recommendation safety behavior
- `content/audio-scripts.md` - optional short multilingual scripts; language review is outside the current scope

### Safety rule

No pesticide dosage is added unless it is verified against a current, locally
approved product label or an authoritative agricultural recommendation. Brand names
are not treated as interchangeable. The app must show the active ingredient,
formulation, approved crop/target, label dose, waiting period, and safety guidance
before displaying a chemical recommendation.

### Workflow

1. Review the sample records with the agriculture mentor.
2. Confirm the target state/region and the supported crops.
3. Replace `source_pending` values with authoritative sources.
4. Add only label-verified dosage and cost data.
5. Mark a record `ready_for_app` only after all required technical, source,
   safety, and price checks pass.
