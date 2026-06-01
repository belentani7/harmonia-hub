import React, { useState } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, TextInput, ActivityIndicator, Image,
} from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { GlassCard } from '@/components/glass-card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { MiniPlayer } from '@/components/mini-player';
import { usePlayer } from '@/lib/player-context';
import { GLASS_COLORS } from '@/lib/glass-morphism';
import { useRouter } from 'expo-router';
import { trpc } from '@/lib/trpc';

const PLATFORMS = [
  { id: 'spotify', label: 'Spotify', icon: '🎵' },
  { id: 'itunes', label: 'iTunes', icon: '🎶' },
  { id: 'apple', label: 'Apple Music', icon: '🍎' },
  { id: 'deezer', label: 'Deezer', icon: '🎧' },
  { id: 'tidal', label: 'Tidal', icon: '🌊' },
  { id: 'amazon', label: 'Amazon Music', icon: '🔊' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { currentTrack, openPlayer } = usePlayer();
  const [aiInput, setAiInput] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [playlistCount, setPlaylistCount] = useState(3);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateMutation = trpc.playlist.generate.useMutation({
    onSuccess: () => {
      setIsGenerating(false);
      router.push('/discover');
    },
    onError: () => {
      setIsGenerating(false);
    },
  });

  const handleGenerate = async () => {
    if (!aiInput.trim()) return;
    setIsGenerating(true);

    try {
      // Parse AI input to extract mood/context
      const input = aiInput.toLowerCase();
      let mood: any = 'chill';
      
      if (input.includes('focus') || input.includes('work')) mood = 'focus';
      else if (input.includes('energy') || input.includes('gym')) mood = 'energy';
      else if (input.includes('sad') || input.includes('melancholy')) mood = 'sad';
      else if (input.includes('party')) mood = 'party';
      else if (input.includes('sleep') || input.includes('rest')) mood = 'sleep';
      else if (input.includes('romantic') || input.includes('love')) mood = 'romantic';
      else if (input.includes('workout')) mood = 'workout';

      await generateMutation.mutateAsync({
        mood,
        trackCount: playlistCount,
      });
    } catch (error) {
      console.error('Generation error:', error);
      setIsGenerating(false);
    }
  };

  return (
    <View style={styles.outerContainer}>
      <ScreenContainer containerClassName="bg-[#0A0A0E]" edges={['top', 'left', 'right']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* AI Input - Top Priority */}
          <View style={styles.aiInputSection}>
            <GlassCard variant="floating" style={styles.inputCard}>
              <View style={styles.inputWrapper}>
                <IconSymbol name="sparkles" size={20} color={GLASS_COLORS.purpleSoft} />
                <TextInput
                  style={styles.input}
                  placeholder="Describe your vibe..."
                  placeholderTextColor={GLASS_COLORS.textMuted}
                  value={aiInput}
                  onChangeText={setAiInput}
                  editable={!isGenerating}
                />
                {isGenerating ? (
                  <ActivityIndicator size="small" color={GLASS_COLORS.purpleSoft} />
                ) : (
                  <Pressable
                    onPress={handleGenerate}
                    disabled={!aiInput.trim()}
                    style={({ pressed }) => [
                      styles.sendBtn,
                      !aiInput.trim() && { opacity: 0.4 },
                      pressed && { transform: [{ scale: 0.95 }] },
                    ]}
                  >
                    <IconSymbol name="arrow.up" size={16} color={GLASS_COLORS.black} />
                  </Pressable>
                )}
              </View>
            </GlassCard>
          </View>

          {/* Platforms - Discrete Tab */}
          <View style={styles.platformsSection}>
            <Text style={styles.sectionLabel}>Available on</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.platformsScroll}>
              {PLATFORMS.map(platform => (
                <Pressable
                  key={platform.id}
                  onPress={() => setSelectedPlatform(selectedPlatform === platform.id ? null : platform.id)}
                  style={({ pressed }) => [
                    styles.platformBtn,
                    selectedPlatform === platform.id && styles.platformBtnActive,
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <Text style={styles.platformIcon}>{platform.icon}</Text>
                  <Text style={[styles.platformLabel, selectedPlatform === platform.id && { color: GLASS_COLORS.purpleSoft }]}>
                    {platform.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Playlist Count - Expandible */}
          <View style={styles.countSection}>
            <View style={styles.countHeader}>
              <Text style={styles.countLabel}>Playlists per generation</Text>
              <Text style={styles.countValue}>{playlistCount}</Text>
            </View>
            <View style={styles.countControls}>
              <Pressable
                onPress={() => setPlaylistCount(Math.max(1, playlistCount - 1))}
                style={({ pressed }) => [styles.countBtn, pressed && { opacity: 0.7 }]}
              >
                <IconSymbol name="minus" size={16} color={GLASS_COLORS.textPrimary} />
              </Pressable>
              <View style={styles.countSlider}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.countDot,
                      i < playlistCount && { backgroundColor: GLASS_COLORS.purpleSoft },
                    ]}
                  />
                ))}
              </View>
              <Pressable
                onPress={() => setPlaylistCount(Math.min(5, playlistCount + 1))}
                style={({ pressed }) => [styles.countBtn, pressed && { opacity: 0.7 }]}
              >
                <IconSymbol name="plus" size={16} color={GLASS_COLORS.textPrimary} />
              </Pressable>
            </View>
          </View>

          {/* Current Track Preview */}
          {currentTrack && (
            <Pressable
              onPress={openPlayer}
              style={({ pressed }) => [styles.trackPreview, pressed && { opacity: 0.8 }]}
            >
              <GlassCard variant="accent" style={styles.trackCard}>
                <View style={styles.trackContent}>
                  <Image
                    source={{ uri: currentTrack.coverUrl }}
                    style={styles.trackCover}
                  />
                  <View style={styles.trackInfo}>
                    <Text style={styles.trackTitle} numberOfLines={1}>{currentTrack.title}</Text>
                    <Text style={styles.trackArtist} numberOfLines={1}>{currentTrack.artist}</Text>
                  </View>
                  <IconSymbol name="play.fill" size={20} color={GLASS_COLORS.purpleSoft} />
                </View>
              </GlassCard>
            </Pressable>
          )}

          {/* Spacer */}
          <View style={{ height: 40 }} />
        </ScrollView>
      </ScreenContainer>

      {/* Mini Player */}
      <MiniPlayer onPress={openPlayer} />
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: { flex: 1, backgroundColor: GLASS_COLORS.black },
  scrollContent: { paddingBottom: 20 },

  // AI Input Section
  aiInputSection: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 },
  inputCard: { paddingVertical: 12, paddingHorizontal: 16 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  input: {
    flex: 1,
    color: GLASS_COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '500',
  },
  sendBtn: {
    backgroundColor: GLASS_COLORS.purpleSoft,
    borderRadius: 12,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Platforms Section
  platformsSection: { marginTop: 8, paddingHorizontal: 16 },
  sectionLabel: { color: GLASS_COLORS.textMuted, fontSize: 12, fontWeight: '600', marginBottom: 8 },
  platformsScroll: { gap: 8, paddingRight: 16 },
  platformBtn: {
    backgroundColor: GLASS_COLORS.glassDark,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: GLASS_COLORS.borderGlass,
  },
  platformBtnActive: {
    borderColor: GLASS_COLORS.purpleSoft,
    backgroundColor: GLASS_COLORS.glassAccent,
  },
  platformIcon: { fontSize: 14 },
  platformLabel: { color: GLASS_COLORS.textMuted, fontSize: 11, fontWeight: '600' },

  // Playlist Count Section
  countSection: { marginTop: 24, paddingHorizontal: 16 },
  countHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  countLabel: { color: GLASS_COLORS.textMuted, fontSize: 12, fontWeight: '600' },
  countValue: { color: GLASS_COLORS.purpleSoft, fontSize: 12, fontWeight: '700' },
  countControls: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  countBtn: {
    backgroundColor: GLASS_COLORS.glassDark,
    borderRadius: 8,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: GLASS_COLORS.borderGlass,
  },
  countSlider: { flex: 1, flexDirection: 'row', gap: 4 },
  countDot: {
    flex: 1,
    height: 4,
    backgroundColor: GLASS_COLORS.borderGlass,
    borderRadius: 2,
  },

  // Track Preview
  trackPreview: { marginTop: 24, paddingHorizontal: 16 },
  trackCard: { padding: 12 },
  trackContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  trackCover: { width: 48, height: 48, borderRadius: 8 },
  trackInfo: { flex: 1 },
  trackTitle: { color: GLASS_COLORS.textPrimary, fontSize: 13, fontWeight: '600' },
  trackArtist: { color: GLASS_COLORS.textMuted, fontSize: 11, marginTop: 2 },
});
