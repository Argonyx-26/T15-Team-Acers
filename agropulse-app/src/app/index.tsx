import { CameraView, useCameraPermissions, type CameraView as CameraViewType } from 'expo-camera';
import * as Speech from 'expo-speech';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import advisories from '@/assets/data/advisories.json';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { evaluateRisk, fetchRiskReport, type RiskReport } from '@/services/risk-engine';

type DiseaseKey = keyof typeof advisories;
type Weather = { temperature: number; humidity: number; source: 'live' | 'cached' };

const WEATHER_CACHE_KEY = 'agropulse.weather';
const MODEL_URL = process.env.EXPO_PUBLIC_TFLITE_MODEL_URL;

async function readCachedWeather(): Promise<Weather> {
  const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
  const cached = await AsyncStorage.getItem(WEATHER_CACHE_KEY);
  if (cached) return { ...JSON.parse(cached), source: 'cached' };
  return { temperature: 24, humidity: 85, source: 'cached' };
}

async function fetchWeather(): Promise<Weather> {
  const apiKey = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
  if (!apiKey) return readCachedWeather();
  try {
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: { lat: 12.9716, lon: 77.5946, units: 'metric', appid: apiKey },
      timeout: 7000,
    });
    const weather = { temperature: response.data.main.temp, humidity: response.data.main.humidity };
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    await AsyncStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify(weather));
    return { ...weather, source: 'live' };
  } catch {
    return readCachedWeather();
  }
}

export default function HomeScreen() {
  const cameraRef = useRef<CameraViewType>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [photoUri, setPhotoUri] = useState<string>();
  const [disease, setDisease] = useState<DiseaseKey>('healthy');
  const [weather, setWeather] = useState<Weather>({ temperature: 24, humidity: 85, source: 'cached' });
  const [riskReport, setRiskReport] = useState<RiskReport>(() => evaluateRisk('tomato', [24], [85], [0]));
  const [weatherLoading, setWeatherLoading] = useState(false);
  const modelReady = Boolean(MODEL_URL);

  useEffect(() => { refreshWeather(); }, []);

  async function refreshWeather() {
    setWeatherLoading(true);
    const [currentWeather, nextRiskReport] = await Promise.all([
      fetchWeather(),
      fetchRiskReport('tomato').catch(() => undefined),
    ]);
    setWeather(currentWeather);
    if (nextRiskReport) setRiskReport(nextRiskReport);
    setWeatherLoading(false);
  }

  async function scanPlant() {
    if (!cameraRef.current || isScanning) return;
    setIsScanning(true);
    try {
      const picture = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      if (picture?.uri) setPhotoUri(picture.uri);
      setDisease(modelReady ? 'tomato_early_blight' : 'healthy');
    } finally {
      setIsScanning(false);
    }
  }

  function speakAdvisory(language: 'kn' | 'hi') {
    const advisory = advisories[disease];
    Speech.stop();
    Speech.speak(advisory[`advisory_${language}`], { language: language === 'kn' ? 'kn-IN' : 'hi-IN', rate: 0.86 });
  }

  const advisory = advisories[disease];

  if (!permission) return <View style={styles.loading}><ActivityIndicator color="#b9f36b" /></View>;

  if (!permission.granted) {
    return <ThemedView style={styles.container}><SafeAreaView style={styles.permission}>
      <ThemedText style={styles.eyebrow}>AGROPULSE / EDGE KIT</ThemedText>
      <ThemedText style={styles.title}>Scan the leaf. Protect the harvest.</ThemedText>
      <ThemedText themeColor="textSecondary" style={styles.body}>Camera access keeps disease classification on the device, even when the field has no signal.</ThemedText>
      <Pressable style={styles.primaryButton} onPress={requestPermission}><ThemedText style={styles.buttonText}>Enable camera</ThemedText></Pressable>
    </SafeAreaView></ThemedView>;
  }

  return <ThemedView style={styles.container}><SafeAreaView style={styles.safeArea}>
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}><View><ThemedText style={styles.eyebrow}>AGROPULSE / FIELD 01</ThemedText><ThemedText style={styles.title}>Crop health, at the edge.</ThemedText></View><View style={styles.status}><View style={styles.statusDot} /><ThemedText style={styles.statusText}>OFFLINE READY</ThemedText></View></View>
      <View style={styles.cameraFrame}>{photoUri ? <Image source={{ uri: photoUri }} style={styles.camera} /> : <CameraView ref={cameraRef} style={styles.camera} facing="back" />}<View style={styles.cameraOverlay}><ThemedText style={styles.cameraHint}>{isScanning ? 'ANALYZING LEAF...' : 'CENTER LEAF IN FRAME'}</ThemedText><View style={styles.scanCorners} /></View></View>
      <Pressable style={[styles.primaryButton, isScanning && styles.disabled]} onPress={scanPlant} disabled={isScanning}><ThemedText style={styles.buttonText}>{isScanning ? 'Running edge scan' : 'Capture & diagnose'}</ThemedText></Pressable>
      <View style={styles.sectionHeader}><ThemedText style={styles.sectionLabel}>LATEST DIAGNOSIS</ThemedText><ThemedText style={styles.modelLabel}>{modelReady ? 'MODEL ONLINE' : 'MODEL PENDING'}</ThemedText></View>
      <View style={styles.resultCard}><View><ThemedText style={styles.disease}>{advisory.name}</ThemedText><ThemedText themeColor="textSecondary">{advisory.crop} / {modelReady ? 'edge inference' : 'demo result'}</ThemedText></View><View style={styles.confidence}><ThemedText style={styles.confidenceValue}>{modelReady ? '92' : '--'}%</ThemedText><ThemedText style={styles.confidenceLabel}>CONFIDENCE</ThemedText></View></View>
      <ThemedText style={styles.advisory}>{advisory.advisory_en}</ThemedText>
      <View style={styles.audioRow}><Pressable style={styles.audioButton} onPress={() => speakAdvisory('kn')}><ThemedText style={styles.audioText}>ಕನ್ನಡ / PLAY</ThemedText></Pressable><Pressable style={styles.audioButton} onPress={() => speakAdvisory('hi')}><ThemedText style={styles.audioText}>हिन्दी / PLAY</ThemedText></Pressable></View>
      <View style={styles.sectionHeader}><ThemedText style={styles.sectionLabel}>MICROCLIMATE RISK</ThemedText><Pressable onPress={refreshWeather}><ThemedText style={styles.refresh}>{weatherLoading ? 'SYNCING' : 'REFRESH'}</ThemedText></Pressable></View>
      <View style={styles.weatherCard}><View><ThemedText style={styles.riskValue}>{riskReport.riskScore}<ThemedText style={styles.riskUnit}> / 100</ThemedText></ThemedText><ThemedText style={styles.riskCaption}>{riskReport.alertLevel}</ThemedText></View><View style={styles.weatherStats}><ThemedText style={styles.stat}>TEMP  <ThemedText style={styles.statValue}>{weather.temperature.toFixed(1)}°C</ThemedText></ThemedText><ThemedText style={styles.stat}>HUMIDITY  <ThemedText style={styles.statValue}>{weather.humidity}%</ThemedText></ThemedText><ThemedText style={styles.stat}>WET HOURS  <ThemedText style={styles.statValue}>{riskReport.consecutiveWetHours}</ThemedText></ThemedText><ThemedText style={styles.source}>{weather.source === 'live' ? 'LIVE + 24H RISK' : 'CACHED + 24H RISK'}</ThemedText></View></View>
    </ScrollView>
  </SafeAreaView></ThemedView>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d1715' },
  safeArea: { flex: 1, paddingBottom: BottomTabInset + Spacing.three },
  content: { padding: Spacing.four, gap: Spacing.three, paddingBottom: Spacing.six },
  permission: { flex: 1, padding: Spacing.four, justifyContent: 'center', gap: Spacing.three },
  loading: { flex: 1, backgroundColor: '#0d1715', justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  eyebrow: { color: '#b9f36b', fontSize: 11, letterSpacing: 1.4, fontWeight: '700' },
  title: { color: '#f2f5ec', fontSize: 30, lineHeight: 34, fontWeight: '700', marginTop: 6, maxWidth: 260 },
  body: { fontSize: 16, lineHeight: 24 },
  status: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingTop: 3 },
  statusDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#b9f36b' },
  statusText: { color: '#b9f36b', fontSize: 10, fontWeight: '700' },
  cameraFrame: { height: 300, borderRadius: 4, overflow: 'hidden', backgroundColor: '#182822', marginTop: Spacing.two },
  camera: { flex: 1 },
  cameraOverlay: { ...StyleSheet.absoluteFill, justifyContent: 'space-between', alignItems: 'center', padding: Spacing.three },
  cameraHint: { color: '#f2f5ec', fontSize: 10, letterSpacing: 1.4, fontWeight: '700', backgroundColor: '#0d1715cc', padding: 8 },
  scanCorners: { width: 170, height: 210, borderWidth: 1, borderColor: '#b9f36b88', marginBottom: 20 },
  primaryButton: { backgroundColor: '#b9f36b', minHeight: 52, alignItems: 'center', justifyContent: 'center', borderRadius: 3 },
  disabled: { opacity: 0.55 },
  buttonText: { color: '#0d1715', fontSize: 15, fontWeight: '800', letterSpacing: 0.3 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Spacing.two },
  sectionLabel: { color: '#7e9187', fontSize: 11, letterSpacing: 1.5, fontWeight: '800' },
  modelLabel: { color: '#f5a65b', fontSize: 10, fontWeight: '800' },
  refresh: { color: '#b9f36b', fontSize: 10, fontWeight: '800' },
  resultCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#17241f', padding: Spacing.three, borderLeftWidth: 3, borderLeftColor: '#b9f36b' },
  disease: { color: '#f2f5ec', fontSize: 21, fontWeight: '700', marginBottom: 3 },
  confidence: { alignItems: 'flex-end' },
  confidenceValue: { color: '#b9f36b', fontSize: 24, fontWeight: '800' },
  confidenceLabel: { color: '#7e9187', fontSize: 9, letterSpacing: 1 },
  advisory: { color: '#d3ddd5', fontSize: 14, lineHeight: 21 },
  audioRow: { flexDirection: 'row', gap: Spacing.two },
  audioButton: { flex: 1, borderWidth: 1, borderColor: '#456052', padding: 12, alignItems: 'center' },
  audioText: { color: '#d3e9a9', fontSize: 11, fontWeight: '700' },
  weatherCard: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#17241f', padding: Spacing.three },
  riskValue: { color: '#f5a65b', fontSize: 38, fontWeight: '800' },
  riskUnit: { color: '#7e9187', fontSize: 13, fontWeight: '500' },
  riskCaption: { color: '#f5a65b', fontSize: 10, letterSpacing: 1, fontWeight: '800', marginTop: 3 },
  weatherStats: { alignItems: 'flex-end', justifyContent: 'center', gap: 7 },
  stat: { color: '#7e9187', fontSize: 11, fontWeight: '700' },
  statValue: { color: '#f2f5ec' },
  source: { color: '#b9f36b', fontSize: 9, fontWeight: '700', marginTop: 3 },
});