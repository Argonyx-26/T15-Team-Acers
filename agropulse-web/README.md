# AgroPulse Web Portal

A human-centered, grounded web interface for the AgroPulse crop health and microclimate epidemiological risk engine. Designed specifically for agricultural decision support across Karnataka, Kerala, and Tamil Nadu.

## Features

1. **Leaf Diagnostic Station**:
   - Calibrated against the 16 target classes from the MobileNetV2 model.
   - Interactive reference leaf specimens with characteristic botanical pathology illustrations (Early Blight, Late Blight, Bacterial Leaf Blight, Spider Mites, Brown Spot, Healthy Foliage).
   - Live photo upload with 224x224 RGB preprocessing simulation.
   - Severity badges, observable symptom breakdown, and immediate non-chemical cultural practices.

2. **Vernacular Field Audio Player**:
   - Web Speech API integration with voice detection.
   - Clear, measured speech rate (0.84x) suited for field conditions.
   - Full scripts in **English**, **Kannada (ಕನ್ನಡ)**, and **Hindi (हिन्दी)**.

3. **Field Dosage & Safe Dilution Calculator**:
   - Regional land measurement units: **Acres**, **Gunthas** (1 Acre = 40 Gunthas), and **Cents** (1 Acre = 100 Cents).
   - Total spray water volume (L) and chemical requirement calculation.
   - Pre-Harvest Interval (PHI) waiting period display.
   - Strict label verification alerts to prevent unverified chemical application.

4. **24-Hour Microclimate Epidemiological Risk**:
   - Live telemetry integration with Open-Meteo forecast API (with offline cache fallback).
   - Real-time evaluation of:
     - **Wallin / Hyre Severity Criteria** for Late Blight (*Phytophthora infestans*) on Tomato/Potato.
     - **IRRI Epidemiological Criteria** for Rice Blast (*Magnaporthe oryzae*).
   - Interactive 24-hour Relative Humidity (RH) and Temperature bar chart with critical sporulation thresholds (≥90% RH).
   - Consecutive wet hours calculation (leaf wetness surrogate).

5. **Regional Agronomic Packages & District Registry**:
   - Complete directory of 84 agro-climatic districts across Karnataka, Kerala, and Tamil Nadu.
   - Direct references to ICAR, UAS Bangalore/Dharwad, KAU Kerala, and TNAU packages of practices.

## Running Locally

To run the web portal:

```bash
# From repository root:
./run-website.sh

# Or directly in agropulse-web:
cd agropulse-web
npm run dev
```

Visit `http://localhost:5173` in your browser.

## Production Build

```bash
npm run build
npm run preview
```
