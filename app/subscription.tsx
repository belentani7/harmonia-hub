import React, { useState } from 'react';
import {
  View, Text, Pressable, ScrollView, StyleSheet, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { IconSymbol } from '@/components/ui/icon-symbol';

type Plan = 'free' | 'premium' | 'creator';

const PLANS = [
  {
    id: 'free' as Plan,
    name: 'Free',
    price: '$0',
    period: 'forever',
    color: '#B3B3B3',
    features: [
      { text: 'AI Playlist Generation (3/day)', included: true },
      { text: 'Mood & Context Detection', included: true },
      { text: 'Basic Analytics', included: true },
      { text: 'Lyrics', included: false },
      { text: 'Offline Downloads', included: false },
      { text: 'Unlimited AI Playlists', included: false },
      { text: 'Artist Marketplace Access', included: false },
    ],
  },
  {
    id: 'premium' as Plan,
    name: 'Premium',
    price: '$4.99',
    period: 'per month',
    color: '#1DB954',
    badge: 'MOST POPULAR',
    features: [
      { text: 'Unlimited AI Playlist Generation', included: true },
      { text: 'Mood & Context Detection', included: true },
      { text: 'Full Analytics Dashboard', included: true },
      { text: 'Lyrics with Karaoke Mode', included: true },
      { text: 'Offline Downloads (1000 tracks)', included: true },
      { text: 'Priority AI Processing', included: true },
      { text: 'Artist Marketplace Access', included: false },
    ],
  },
  {
    id: 'creator' as Plan,
    name: 'Creator',
    price: '$14.99',
    period: 'per month',
    color: '#FFD700',
    badge: 'FOR ARTISTS',
    features: [
      { text: 'Everything in Premium', included: true },
      { text: 'Artist Marketplace Listing', included: true },
      { text: 'Revenue Share Program', included: true },
      { text: 'Advanced Analytics & Insights', included: true },
      { text: 'Custom AI Playlist Branding', included: true },
      { text: 'Direct Fan Messaging', included: true },
      { text: 'Priority Council Support', included: true },
    ],
  },
];

export default function SubscriptionScreen() {
  const [selectedPlan, setSelectedPlan] = useState<Plan>('premium');

  const handleSubscribe = () => {
    if (selectedPlan === 'free') {
      router.back();
      return;
    }
    Alert.alert(
      'Coming Soon',
      `${PLANS.find(p => p.id === selectedPlan)?.name} subscription will be available at launch. You'll be notified!`,
      [{ text: 'OK', onPress: () => router.back() }],
    );
  };

  return (
    <ScreenContainer containerClassName="bg-[#121212]" edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
          >
            <IconSymbol name="arrow.left" size={24} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.title}>Choose Your Plan</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <IconSymbol name="crown.fill" size={36} color="#FFD700" />
          <Text style={styles.heroTitle}>Unlock the Full BELENTANI Experience</Text>
          <Text style={styles.heroSubtitle}>
            Unlimited AI playlists, lyrics, downloads, and the full Executive Council at your service.
          </Text>
        </View>

        {/* Plans */}
        {PLANS.map(plan => (
          <Pressable
            key={plan.id}
            onPress={() => setSelectedPlan(plan.id)}
            style={({ pressed }) => [
              styles.planCard,
              { borderColor: plan.color },
              selectedPlan === plan.id && { backgroundColor: plan.color + '15' },
              pressed && { opacity: 0.9 },
            ]}
          >
            {plan.badge && (
              <View style={[styles.planBadge, { backgroundColor: plan.color }]}>
                <Text style={styles.planBadgeText}>{plan.badge}</Text>
              </View>
            )}

            <View style={styles.planHeader}>
              <View style={styles.planRadio}>
                <View style={[
                  styles.planRadioInner,
                  selectedPlan === plan.id && { backgroundColor: plan.color },
                ]} />
              </View>
              <View style={styles.planInfo}>
                <Text style={[styles.planName, { color: plan.color }]}>{plan.name}</Text>
                <View style={styles.planPriceRow}>
                  <Text style={styles.planPrice}>{plan.price}</Text>
                  <Text style={styles.planPeriod}> / {plan.period}</Text>
                </View>
              </View>
            </View>

            <View style={styles.planFeatures}>
              {plan.features.map((feature, i) => (
                <View key={i} style={styles.featureRow}>
                  <IconSymbol
                    name={feature.included ? 'checkmark.circle.fill' : 'xmark.circle'}
                    size={16}
                    color={feature.included ? plan.color : '#444444'}
                  />
                  <Text style={[
                    styles.featureText,
                    !feature.included && styles.featureTextDisabled,
                  ]}>
                    {feature.text}
                  </Text>
                </View>
              ))}
            </View>
          </Pressable>
        ))}

        {/* CTA */}
        <View style={styles.ctaContainer}>
          <Pressable
            onPress={handleSubscribe}
            style={({ pressed }) => [
              styles.ctaBtn,
              { backgroundColor: PLANS.find(p => p.id === selectedPlan)?.color || '#1DB954' },
              pressed && { transform: [{ scale: 0.97 }] },
            ]}
          >
            <Text style={styles.ctaBtnText}>
              {selectedPlan === 'free'
                ? 'Continue with Free'
                : `Subscribe to ${PLANS.find(p => p.id === selectedPlan)?.name}`}
            </Text>
          </Pressable>
          <Text style={styles.ctaNote}>
            Cancel anytime · No hidden fees · Secure payment
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, color: '#FFFFFF', fontSize: 18, fontWeight: '700', textAlign: 'center' },
  hero: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 10,
  },
  heroTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '800', textAlign: 'center', lineHeight: 30 },
  heroSubtitle: { color: '#B3B3B3', fontSize: 14, textAlign: 'center', lineHeight: 22 },
  planCard: {
    marginHorizontal: 16,
    marginBottom: 14,
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    position: 'relative',
  },
  planBadge: {
    position: 'absolute',
    top: -10,
    right: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  planBadgeText: { color: '#121212', fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  planHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  planRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#B3B3B3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  planRadioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'transparent',
  },
  planInfo: { flex: 1 },
  planName: { fontSize: 16, fontWeight: '700' },
  planPriceRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 2 },
  planPrice: { color: '#FFFFFF', fontSize: 22, fontWeight: '800' },
  planPeriod: { color: '#B3B3B3', fontSize: 13 },
  planFeatures: { gap: 8 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  featureText: { color: '#FFFFFF', fontSize: 13, flex: 1 },
  featureTextDisabled: { color: '#444444' },
  ctaContainer: { paddingHorizontal: 16, marginTop: 8, gap: 12, alignItems: 'center' },
  ctaBtn: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  ctaBtnText: { color: '#121212', fontSize: 16, fontWeight: '700' },
  ctaNote: { color: '#666666', fontSize: 12 },
});
