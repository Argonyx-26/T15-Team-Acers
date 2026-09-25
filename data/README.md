# Advisory data contract

## Required fields

| Field | Meaning |
| --- | --- |
| `id` | Stable identifier used by the app |
| `crop` | Crop name |
| `state` | State where the recommendation applies |
| `district` | District or locality, when the recommendation is localized |
| `problem` | Pest, disease, or non-pest issue |
| `symptoms` | Farmer-observable symptoms |
| `severity` | `low`, `medium`, or `high` |
| `immediate_action` | First action before chemical escalation |
| `eco_friendly_action` | Cultural, mechanical, biological, or low-impact action |
| `chemical_action` | Label-approved action, or empty until verified |
| `active_ingredient` | Active ingredient, never only a brand name |
| `dose_value` | Numeric label dose, empty until verified |
| `dose_unit` | Unit such as `ml/L`, `g/L`, or `kg/acre` |
| `water_volume_l_per_acre` | Label or recommendation water volume |
| `waiting_period_days` | Pre-harvest interval from the label |
| `safety_notes` | PPE, weather, re-entry, and environmental warnings |
| `generic_alternative` | Verified equivalent formulation, or empty |
| `estimated_cost_inr_per_acre` | Cost estimate with a dated source |
| `en_script` | English audio advisory |
| `kn_script` | Kannada audio advisory |
| `hi_script` | Hindi audio advisory |
| `source` | URL or document name |
| `verification_status` | `draft`, `needs_local_verification`, or `ready_for_app` |

The current intake covers Karnataka, Kerala, and Tamil Nadu. Do not use a
state-wide record as proof that a product is approved or available in every
district.

The Kerala and Tamil Nadu source register is in
`kerala-tamilnadu-crop-sources.csv`, with package references in
`kerala-tamilnadu-packages.md`.

The initial geography list for all districts in the three states is in
`target-districts.csv`. District coverage does not mean that every product is
approved, stocked, or priced identically in every district.

The dosage values transcribed from the submitted Word document are preserved in
`word-doc-dosage-draft.csv`. They are explicitly marked
`user_provided_needs_verification` or `user_provided_needs_label_verification`.
They must not be shown as final recommendations until the crop, target,
formulation, dose, method, waiting period, and safety instructions are checked
against a current official label or agricultural package.

The updated Word-document source and crop-problem records are in
`updated-source-register.csv` and `updated-crop-problems.csv`.

The latest product-label records, final readiness states, and app safety
settings are in `latest-product-verification.csv`, `latest-final-status.csv`,
and `app-safety-settings.txt`.

Tomato and potato intake records are in:

- `tomato-potato-source-register.csv`
- `tomato-potato-crop-problems.csv`
- `tomato-potato-product-verification.csv`
- `tomato-potato-calculations.csv`
- `tomato-potato-prices-and-alternatives.csv`
- `tomato-potato-diagnosis.csv`
- `tomato-potato-final-status.csv`

The Word document expands potato coverage to Punjab. Its 23-district scope is
listed in `punjab-districts.csv`; all new tomato and potato records remain
pending verification.

The updated regulatory claims and diagnostic protocols from the document are
preserved in `updated-regulatory-status.csv` and `diagnostic-protocols.csv`.
These are evidence-tracking records, not proof that a product is legally
approved for every listed crop or target.

The soil and climate layer is in `soil-climate-baseline.csv`,
`soil-climate-risk-rules.csv`, and `soil-climate-source-register.csv`.
Soil pH, nutrient, rainfall, and district mappings are regional baselines—not
substitutes for a farmer's laboratory soil test. The supplied report does not
cover Punjab soil/climate even though potato coverage includes Punjab; that
state needs a separate soil baseline before soil-aware potato logic is enabled.
The app should request or
accept soil-test pH, EC, organic carbon, N, P, K, and texture when available.

The later Word-document soil update is preserved in
`updated-soil-climate-profiles.csv`. It adds crop-specific regional profiles
for ragi, sugarcane, rice, and potato in Karnataka; rubber, coconut, and black
pepper in Kerala; and paddy, coconut, banana, tomato, and potato in Tamil Nadu.
These records remain `team_document_needs_independent_verification`: the
document contains blank numeric fields for several Tamil Nadu records and
mostly portal-level citations without exact pages or tables. Do not expose its
fertilizer, lime, gypsum, pesticide, or disease-threshold claims as verified
recommendations until the cited source documents and units are checked.

## Dosage calculation

Only calculate a quantity after the label dose and the required field units are
known:

```text
total product = dose per acre x field area in acres
total water = water volume per acre x field area in acres
```

For a dose expressed per litre:

```text
total product = dose per litre x total water volume in litres
```

The UI must reject missing, zero, negative, or unverified values. It must show the
source and the waiting period alongside the result.

## Verification checklist

Before changing a record to `ready_for_app`, confirm:

- crop and target are approved for the product;
- active ingredient, concentration, and formulation match;
- dose and water volume come from a current label or authoritative source;
- waiting period and safety instructions are recorded;
- generic alternatives have the same active ingredient and formulation;
- cost is calculated per acre and has a date/source;
- the recommendation does not imply a certain diagnosis from an uncertain image.
