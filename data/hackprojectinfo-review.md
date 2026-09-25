# Hack-project information review

**Intake file:** `hackprojectinfo.docx`  
**Received scope:** All districts of Karnataka, Kerala, and Tamil Nadu
**Current status:** Useful draft; not yet production-safe

## Captured scope

| State | Crop | Draft problem |
| --- | --- | --- |
| Karnataka | Ragi | Blast, including neck blast |
| Karnataka | Sugarcane | Red rot and associated cane damage |
| Karnataka | Rice | Bacterial leaf blight / kresek symptoms |
| Kerala | Natural rubber | Abnormal leaf fall / leaf disease symptoms |
| Kerala | Coconut | Bud rot |
| Kerala | Black pepper | Quick wilt |
| Tamil Nadu | Banana | Fusarium wilt / Panama disease symptoms |
| Tamil Nadu | Onion | Purple blotch symptoms |
| Tamil Nadu | Rice | Excluded from the app-ready scope for now; no problem was supplied |

The original MVP was Karnataka-only. This intake expands the requested scope to
three states—Karnataka, Kerala, and Tamil Nadu—so the app should store `state`
and preferably `district` as
explicit fields instead of treating all recommendations as interchangeable.

## Information captured from the document

- Symptoms and impact descriptions for eight crop-problem combinations.
- Candidate cultural and biological practices.
- Candidate chemical products, active ingredients, formulations, rates, and
  waiting periods.
- Four product price estimates: tricyclazole, chlorantraniliprole,
  imidacloprid, and propiconazole.
- Dosage values from the Word document are preserved in
  `data/word-doc-dosage-draft.csv` as user-provided draft data.
- English, Kannada, Hindi, Tamil, and Malayalam reviewer fields (no reviewers
  have been identified yet).
- Developer handoff format: both CSV and JSON.
- Planned app inputs: crop, state/district, crop stage, written symptoms,
  image, field size, and preferred language.

## Missing or incomplete information

### Required from the team

1. **District or demonstration location** is not required for the initial scope:
   all districts are included in `data/target-districts.csv`. Local product
   availability and prices still need district-level evidence before being
   displayed.
2. **Demo district or location**. No district has been selected yet.
3. **Language reviewer names and capabilities** for Kannada, Hindi, Tamil, and
   Malayalam. Blank reviewer fields remain unapproved.
4. **App input contract:** image, farmer text, crop stage, field size, symptoms,
   or a combination.
5. **Developer export requirement:** CSV, JSON, or both. The repository currently
   contains both.
6. **Price date, pack-size evidence, and retailer/source URL** for each cost
   estimate.
7. **Direct links** for the named agriculture sources and product labels. The
   document provides institution names and source descriptions, but no clickable
   source URLs or document page numbers.

### Must be verified before `ready_for_app`

1. An exact authoritative source URL or document page for every recommendation.
2. Product registration and label approval for the stated crop and target.
3. Active ingredient, concentration, formulation, dose, water volume, method,
   and application timing.
4. Pre-harvest interval (PHI), re-entry interval, livestock restrictions, and
   environmental precautions.
5. Whether a stated product is suitable for the disease named in the draft.
6. Whether a mixture is label-approved. The app must not imply that two
   products can be tank-mixed merely because both appear in one draft.
7. Local-language terminology and audio pronunciation review by fluent speakers.

## Safety flags requiring source review

These are **not** being treated as verified recommendations:

- The draft gives product rates and PHIs without exact label URLs or label
  pages.
- Several product names, prices, and manufacturer/retailer claims are
  time-sensitive and need dated evidence.
- The banana pseudostem-injection entry needs confirmation of the exact
  concentration, volume per plant, injection method, and label approval.
- The rice bactericide entry needs confirmation of legal registration,
  compatibility, dose, and PHI for the stated use.
- The rubber entry uses a non-food crop, so tapping restrictions should be
  recorded separately from a food-crop PHI.
- The coconut entry needs confirmation of the application method and whether
  the stated PHI applies to the product and use pattern.
- The onion combination must not be presented as an approved mixture until the
  label or an authoritative recommendation explicitly supports it.

The Word-document dosage register is intentionally separate from
`advisories.csv`. This preserves the information supplied by the team without
claiming that every rate, mixture, application method, or waiting period is
currently label-approved.

## Research plan for missing data

1. Find the official package of practices or crop advisory from the relevant
   agricultural university, ICAR institute, KVK, or state agriculture
   department.
2. Obtain the current registered product label for each chemical entry.
3. Compare the label against crop, target, formulation, rate, method, PHI, and
   safety restrictions.
4. Record the exact URL/document title, page number, access date, and reviewer.
5. Add only verified values to the app-ready record; retain disputed values in
   a review note.
6. Obtain local prices from at least one dated dealer or retailer quote and
   calculate cost per acre from the verified dose.

## Status mapping

- `draft`: transcribed from the Word document; not checked.
- `needs_source_verification`: a source or label is missing.
- `needs_local_review`: source exists but local agronomist or language review is
  pending.
- `ready_for_app`: all required technical, safety, price, and language checks
  are complete.

The Word-document entries should remain `needs_source_verification`. CPCRI's
official coconut bud-rot page is recorded as `source_backed_needs_label_check`,
but its guidance still needs current product-label and worker-safety checks
before it becomes an app recommendation. The
Tamil Nadu rice row is not included in the app-ready crop-problem scope until
the team defines a problem for it.
