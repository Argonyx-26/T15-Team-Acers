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
- Kannada and Hindi were reviewed by a fluent speaker;
- the recommendation does not imply a certain diagnosis from an uncertain image.
