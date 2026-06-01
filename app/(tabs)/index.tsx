import React, { useState } from 'react';
import {
  View, Text, ScrollView, Pressable, Image, FlatList, StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { PlaylistCard } from '@/components/playlist-card';
import { MiniPlayer } from '@/components/mini-player';
import { usePlayer } from '@/lib/player-context';
import { MOCK_PLAYLISTS, MOCK_CEO_STRATEGY, formatNumber } from '@/lib/mock-data';
import { Mood } from '@/shared/types';

const MOODS: { id: Mood; label: string; emoji: string; color: string }[] = [
  { id: 'focus', label: 'Focus', emoji: '🎯', color: '#4A90E2' },
  { id: 'chill', label: 'Chill', emoji: '🌊', color: '#50C878' },
  { id: 'energy', label: 'Energy', emoji: '⚡', color: '#FF6B35' },
  { id: 'sad', label: 'Sad', emoji: '🌧️', color: '#9B59B6' },
  { id: 'party', label: 'Party', emoji: '🎉', color: '#F39C12' },
  { id: 'sleep', label: 'Sleep', emoji: '🌙', color: '#2C3E50' },
  { id: 'romantic', label: 'Romantic', emoji: '💕', color: '#E91E63' },
  { id: 'workout', label: 'Workout', emoji: '💪', color: '#F44336' },
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen() {
  const { currentTrack, playTrack, openPlayer } = usePlayer();
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);

  const featuredPlaylist = MOCK_PLAYLISTS[0];
  const recentPlaylists = MOCK_PLAYLISTS.slice(0, 4);
  const trendingPlaylists = MOCK_PLAYLISTS.slice(2, 6);

  const handlePlaylistPress = (playlistId: string) => {
    router.push(`/playlist/${playlistId}` as any);
  };

  const handleMoodPress = (mood: Mood) => {
    setSelectedMood(mood);
    router.push({ pathname: '/(tabs)/discover', params: { mood } });
  };

  return (
    <View style={styles.outerContainer}>
      <ScreenContainer containerClassName="bg-[#121212]" edges={['top', 'left', 'right']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.brandName}>BELENTANI</Text>
            </View>
            <View style={styles.headerActions}>
              <Pressable style={({ pressed }) => [styles.headerBtn, pressed && { opacity: 0.6 }]}>
                <IconSymbol name="bell" size={24} color="#FFFFFF" />
              </Pressable>
              <Pressable
                onPress={() => router.push('/settings')}
                style={({ pressed }) => [styles.headerBtn, pressed && { opacity: 0.6 }]}
              >
                <IconSymbol name="gear" size={24} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>

          {/* CEO Strategy Card */}
          <Pressable
            onPress={() => router.push('/ceo-dashboard' as any)}
            style={({ pressed }) => [styles.ceoCard, pressed && { opacity: 0.9 }]}
          >
            <View style={styles.ceoCardHeader}>
              <View style={styles.ceoCardBadge}>
                <IconSymbol name="sparkles" size={12} color="#121212" />
                <Text style={styles.ceoCardBadgeText}>AI STRATEGY</Text>
              </View>
              <Text style={styles.ceoCardTime}>Today</Text>
            </View>
            <Text style={styles.ceoCardTitle}>Executive Council Report</Text>
            <Text style={styles.ceoCardSummary} numberOfLines={2}>
              {MOCK_CEO_STRATEGY.summary}
            </Text>
            <View style={styles.ceoMetrics}>
              <View style={styles.ceoMetric}>
                <Text style={styles.ceoMetricValue}>{formatNumber(MOCK_CEO_STRATEGY.metrics.users)}</Text>
                <Text style={styles.ceoMetricLabel}>Users</Text>
              </View>
              <View style={styles.ceoMetricDivider} />
              <View style={styles.ceoMetric}>
                <Text style={styles.ceoMetricValue}>${formatNumber(MOCK_CEO_STRATEGY.metrics.revenue)}</Text>
                <Text style={styles.ceoMetricLabel}>Revenue</Text>
              </View>
              <View style={styles.ceoMetricDivider} />
              <View style={styles.ceoMetric}>
                <Text style={styles.ceoMetricValue}>{MOCK_CEO_STRATEGY.metrics.churn}%</Text>
                <Text style={styles.ceoMetricLabel}>Churn</Text>
              </View>
            </View>
          </Pressable>

          {/* Quick Moods */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How are you feeling?</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.moodsScroll}
            >
              {MOODS.map(mood => (
                <Pressable
                  key={mood.id}
                  onPress={() => handleMoodPress(mood.id)}
                  style={({ pressed }) => [
                    styles.moodChip,
                    { borderColor: mood.color },
                    selectedMood === mood.id && { backgroundColor: mood.color },
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                  <Text style={[
                    styles.moodLabel,
                    selectedMood === mood.id && { color: '#121212' },
                  ]}>
                    {mood.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Recent Playlists */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Playlists</Text>
              <Pressable       onPress={() => router.push('/(tabs)/library' as any)}>
                <Text style={styles.seeAll}>See all</Text>
              </Pressable>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.playlistsScroll}
            >
              {recentPlaylists.map(playlist => (
                <PlaylistCard
                  key={playlist.id}
                  playlist={playlist}
                  onPress={() => handlePlaylistPress(playlist.id)}
                  size="medium"
                />
              ))}
            </ScrollView>
          </View>

          {/* Trending Now */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Trending Now</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <IconSymbol name="chart.line.uptrend.xyaxis" size={12} color="#1DB954" />
                <Text style={{ color: '#1DB954', fontSize: 11, fontWeight: '700' }}>LIVE</Text>
              </View>
            </View>
            {trendingPlaylists.map((playlist, index) => (
              <Pressable
                key={playlist.id}
                onPress={() => handlePlaylistPress(playlist.id)}
                style={({ pressed }) => [styles.trendingRow, pressed && { opacity: 0.7 }]}
              >
                <Text style={styles.trendingIndex}>{index + 1}</Text>
                <Image source={{ uri: playlist.coverUrl }} style={styles.trendingCover} />
                <View style={styles.trendingInfo}>
                  <Text style={styles.trendingTitle} numberOfLines={1}>{playlist.title}</Text>
                  <Text style={styles.trendingMeta}>
                    {playlist.tracks.length} tracks · {formatNumber(playlist.playCount)} plays
                  </Text>
                </View>
                {playlist.isAIGenerated && (
                  <View style={styles.aiBadge}>
                    <Text style={styles.aiBadgeText}>AI</Text>
                  </View>
                )}
                <IconSymbol name="chevron.right" size={16} color="#B3B3B3" />
              </Pressable>
            ))}
          </View>

          {/* Bottom padding for mini player */}
          <View style={{ height: currentTrack ? 80 : 16 }} />
        </ScrollView>
      </ScreenContainer>

      {/* Mini Player */}
      {currentTrack && (
        <View style={styles.miniPlayerContainer}>
          <MiniPlayer onPress={openPlayer} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContent: {
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  greeting: {
    color: '#B3B3B3',
    fontSize: 13,
    fontWeight: '500',
  },
  brandName: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ceoCard: {
    marginHorizontal: 20,
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1DB954',
    marginBottom: 8,
  },
  ceoCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ceoCardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1DB954',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ceoCardBadgeText: {
    color: '#121212',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  ceoCardTime: {
    color: '#B3B3B3',
    fontSize: 12,
  },
  ceoCardTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  ceoCardSummary: {
    color: '#B3B3B3',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
  },
  ceoMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ceoMetric: {
    flex: 1,
    alignItems: 'center',
  },
  ceoMetricValue: {
    color: '#1DB954',
    fontSize: 16,
    fontWeight: '700',
  },
  ceoMetricLabel: {
    color: '#B3B3B3',
    fontSize: 11,
    marginTop: 2,
  },
  ceoMetricDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#333333',
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  seeAll: {
    color: '#1DB954',
    fontSize: 13,
    fontWeight: '600',
  },
  moodsScroll: {
    paddingHorizontal: 20,
    gap: 10,
  },
  moodChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1.5,
    backgroundColor: 'transparent',
  },
  moodEmoji: {
    fontSize: 16,
  },
  moodLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  playlistsScroll: {
    paddingHorizontal: 20,
    gap: 16,
  },
  trendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 12,
  },
  trendingIndex: {
    color: '#B3B3B3',
    fontSize: 14,
    fontWeight: '600',
    width: 20,
    textAlign: 'center',
  },
  trendingCover: {
    width: 52,
    height: 52,
    borderRadius: 8,
    backgroundColor: '#2A2A2A',
  },
  trendingInfo: {
    flex: 1,
  },
  trendingTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  trendingMeta: {
    color: '#B3B3B3',
    fontSize: 12,
    marginTop: 3,
  },
  aiBadge: {
    backgroundColor: '#1DB954',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  aiBadgeText: {
    color: '#121212',
    fontSize: 10,
    fontWeight: '700',
  },
  miniPlayerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
