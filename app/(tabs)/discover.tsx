import React, { useState } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator, FlatList, Image,
} from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { TrackRow } from '@/components/track-row';
import { MiniPlayer } from '@/components/mini-player';
import { usePlayer } from '@/lib/player-context';
import { MOCK_TRACKS, MOCK_PLAYLISTS } from '@/lib/mock-data';
import { Mood, Context, Genre, Playlist, Track } from '@/shared/types';
import { trpc } from '@/lib/trpc';

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

const CONTEXTS: { id: Context; label: string; emoji: string }[] = [
  { id: 'work', label: 'Work', emoji: '💼' },
  { id: 'gym', label: 'Gym', emoji: '🏋️' },
  { id: 'sleep', label: 'Sleep', emoji: '😴' },
  { id: 'drive', label: 'Drive', emoji: '🚗' },
  { id: 'study', label: 'Study', emoji: '📚' },
  { id: 'party', label: 'Party', emoji: '🎊' },
  { id: 'meditation', label: 'Meditate', emoji: '🧘' },
];

const GENRES: { id: Genre; label: string }[] = [
  { id: 'pop', label: 'Pop' },
  { id: 'rock', label: 'Rock' },
  { id: 'hiphop', label: 'Hip-Hop' },
  { id: 'electronic', label: 'Electronic' },
  { id: 'jazz', label: 'Jazz' },
  { id: 'classical', label: 'Classical' },
  { id: 'rnb', label: 'R&B' },
  { id: 'indie', label: 'Indie' },
  { id: 'latin', label: 'Latin' },
];

export default function DiscoverScreen() {
  const { currentTrack, playTrack, openPlayer } = usePlayer();
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [selectedContext, setSelectedContext] = useState<Context | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlaylist, setGeneratedPlaylist] = useState<Playlist | null>(null);

  const generateMutation = (trpc as any).playlist.generate.useMutation({
    onSuccess: (data: any) => {
      setGeneratedPlaylist(data);
      setIsGenerating(false);
    },
    onError: () => {
      // Fallback to mock data
      const mockPlaylist = MOCK_PLAYLISTS.find(p => p.mood === selectedMood) || MOCK_PLAYLISTS[0];
      setGeneratedPlaylist(mockPlaylist);
      setIsGenerating(false);
    },
  });

  const toggleGenre = (genre: Genre) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const handleGenerate = async () => {
    if (!selectedMood) return;
    setIsGenerating(true);
    setGeneratedPlaylist(null);

    try {
      await generateMutation.mutateAsync({
        mood: selectedMood,
        context: selectedContext || undefined,
        genres: selectedGenres,
        trackCount: 8,
      });
    } catch {
      // error handled in onError
    }
  };

  const handleTrackPress = (track: Track) => {
    if (generatedPlaylist) {
      playTrack(track, generatedPlaylist);
    } else {
      playTrack(track);
    }
  };

  return (
    <View style={styles.outerContainer}>
      <ScreenContainer containerClassName="bg-[#121212]" edges={['top', 'left', 'right']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>AI Playlist Generator</Text>
            <Text style={styles.subtitle}>Powered by the Executive Council</Text>
          </View>

          {/* Mood Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Select your mood *</Text>
            <View style={styles.moodGrid}>
              {MOODS.map(mood => (
                <Pressable
                  key={mood.id}
                  onPress={() => setSelectedMood(mood.id)}
                  style={({ pressed }) => [
                    styles.moodCard,
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
            </View>
          </View>

          {/* Context Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Context (optional)</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
              {CONTEXTS.map(ctx => (
                <Pressable
                  key={ctx.id}
                  onPress={() => setSelectedContext(selectedContext === ctx.id ? null : ctx.id)}
                  style={({ pressed }) => [
                    styles.chip,
                    selectedContext === ctx.id && styles.chipActive,
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <Text style={styles.chipEmoji}>{ctx.emoji}</Text>
                  <Text style={[styles.chipLabel, selectedContext === ctx.id && styles.chipLabelActive]}>
                    {ctx.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Genre Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Genres (optional)</Text>
            <View style={styles.genreGrid}>
              {GENRES.map(genre => (
                <Pressable
                  key={genre.id}
                  onPress={() => toggleGenre(genre.id)}
                  style={({ pressed }) => [
                    styles.genreChip,
                    selectedGenres.includes(genre.id) && styles.genreChipActive,
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <Text style={[
                    styles.genreLabel,
                    selectedGenres.includes(genre.id) && styles.genreLabelActive,
                  ]}>
                    {genre.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Generate Button */}
          <View style={styles.generateContainer}>
            <Pressable
              onPress={handleGenerate}
              disabled={!selectedMood || isGenerating}
              style={({ pressed }) => [
                styles.generateBtn,
                (!selectedMood || isGenerating) && styles.generateBtnDisabled,
                pressed && selectedMood && { transform: [{ scale: 0.97 }] },
              ]}
            >
              {isGenerating ? (
                <View style={styles.generateBtnContent}>
                  <ActivityIndicator size="small" color="#121212" />
                  <Text style={styles.generateBtnText}>Generating...</Text>
                </View>
              ) : (
                <View style={styles.generateBtnContent}>
                  <IconSymbol name="sparkles" size={20} color="#121212" />
                  <Text style={styles.generateBtnText}>Generate Playlist</Text>
                </View>
              )}
            </Pressable>
            {!selectedMood && (
              <Text style={styles.generateHint}>Select a mood to generate your playlist</Text>
            )}
          </View>

          {/* Generated Playlist */}
          {generatedPlaylist && (
            <View style={styles.resultSection}>
              <View style={styles.resultHeader}>
                <View style={styles.resultInfo}>
                  <Image source={{ uri: generatedPlaylist.coverUrl }} style={styles.resultCover} />
                  <View>
                    <Text style={styles.resultTitle}>{generatedPlaylist.title}</Text>
                    <Text style={styles.resultMeta}>
                      {generatedPlaylist.tracks.length} tracks · AI Generated
                    </Text>
                  </View>
                </View>
                <Pressable
                  onPress={() => {
                    if (generatedPlaylist.tracks.length > 0) {
                      playTrack(generatedPlaylist.tracks[0], generatedPlaylist);
                    }
                  }}
                  style={({ pressed }) => [styles.playAllBtn, pressed && { opacity: 0.8 }]}
                >
                  <IconSymbol name="play.fill" size={20} color="#121212" />
                </Pressable>
              </View>

              <Text style={styles.resultDescription}>{generatedPlaylist.description}</Text>

              {generatedPlaylist.tracks.map((track, index) => (
                <TrackRow
                  key={track.id}
                  track={track}
                  index={index}
                  showIndex
                  onPress={() => handleTrackPress(track)}
                />
              ))}

              <Pressable style={styles.saveBtn}>
                <IconSymbol name="plus.circle.fill" size={18} color="#1DB954" />
                <Text style={styles.saveBtnText}>Save to Library</Text>
              </Pressable>
            </View>
          )}

          <View style={{ height: currentTrack ? 80 : 32 }} />
        </ScrollView>
      </ScreenContainer>

      {currentTrack && (
        <View style={styles.miniPlayerContainer}>
          <MiniPlayer onPress={openPlayer} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: { flex: 1, backgroundColor: '#121212' },
  scrollContent: { paddingBottom: 16 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  title: { color: '#FFFFFF', fontSize: 26, fontWeight: '800', letterSpacing: 0.5 },
  subtitle: { color: '#1DB954', fontSize: 13, marginTop: 4, fontWeight: '500' },
  section: { marginTop: 24, paddingHorizontal: 20 },
  sectionLabel: { color: '#FFFFFF', fontSize: 15, fontWeight: '700', marginBottom: 12 },
  moodGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  moodCard: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: 'transparent',
  },
  moodEmoji: { fontSize: 22 },
  moodLabel: { color: '#FFFFFF', fontSize: 11, fontWeight: '600' },
  chipsScroll: { gap: 10 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333333',
  },
  chipActive: { backgroundColor: '#1DB954', borderColor: '#1DB954' },
  chipEmoji: { fontSize: 14 },
  chipLabel: { color: '#B3B3B3', fontSize: 13, fontWeight: '500' },
  chipLabelActive: { color: '#121212', fontWeight: '700' },
  genreGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  genreChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333333',
  },
  genreChipActive: { backgroundColor: '#1DB954', borderColor: '#1DB954' },
  genreLabel: { color: '#B3B3B3', fontSize: 13, fontWeight: '500' },
  genreLabelActive: { color: '#121212', fontWeight: '700' },
  generateContainer: { paddingHorizontal: 20, marginTop: 28, alignItems: 'center', gap: 10 },
  generateBtn: {
    width: '100%',
    backgroundColor: '#1DB954',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
  },
  generateBtnDisabled: { backgroundColor: '#2A2A2A' },
  generateBtnContent: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  generateBtnText: { color: '#121212', fontSize: 16, fontWeight: '700' },
  generateHint: { color: '#B3B3B3', fontSize: 12 },
  resultSection: { marginTop: 28 },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  resultInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  resultCover: { width: 56, height: 56, borderRadius: 8, backgroundColor: '#2A2A2A' },
  resultTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  resultMeta: { color: '#B3B3B3', fontSize: 12, marginTop: 3 },
  playAllBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1DB954',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultDescription: {
    color: '#B3B3B3',
    fontSize: 13,
    lineHeight: 19,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1DB954',
  },
  saveBtnText: { color: '#1DB954', fontSize: 14, fontWeight: '600' },
  miniPlayerContainer: { position: 'absolute', bottom: 0, left: 0, right: 0 },
});
