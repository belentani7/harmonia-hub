import React, { useState } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator, FlatList, Image, Alert,
} from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { TrackRow } from '@/components/track-row';
import { MiniPlayer } from '@/components/mini-player';
import { usePlayer } from '@/lib/player-context';
import { MOCK_PLAYLISTS } from '@/lib/mock-data';
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
  { id: 'metal', label: 'Metal' },
];

export default function DiscoverScreen() {
  const { currentTrack, playTrack, openPlayer } = usePlayer();
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [selectedContext, setSelectedContext] = useState<Context | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlaylist, setGeneratedPlaylist] = useState<Playlist | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const generateMutation = trpc.playlist.generate.useMutation({
    onSuccess: (data: any) => {
      setGeneratedPlaylist(data as Playlist);
      setIsGenerating(false);
      setGenerationError(null);
    },
    onError: (error: any) => {
      console.error('Playlist generation error:', error);
      setGenerationError(error.message || 'Failed to generate playlist. Using fallback...');
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
    if (!selectedMood) {
      Alert.alert('Select a Mood', 'Please select a mood to generate a playlist.');
      return;
    }
    setIsGenerating(true);
    setGeneratedPlaylist(null);
    setGenerationError(null);

    try {
      await generateMutation.mutateAsync({
        mood: selectedMood,
        context: selectedContext || undefined,
        genres: selectedGenres.length > 0 ? selectedGenres : undefined,
        trackCount: 8,
      });
    } catch (error) {
      // Error is handled in onError callback
      console.error('Mutation error:', error);
    }
  };

  const handleTrackPress = (track: Track) => {
    if (generatedPlaylist) {
      playTrack(track, generatedPlaylist);
      openPlayer();
    }
  };

  const getMoodColor = (mood: Mood) => {
    const moodObj = MOODS.find(m => m.id === mood);
    return moodObj?.color || '#1DB954';
  };

  return (
    <View style={styles.outerContainer}>
      <ScreenContainer containerClassName="bg-[#121212]" edges={['top', 'left', 'right']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>AI Playlist Generator</Text>
            <Text style={styles.subtitle}>Create playlists powered by mood and context</Text>
          </View>

          {/* Mood Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How are you feeling?</Text>
            <View style={styles.moodGrid}>
              {MOODS.map(mood => (
                <Pressable
                  key={mood.id}
                  onPress={() => setSelectedMood(mood.id)}
                  style={({ pressed }) => [
                    styles.moodChip,
                    selectedMood === mood.id && { backgroundColor: mood.color + '30', borderColor: mood.color },
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                  <Text style={[styles.moodLabel, selectedMood === mood.id && { color: mood.color }]}>
                    {mood.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Context Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Where are you?</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.contextScroll}>
              {CONTEXTS.map(context => (
                <Pressable
                  key={context.id}
                  onPress={() => setSelectedContext(selectedContext === context.id ? null : context.id)}
                  style={({ pressed }) => [
                    styles.contextChip,
                    selectedContext === context.id && styles.contextChipActive,
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <Text style={styles.contextEmoji}>{context.emoji}</Text>
                  <Text style={[styles.contextLabel, selectedContext === context.id && { color: '#1DB954' }]}>
                    {context.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Genre Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Genres (optional)</Text>
            <View style={styles.genreGrid}>
              {GENRES.map(genre => (
                <Pressable
                  key={genre.id}
                  onPress={() => toggleGenre(genre.id)}
                  style={({ pressed }) => [
                    styles.genrePill,
                    selectedGenres.includes(genre.id) && styles.genrePillActive,
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <Text style={[styles.genreLabel, selectedGenres.includes(genre.id) && { color: '#121212' }]}>
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
              disabled={isGenerating || !selectedMood}
              style={({ pressed }) => [
                styles.generateBtn,
                (isGenerating || !selectedMood) && styles.generateBtnDisabled,
                pressed && !isGenerating && { transform: [{ scale: 0.97 }] },
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
          </View>

          {/* Error Message */}
          {generationError && (
            <View style={styles.errorBanner}>
              <IconSymbol name="exclamationmark.triangle.fill" size={16} color="#F39C12" />
              <Text style={styles.errorText}>{generationError}</Text>
            </View>
          )}

          {/* Generated Playlist */}
          {generatedPlaylist && (
            <View style={styles.playlistContainer}>
              <View style={styles.playlistHeader}>
                <Image
                  source={{ uri: generatedPlaylist.coverUrl }}
                  style={styles.playlistCover}
                />
                <View style={styles.playlistInfo}>
                  <Text style={styles.playlistTitle}>{generatedPlaylist.title}</Text>
                  <Text style={styles.playlistDescription} numberOfLines={2}>
                    {generatedPlaylist.description}
                  </Text>
                  <View style={styles.playlistMeta}>
                    <Text style={styles.playlistMood}>{generatedPlaylist.mood}</Text>
                    <Text style={styles.playlistCount}>{generatedPlaylist.tracks.length} tracks</Text>
                  </View>
                </View>
              </View>

              {/* Tracks */}
              <FlatList
                scrollEnabled={false}
                data={generatedPlaylist.tracks}
                keyExtractor={track => track.id}
                renderItem={({ item, index }) => (
                  <TrackRow
                    track={item}
                    index={index}
                    onPress={() => handleTrackPress(item)}
                    showIndex={true}
                  />
                )}
                ItemSeparatorComponent={() => <View style={styles.trackSeparator} />}
              />

              {/* Save Button */}
              <Pressable
                onPress={() => Alert.alert('Saved', 'Playlist saved to your library!')}
                style={({ pressed }) => [styles.saveBtn, pressed && { opacity: 0.8 }]}
              >
                <IconSymbol name="heart.fill" size={18} color="#1DB954" />
                <Text style={styles.saveBtnText}>Save to Library</Text>
              </Pressable>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </ScreenContainer>

      {/* Mini Player */}
      <MiniPlayer onPress={openPlayer} />
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: { flex: 1, backgroundColor: '#121212' },
  scrollContent: { paddingBottom: 20 },
  header: { paddingHorizontal: 16, paddingVertical: 12, gap: 4 },
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: '800' },
  subtitle: { color: '#B3B3B3', fontSize: 14 },
  section: { marginTop: 20 },
  sectionTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', paddingHorizontal: 16, marginBottom: 12 },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 10,
  },
  moodChip: {
    width: '30%',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#333333',
  },
  moodEmoji: { fontSize: 24 },
  moodLabel: { color: '#B3B3B3', fontSize: 12, fontWeight: '600', textAlign: 'center' },
  contextScroll: { paddingHorizontal: 16, gap: 10 },
  contextChip: {
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#333333',
  },
  contextChipActive: { backgroundColor: '#1DB954', borderColor: '#1DB954' },
  contextEmoji: { fontSize: 16 },
  contextLabel: { color: '#B3B3B3', fontSize: 12, fontWeight: '600' },
  genreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 8,
  },
  genrePill: {
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#333333',
  },
  genrePillActive: { backgroundColor: '#1DB954', borderColor: '#1DB954' },
  genreLabel: { color: '#B3B3B3', fontSize: 12, fontWeight: '600' },
  generateContainer: { paddingHorizontal: 16, marginTop: 24 },
  generateBtn: {
    backgroundColor: '#1DB954',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  generateBtnDisabled: { backgroundColor: '#2A2A2A' },
  generateBtnContent: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  generateBtnText: { color: '#121212', fontSize: 15, fontWeight: '700' },
  errorBanner: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#F39C1220',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#F39C12',
  },
  errorText: { color: '#F39C12', fontSize: 13, flex: 1 },
  playlistContainer: { marginHorizontal: 16, marginTop: 20, gap: 12 },
  playlistHeader: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 12,
  },
  playlistCover: { width: 80, height: 80, borderRadius: 8 },
  playlistInfo: { flex: 1, justifyContent: 'space-between' },
  playlistTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  playlistDescription: { color: '#B3B3B3', fontSize: 12, lineHeight: 16 },
  playlistMeta: { flexDirection: 'row', gap: 8 },
  playlistMood: { color: '#1DB954', fontSize: 11, fontWeight: '600', textTransform: 'capitalize' },
  playlistCount: { color: '#666666', fontSize: 11 },
  trackSeparator: { height: 1, backgroundColor: '#1E1E1E', marginVertical: 8 },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#1DB954',
    justifyContent: 'center',
  },
  saveBtnText: { color: '#1DB954', fontSize: 14, fontWeight: '700' },
});
