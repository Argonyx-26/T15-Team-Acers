import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import advisories from '@/assets/data/advisories.json';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { MODEL_CLASS_LABELS, ModelClassLabel } from '@/services/model-mapping';

const SEVERITY_BY_CLASS: Record<string, 'high' | 'medium' | 'low' | 'healthy'> = {
  Background_without_leaves: 'low',
  Banana___Cordana: 'medium',
  Banana___Healthy: 'healthy',
  Banana___Pestalotiopsis: 'medium',
  Banana___Sigatoka: 'high',
  Coconut___Healthy: 'healthy',
  Coconut___Leaf_Spot: 'medium',
  Coconut___Pest_Damage: 'medium',
  Coconut___Yellowing: 'medium',
  Rice___Bacterial_leaf_blight: 'high',
  Rice___Brown_spot: 'medium',
  Rice___Leaf_smut: 'low',
  Sugarcane___Healthy: 'healthy',
  Sugarcane___Mosaic: 'medium',
  Sugarcane___RedRot: 'high',
  Sugarcane___Rust: 'medium',
  Sugarcane___Yellow: 'medium',
};

export default function ExploreScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };

  const [filter, setFilter] = useState<'All' | 'Rice' | 'Banana' | 'Sugarcane' | 'Coconut'>('All');
  const [selectedClass, setSelectedClass] = useState<ModelClassLabel | null>(null);

  const filteredClasses = MODEL_CLASS_LABELS.filter((cls) => {
    if (cls === 'Background_without_leaves') return filter === 'All';
    if (filter === 'All') return true;
    return cls.startsWith(filter);
  });

  return (
    <ScrollView
      style={styles.scrollView}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 20 }]}
      showsVerticalScrollIndicator={false}
    >
      <ThemedView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.eyebrow}>AGROPULSE / LAB 02</ThemedText>
          <ThemedText style={styles.title}>Model Diagnostic Matrix</ThemedText>
          <ThemedText style={styles.subtitle}>
            17-class deep learning pathology index calibrated for smallholder agro-ecosystems.
          </ThemedText>
        </View>

        {/* Model Spec Badge Strip */}
        <View style={styles.specStrip}>
          <View style={styles.specBox}>
            <ThemedText style={styles.specKey}>ARCHITECTURE</ThemedText>
            <ThemedText style={styles.specVal}>MobileNetV2</ThemedText>
          </View>
          <View style={styles.specBox}>
            <ThemedText style={styles.specKey}>SIZE</ThemedText>
            <ThemedText style={styles.specVal}>2.7 MB</ThemedText>
          </View>
          <View style={styles.specBox}>
            <ThemedText style={styles.specKey}>VAL ACCURACY</ThemedText>
            <ThemedText style={styles.specVal}>88.89%</ThemedText>
          </View>
          <View style={styles.specBox}>
            <ThemedText style={styles.specKey}>BUG-01 GUARD</ThemedText>
            <ThemedText style={[styles.specVal, { color: '#b9f36b' }]}>ACTIVE</ThemedText>
          </View>
        </View>

        {/* Responsible AI Disclaimer */}
        <View style={styles.safetyCard}>
          <ThemedText style={styles.safetyTitle}>TEAM SAFETY PROTOCOL</ThemedText>
          <ThemedText style={styles.safetyText}>
            Advisories prioritize eco-friendly and cultural controls before chemical intervention. Always verify label dosage and consult local agricultural officers.
          </ThemedText>
        </View>

        {/* Crop Filter Tabs */}
        <View style={styles.filterRow}>
          {(['All', 'Rice', 'Banana', 'Sugarcane', 'Coconut'] as const).map((crop) => (
            <Pressable
              key={crop}
              style={[styles.filterTab, filter === crop && styles.filterTabActive]}
              onPress={() => setFilter(crop)}
            >
              <ThemedText style={[styles.filterText, filter === crop && styles.filterTextActive]}>
                {crop}
              </ThemedText>
            </Pressable>
          ))}
        </View>

        {/* 17 Class Cards */}
        <View style={styles.classList}>
          {filteredClasses.map((cls) => {
            const isOod = cls === 'Background_without_leaves';
            const severity = SEVERITY_BY_CLASS[cls] || 'medium';
            const isExpanded = selectedClass === cls;

            return (
              <Pressable
                key={cls}
                style={[styles.classCard, isExpanded && styles.classCardExpanded]}
                onPress={() => setSelectedClass(isExpanded ? null : cls)}
              >
                <View style={styles.classCardHeader}>
                  <View style={styles.classCardLeft}>
                    <ThemedText style={styles.className}>
                      {isOod ? 'Non-Leaf Background (BUG-01 Guard)' : cls.replace(/___/g, ' · ')}
                    </ThemedText>
                    <ThemedText style={styles.classSub}>
                      {isOod ? 'Out-of-distribution rejection class' : 'Target botanical pathology'}
                    </ThemedText>
                  </View>
                  <View
                    style={[
                      styles.severityBadge,
                      severity === 'high' && styles.badgeHigh,
                      severity === 'medium' && styles.badgeMedium,
                      severity === 'healthy' && styles.badgeHealthy,
                      isOod && styles.badgeOod,
                    ]}
                  >
                    <ThemedText
                      style={[
                        styles.badgeText,
                        severity === 'high' && { color: '#ff7865' },
                        severity === 'medium' && { color: '#f5a65b' },
                        severity === 'healthy' && { color: '#b9f36b' },
                        isOod && { color: '#f5a65b' },
                      ]}
                    >
                      {isOod ? 'OOD GUARD' : severity.toUpperCase()}
                    </ThemedText>
                  </View>
                </View>

                {isExpanded && (
                  <View style={styles.expandedDetails}>
                    <ThemedText style={styles.detailsTitle}>Model Tensor Mapping:</ThemedText>
                    <ThemedText style={styles.detailsCode}>
                      Index: {MODEL_CLASS_LABELS.indexOf(cls)} · Input: [1, 224, 224, 3] Float32
                    </ThemedText>
                    <ThemedText style={styles.detailsDesc}>
                      {isOod
                        ? 'Trained on 126 desk, floor, and clutter crops from IMG_0169.JPG to reject non-leaf captures with >87% confidence.'
                        : 'Fine-tuned with two-stage MobileNetV2 feature unfreezing at lr=3e-5 and label smoothing.'}
                    </ThemedText>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: { flex: 1, backgroundColor: '#0d1715' },
  contentContainer: { paddingHorizontal: Spacing.four, paddingTop: Spacing.six, alignItems: 'center' },
  container: { width: '100%', maxWidth: MaxContentWidth, gap: Spacing.four },
  header: { gap: 6 },
  eyebrow: { color: '#b9f36b', fontSize: 11, letterSpacing: 1.4, fontWeight: '700' },
  title: { color: '#f2f5ec', fontSize: 28, fontWeight: '700' },
  subtitle: { color: '#9aada3', fontSize: 13, lineHeight: 19 },
  specStrip: { flexDirection: 'row', gap: 8, justifyContent: 'space-between' },
  specBox: { flex: 1, backgroundColor: '#13211b', borderWidth: 1, borderColor: '#1f3429', padding: 8, borderRadius: 6 },
  specKey: { color: '#738a7c', fontSize: 9, fontWeight: '800', letterSpacing: 0.8 },
  specVal: { color: '#f2f5ec', fontSize: 12, fontWeight: '700', marginTop: 3 },
  safetyCard: { backgroundColor: '#18241d', borderWidth: 1, borderColor: '#2b3f33', borderLeftWidth: 3, borderLeftColor: '#b9f36b', padding: 12, borderRadius: 4 },
  safetyTitle: { color: '#b9f36b', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  safetyText: { color: '#b3ccc0', fontSize: 12, lineHeight: 17, marginTop: 4 },
  filterRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  filterTab: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: '#13211b', borderWidth: 1, borderColor: '#20362b' },
  filterTabActive: { backgroundColor: '#203b2e', borderColor: '#b9f36b' },
  filterText: { color: '#8ca395', fontSize: 12, fontWeight: '600' },
  filterTextActive: { color: '#b9f36b', fontWeight: '800' },
  classList: { gap: 10 },
  classCard: { backgroundColor: '#14221c', borderWidth: 1, borderColor: '#1f3429', padding: 12, borderRadius: 6 },
  classCardExpanded: { borderColor: '#b9f36b' },
  classCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  classCardLeft: { flex: 1, paddingRight: 8 },
  className: { color: '#f2f5ec', fontSize: 14, fontWeight: '700' },
  classSub: { color: '#7e9688', fontSize: 11, marginTop: 2 },
  severityBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, borderWidth: 1 },
  badgeHigh: { backgroundColor: '#381714', borderColor: '#66241e' },
  badgeMedium: { backgroundColor: '#382514', borderColor: '#6b411d' },
  badgeHealthy: { backgroundColor: '#142b1d', borderColor: '#225235' },
  badgeOod: { backgroundColor: '#2b1b11', borderColor: '#693717' },
  badgeText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.8 },
  expandedDetails: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#1c2e24', gap: 4 },
  detailsTitle: { color: '#8ca395', fontSize: 11, fontWeight: '700' },
  detailsCode: { color: '#b9f36b', fontSize: 10, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  detailsDesc: { color: '#d2dfd6', fontSize: 11, lineHeight: 16, marginTop: 2 },
});
