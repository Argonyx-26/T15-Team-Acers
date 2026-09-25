# Welcome to your Expo app 👋

## AgroPulse status

The current MVP includes:

- Expo Router mobile/web shell with camera capture and permission handling.
- OpenWeather current conditions with AsyncStorage fallback for offline use.
- Preetham's 24-hour crop risk engine ported to `src/services/risk-engine.ts`.
- Open-Meteo hourly telemetry for temperature, humidity, rainfall probability, and wet-hour streaks.
- Kannada and Hindi speech playback through Expo Speech.
- Local advisory lookup through `assets/data/advisories.json`.

### Data inventory

- `assets/data/advisories.json` currently contains three starter advisories: healthy plant, tomato early blight, and potato late blight.
- `risk-engine/curated_dataset/class_mapping.json` contains 16 PlantVillage classes for potato, rice, and tomato.
- `risk-engine/risk_engine.py` is the source Python implementation for the weather risk criteria.
- No separate Ishan advisory handoff is present yet. Dosages, application frequency, generic alternatives, and complete Kannada/Hindi coverage remain pending.

### Run locally

```bash
npm install
npm run web -- --lan --port 8083
```

Use the LAN URL printed by Expo on another device connected to the same network. The OpenWeather key belongs in the ignored `.env` file; copy `.env.example` before configuring it.

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

### API keys

Copy `.env.example` to `.env` and replace the OpenWeather placeholder with a key from
[OpenWeather](https://home.openweathermap.org/api_keys):

```bash
cp .env.example .env
```

Expo exposes only variables prefixed with `EXPO_PUBLIC_` to the app. Restart `npx expo start`
after changing `.env`; never commit `.env` or place secret keys in source code. Weather continues
using the last cached telemetry when the key is missing or the request fails.

Preetham's risk engine is in `risk-engine/risk_engine.py`, with the same criteria
ported to `src/services/risk-engine.ts`. It uses Open-Meteo hourly data and does not require an
OpenWeather key; the current screen uses the OpenWeather key for current conditions and the
ported engine for the 24-hour risk report.

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
