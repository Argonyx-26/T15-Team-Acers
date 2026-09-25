# AgroPulse Project Status

Updated: 2026-09-25

This document records the implementation decisions, handoffs, validation results,
and remaining work from the AgroPulse development conversation.

## Product Direction

AgroPulse is an offline-first crop-health assistant for farmers. The MVP focuses
on three workflows:

1. Capture or upload a crop-leaf image.
2. Combine on-device disease classification with local weather risk.
3. Read an actionable advisory aloud in Kannada or Hindi.

High-fidelity future concepts such as drone multispectral dashboards and LoRaWAN
sensor monitoring remain presentation/Figma work, not current MVP scope.

## Team Handoffs

- Jyothir: Figma screens and presentation visuals for post-MVP features.
- Preetham: PlantVillage class mapping and the Python weather risk engine.
- Ishan: advisory and dosage data, currently supplied as draft intake files.
- Visweshwara: Expo frontend, API wiring, offline behavior, and device testing.

## Implemented

### App shell and UI

- Expo Router app using Expo SDK 57.
- Field-oriented dark dashboard UI with diagnosis, weather risk, and audio areas.
- Camera permission flow using `expo-camera`.
- Gallery upload using `expo-image-picker`.
- Both camera capture and gallery upload use the same diagnosis pipeline.
- Camera-denied users can still upload an existing photo.
- “Use another image” reset action.

### Weather and risk

- OpenWeather current conditions through Axios.
- AsyncStorage cache fallback for zero-connectivity use.
- Open-Meteo hourly telemetry for the risk engine.
- TypeScript port of Preetham’s 24-hour tomato, potato, and rice risk criteria in
  `src/services/risk-engine.ts`.
- Risk output includes score, alert level, average weather, rain probability, and
  consecutive wet hours.

### ML mapping

- All 16 PlantVillage classes are represented in `src/services/model-mapping.ts`.
- Highest-confidence output selection is implemented.
- Model labels resolve to stable advisory keys.
- Missing advisory coverage returns no key instead of showing the wrong treatment.
- The UI reports `16 LABELS MAPPED` until a trained model is configured.

### Speech

- Expo Speech playback for Kannada and Hindi.
- Installed voices are detected and selected explicitly.
- Voice lookup refreshes when the farmer presses play.
- Playback state and missing-voice errors are shown in the UI.

### Configuration and local access

- `.env.example` documents public Expo variables.
- `.env` is ignored and must never be committed.
- OpenWeather keys are loaded through `EXPO_PUBLIC_` variables.
- Expo LAN and tunnel workflows were tested.
- Expo Go tunnel command:

```bash
npm run start -- --tunnel
```

## Data Inventory

### Preetham

- `risk-engine/risk_engine.py`: source Python risk engine.
- `risk-engine/curated_dataset/class_mapping.json`: 16 model classes.
- `src/services/risk-engine.ts`: app-side port of the risk criteria.

### Ishan

- `../data/advisories.json`: structured advisory intake.
- `../data/advisories.csv`: tabular advisory intake.
- `../data/word-doc-dosage-draft.csv`: dosage draft transcribed from the
  submitted document.
- `../data/README.md`: required fields and verification contract.

Current advisory intake covers tomato aphids, tomato early blight, rice stem
borer, and chilli thrips. The app still uses the smaller starter catalog at
`assets/data/advisories.json`; the root data must be transformed and connected
before it becomes runtime treatment content.

## Important Safety State

The Ishan dosage records are marked as needing local or label verification. They
must not be presented as final recommendations until crop, target, formulation,
dose, water volume, waiting period, safety notes, source, generic alternative,
and cost are verified.

The app must present predictions as decision support, not a guaranteed diagnosis.
Unmapped or low-confidence model outputs need a review/escalation state.

## Pending Work

### Highest priority

1. Obtain the trained model artifact and confirm ONNX versus TFLite format.
2. Confirm model input dimensions, RGB/BGR order, normalization, output tensor,
   and label ordering.
3. Implement image preprocessing and real inference using the mapping service.
4. Replace the temporary demo diagnosis result.
5. Transform Ishan’s advisory files into the app runtime schema.
6. Add advisory records for the remaining 16 model classes.

### Advisory completion

- Verify every dosage against a current official label or authoritative package.
- Fill approved chemical actions and active ingredients.
- Add formulation-matched generic alternatives.
- Add dated cost estimates.
- Complete state/district applicability.
- Review Kannada and Hindi scripts with fluent agricultural speakers.
- Add source URLs/documents and change records.

### Device and release work

- Add `expo-location` and replace the temporary Bengaluru coordinates.
- Build a development APK/iOS build for native TFLite testing.
- Test camera, gallery, offline cache, speech, permissions, and low-confidence
  behavior on physical devices.
- Finish ESLint setup and add risk/mapping unit tests.
- Add safe dosage calculation UI only for verified records.

## Validation

The following checks have passed during development:

```bash
npx tsc --noEmit
```

The advisory and class-mapping JSON files have also been parsed successfully.

## Git and Secrets

- Remote: `https://github.com/Argonyx-26/T15-Team-Acers.git`
- Latest pushed commit before the current local UI/model-mapping edits:
  `9c05721`
- The presentation file `Argonyx26_PS3_Crop_Disease_Prediction.pptx` is intentionally
  excluded from commits.
- `.env`, Expo caches, generated files, and `node_modules` are ignored.
- Never put API key values in this document or in source code.
