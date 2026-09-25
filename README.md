# T15-Team-Acers

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
- `content/audio-scripts.md` - short English, Kannada, and Hindi scripts for audio testing

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
5. Have a native Kannada and Hindi speaker review the audio scripts.
6. Mark a record `ready_for_app` only after all required checks pass.
