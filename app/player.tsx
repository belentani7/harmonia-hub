import React, { useState } from 'react';
import {
  View, Text, Pressable, Image, StyleSheet, ScrollView, Dimensions,
} from 'react-native';
import { usePlayer } from '@/lib/player-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { formatDuration } from '@/lib/mock-data';
import { ScreenContainer } from '@/components/screen-container';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ALBUM_SIZE = SCREEN_WIDTH - 64;

export default function PlayerScreen() {
  const {
    currentTrack, isPlaying, progress, currentTime,
    pauseTrack, resumeTrack, nextTrack, prevTrack,
    isShuffle, repeatMode, toggleShuffle, toggleRepeat,
    seekTo, toggleLike, likedTrackIds, closePlayer,
  } = usePlayer();

  const [activeTab, setActiveTab] = useState<'info' | 'lyrics' | 'insight'>('info');

  if (!currentTrack) return null;

  const isLiked = likedTrackIds.has(currentTrack.id);
  const totalTime = currentTrack.duration;
  const elapsed = Math.floor(progress * totalTime);

  return (
    <ScreenContainer containerClassName="bg-[#121212]" edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={closePlayer} style={({ pressed }) => [styles.headerBtn, pressed && { opacity: 0.6 }]}>
            <IconSymbol name="chevron.down" size={28} color="#FFFFFF" />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.headerLabel}>NOW PLAYING</Text>
          </View>
          <Pressable style={({ pressed }) => [styles.headerBtn, pressed && { opacity: 0.6 }]}>
            <IconSymbol name="ellipsis" size={24} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Album Art */}
        <View style={styles.albumContainer}>
          <Image
            source={{ uri: currentTrack.coverUrl }}
            style={[styles.albumArt, { width: ALBUM_SIZE, height: ALBUM_SIZE }]}
          />
          <View style={styles.albumGlow} />
        </View>

        {/* Track Info */}
        <View style={styles.trackInfo}>
          <View style={styles.trackInfoLeft}>
            <Text style={styles.trackTitle}>{currentTrack.title}</Text>
            <Text style={styles.trackArtist}>{currentTrack.artist}</Text>
          </View>
          <Pressable
            onPress={() => toggleLike(currentTrack.id)}
            style={({ pressed }) => [styles.likeBtn, pressed && { opacity: 0.6 }]}
          >
            <IconSymbol
              name={isLiked ? 'heart.fill' : 'heart'}
              size={26}
              color={isLiked ? '#1DB954' : '#B3B3B3'}
            />
          </Pressable>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Pressable
            style={styles.progressBarHitArea}
            onPress={(e) => {
              const x = e.nativeEvent.locationX;
              const barWidth = SCREEN_WIDTH - 48;
              seekTo(Math.max(0, Math.min(1, x / barWidth)));
            }}
          >
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progress * 100}%` }]}>
                <View style={styles.progressThumb} />
              </View>
            </View>
          </Pressable>
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>{formatDuration(elapsed)}</Text>
            <Text style={styles.timeText}>{formatDuration(totalTime)}</Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <Pressable
            onPress={toggleShuffle}
            style={({ pressed }) => [styles.controlBtn, pressed && { opacity: 0.6 }]}
          >
            <IconSymbol name="shuffle" size={22} color={isShuffle ? '#1DB954' : '#B3B3B3'} />
          </Pressable>

          <Pressable
            onPress={prevTrack}
            style={({ pressed }) => [styles.controlBtn, pressed && { opacity: 0.6 }]}
          >
            <IconSymbol name="backward.fill" size={32} color="#FFFFFF" />
          </Pressable>

          <Pressable
            onPress={() => isPlaying ? pauseTrack() : resumeTrack()}
            style={({ pressed }) => [styles.playButton, pressed && { transform: [{ scale: 0.95 }] }]}
          >
            <IconSymbol
              name={isPlaying ? 'pause.fill' : 'play.fill'}
              size={36}
              color="#121212"
            />
          </Pressable>

          <Pressable
            onPress={nextTrack}
            style={({ pressed }) => [styles.controlBtn, pressed && { opacity: 0.6 }]}
          >
            <IconSymbol name="forward.fill" size={32} color="#FFFFFF" />
          </Pressable>

          <Pressable
            onPress={toggleRepeat}
            style={({ pressed }) => [styles.controlBtn, pressed && { opacity: 0.6 }]}
          >
            <IconSymbol
              name={repeatMode === 'one' ? 'repeat.1' : 'repeat'}
              size={22}
              color={repeatMode !== 'none' ? '#1DB954' : '#B3B3B3'}
            />
          </Pressable>
        </View>

        {/* Action Row */}
        <View style={styles.actionRow}>
          <Pressable style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.6 }]}>
            <IconSymbol name="plus.circle.fill" size={22} color="#B3B3B3" />
          </Pressable>
          <Pressable style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.6 }]}>
            <IconSymbol name="square.and.arrow.up" size={22} color="#B3B3B3" />
          </Pressable>
          <Pressable style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.6 }]}>
            <IconSymbol name="list.bullet" size={22} color="#B3B3B3" />
          </Pressable>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {(['info', 'lyrics', 'insight'] as const).map(tab => (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab === 'info' ? 'Info' : tab === 'lyrics' ? 'Lyrics' : 'AI Insight'}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'info' && (
            <View style={styles.infoGrid}>
              {currentTrack.bpm && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>BPM</Text>
                  <Text style={styles.infoValue}>{currentTrack.bpm}</Text>
                </View>
              )}
              {currentTrack.mood && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Mood</Text>
                  <Text style={styles.infoValue}>{currentTrack.mood.toUpperCase()}</Text>
                </View>
              )}
              {currentTrack.genre && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Genre</Text>
                  <Text style={styles.infoValue}>{currentTrack.genre.toUpperCase()}</Text>
                </View>
              )}
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Album</Text>
                <Text style={styles.infoValue}>{currentTrack.album}</Text>
              </View>
            </View>
          )}
          {activeTab === 'lyrics' && (
            <View style={styles.premiumGate}>
              <IconSymbol name="crown.fill" size={32} color="#FFD700" />
              <Text style={styles.premiumTitle}>Premium Feature</Text>
              <Text style={styles.premiumDesc}>Upgrade to Premium to see real-time lyrics for every track.</Text>
              <Pressable style={styles.upgradeBtn}>
                <Text style={styles.upgradeBtnText}>Upgrade to Premium</Text>
              </Pressable>
            </View>
          )}
          {activeTab === 'insight' && currentTrack.aiInsight && (
            <View style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <IconSymbol name="sparkles" size={18} color="#1DB954" />
                <Text style={styles.insightTitle}>Why this track?</Text>
              </View>
              <Text style={styles.insightText}>{currentTrack.aiInsight}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerLabel: {
    color: '#B3B3B3',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
  },
  albumContainer: {
    alignItems: 'center',
    paddingHorizontal: 32,
    marginTop: 16,
    position: 'relative',
  },
  albumArt: {
    borderRadius: 16,
    backgroundColor: '#2A2A2A',
  },
  albumGlow: {
    position: 'absolute',
    bottom: -20,
    width: SCREEN_WIDTH - 80,
    height: 40,
    backgroundColor: '#1DB954',
    opacity: 0.15,
    borderRadius: 50,
    transform: [{ scaleX: 0.9 }],
  },
  trackInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 32,
  },
  trackInfoLeft: {
    flex: 1,
  },
  trackTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
  },
  trackArtist: {
    color: '#B3B3B3',
    fontSize: 15,
    marginTop: 4,
  },
  likeBtn: {
    padding: 8,
  },
  progressContainer: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  progressBarHitArea: {
    paddingVertical: 8,
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#333333',
    borderRadius: 2,
    overflow: 'visible',
  },
  progressFill: {
    height: 4,
    backgroundColor: '#1DB954',
    borderRadius: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  progressThumb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    marginRight: -6,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeText: {
    color: '#B3B3B3',
    fontSize: 12,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: 24,
  },
  controlBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#1DB954',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
    marginTop: 20,
    paddingHorizontal: 24,
  },
  actionBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginTop: 24,
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#2A2A2A',
  },
  tabText: {
    color: '#B3B3B3',
    fontSize: 13,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  tabContent: {
    marginHorizontal: 24,
    marginTop: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  infoItem: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 12,
    minWidth: '45%',
    flex: 1,
  },
  infoLabel: {
    color: '#B3B3B3',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 4,
  },
  infoValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  premiumGate: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 12,
  },
  premiumTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  premiumDesc: {
    color: '#B3B3B3',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  upgradeBtn: {
    backgroundColor: '#1DB954',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 8,
  },
  upgradeBtnText: {
    color: '#121212',
    fontSize: 14,
    fontWeight: '700',
  },
  insightCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#1DB954',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  insightTitle: {
    color: '#1DB954',
    fontSize: 14,
    fontWeight: '700',
  },
  insightText: {
    color: '#B3B3B3',
    fontSize: 14,
    lineHeight: 22,
  },
});
