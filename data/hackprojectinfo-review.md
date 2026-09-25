# Hack-project information review

**Intake file:** `hackprojectinfo.docx`  
**Received scope:** Karnataka, Kerala, and Tamil Nadu  
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
| Tamil Nadu | Rice | Crop listed, but no separate problem was provided |

The original MVP was Karnataka-only. This intake expands the requested scope to
three states, so the app should store `state` and preferably `district` as
explicit fields instead of treating all recommendations as interchangeable.

## Information captured from the document

- Symptoms and impact descriptions for eight crop-problem combinations.
- Candidate cultural and biological practices.
- Candidate chemical products, active ingredients, formulations, rates, and
  waiting periods.
- Four product price estimates: tricyclazole, chlorantraniliprole,
  imidacloprid, and propiconazole.
- English, Kannada, Hindi, Tamil, and Malayalam reviewer fields.

## Missing or incomplete information

### Required from the team

1. **District or demonstration location** for each state. "All districts" is too
   broad for local availability and advisory wording.
2. **Tamil Nadu rice problem** or confirmation that the duplicate crop should be
   removed.
3. **Language reviewer names and capabilities** for Kannada, Hindi, Tamil, and
   Malayalam. Blank reviewer fields remain unapproved.
4. **App input contract:** image, farmer text, crop stage, field size, symptoms,
   or a combination.
5. **Developer export requirement:** CSV, JSON, or both. The repository currently
   contains both.
6. **Price date, pack-size evidence, and retailer/source URL** for each cost
   estimate.

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

At present, the Word-document entries should remain `needs_source_verification`.
