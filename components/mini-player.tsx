import React from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import { usePlayer } from '@/lib/player-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { formatDuration } from '@/lib/mock-data';

export function MiniPlayer({ onPress }: { onPress: () => void }) {
  const { currentTrack, isPlaying, pauseTrack, resumeTrack, nextTrack, progress } = usePlayer();

  if (!currentTrack) return null;

  return (
    <Pressable onPress={onPress} style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <View style={styles.content}>
        {/* Album art */}
        <Image source={{ uri: currentTrack.coverUrl }} style={styles.cover} />

        {/* Track info */}
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>{currentTrack.title}</Text>
          <Text style={styles.artist} numberOfLines={1}>{currentTrack.artist}</Text>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <Pressable
            onPress={() => isPlaying ? pauseTrack() : resumeTrack()}
            style={({ pressed }) => [styles.playBtn, pressed && { opacity: 0.7 }]}
          >
            <IconSymbol
              name={isPlaying ? 'pause.fill' : 'play.fill'}
              size={28}
              color="#FFFFFF"
            />
          </Pressable>
          <Pressable
            onPress={nextTrack}
            style={({ pressed }) => [styles.nextBtn, pressed && { opacity: 0.7 }]}
          >
            <IconSymbol name="forward.fill" size={22} color="#B3B3B3" />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E1E1E',
    borderTopWidth: 0.5,
    borderTopColor: '#333333',
    borderRadius: 12,
    marginHorizontal: 8,
    marginBottom: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: 2,
    backgroundColor: '#333333',
  },
  progressFill: {
    height: 2,
    backgroundColor: '#1DB954',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 12,
  },
  cover: {
    width: 44,
    height: 44,
    borderRadius: 6,
    backgroundColor: '#2A2A2A',
  },
  info: {
    flex: 1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  artist: {
    color: '#B3B3B3',
    fontSize: 12,
    marginTop: 2,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  playBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
