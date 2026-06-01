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
import { MOCK_PLAYLISTS, MOCK_TRACKS } from '@/lib/mock-data';

type LibraryTab = 'playlists' | 'liked' | 'recent';

export default function LibraryScreen() {
  const { currentTrack, playTrack, likedTrackIds, openPlayer } = usePlayer();
  const [activeTab, setActiveTab] = useState<LibraryTab>('playlists');

  const likedTracks = MOCK_TRACKS.filter(t => likedTrackIds.has(t.id));

  return (
    <View style={styles.outerContainer}>
      <ScreenContainer containerClassName="bg-[#121212]" edges={['top', 'left', 'right']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Your Library</Text>
            <Pressable style={({ pressed }) => [styles.addBtn, pressed && { opacity: 0.6 }]}>
              <IconSymbol name="plus.circle.fill" size={28} color="#1DB954" />
            </Pressable>
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            {(['playlists', 'liked', 'recent'] as LibraryTab[]).map(tab => (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[styles.tab, activeTab === tab && styles.activeTab]}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                  {tab === 'playlists' ? 'Playlists' : tab === 'liked' ? 'Liked' : 'Recent'}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Playlists Tab */}
          {activeTab === 'playlists' && (
            <View style={styles.playlistGrid}>
              {MOCK_PLAYLISTS.map(playlist => (
                <PlaylistCard
                  key={playlist.id}
                  playlist={playlist}
                  onPress={() => {}}
                  size="medium"
                />
              ))}
            </View>
          )}

          {/* Liked Tab */}
          {activeTab === 'liked' && (
            <View>
              {likedTracks.length === 0 ? (
                <View style={styles.emptyState}>
                  <IconSymbol name="heart" size={48} color="#333333" />
                  <Text style={styles.emptyTitle}>No liked songs yet</Text>
                  <Text style={styles.emptySubtitle}>
                    Tap the heart icon on any track to add it here
                  </Text>
                </View>
              ) : (
                likedTracks.map((track, index) => (
                  <Pressable
                    key={track.id}
                    onPress={() => playTrack(track)}
                    style={({ pressed }) => [styles.trackRow, pressed && { opacity: 0.7 }]}
                  >
                    <Text style={styles.trackIndex}>{index + 1}</Text>
                    <Image source={{ uri: track.coverUrl }} style={styles.trackCover} />
                    <View style={styles.trackInfo}>
                      <Text style={styles.trackTitle} numberOfLines={1}>{track.title}</Text>
                      <Text style={styles.trackArtist} numberOfLines={1}>{track.artist}</Text>
                    </View>
                    <IconSymbol name="heart.fill" size={18} color="#1DB954" />
                  </Pressable>
                ))
              )}
            </View>
          )}

          {/* Recent Tab */}
          {activeTab === 'recent' && (
            <View>
              {MOCK_TRACKS.slice(0, 5).map((track, index) => (
                <Pressable
                  key={track.id}
                  onPress={() => playTrack(track)}
                  style={({ pressed }) => [styles.trackRow, pressed && { opacity: 0.7 }]}
                >
                  <Image source={{ uri: track.coverUrl }} style={styles.trackCover} />
                  <View style={styles.trackInfo}>
                    <Text style={styles.trackTitle} numberOfLines={1}>{track.title}</Text>
                    <Text style={styles.trackArtist} numberOfLines={1}>{track.artist}</Text>
                  </View>
                  <IconSymbol name="chevron.right" size={16} color="#B3B3B3" />
                </Pressable>
              ))}
            </View>
          )}

          {/* Artist Marketplace Banner */}
          <Pressable style={styles.marketplaceBanner}>
            <View style={styles.marketplaceContent}>
              <IconSymbol name="person.2.fill" size={24} color="#FFD700" />
              <View style={styles.marketplaceText}>
                <Text style={styles.marketplaceTitle}>Artist Marketplace</Text>
                <Text style={styles.marketplaceSubtitle}>Discover independent artists & exclusive playlists</Text>
              </View>
            </View>
            <IconSymbol name="chevron.right" size={18} color="#FFD700" />
          </Pressable>

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: { color: '#FFFFFF', fontSize: 26, fontWeight: '800' },
  addBtn: { padding: 4 },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 20,
    marginTop: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1E1E1E',
  },
  activeTab: { backgroundColor: '#1DB954' },
  tabText: { color: '#B3B3B3', fontSize: 13, fontWeight: '600' },
  activeTabText: { color: '#121212' },
  playlistGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  emptySubtitle: { color: '#B3B3B3', fontSize: 14, textAlign: 'center', lineHeight: 20 },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 12,
  },
  trackIndex: { color: '#B3B3B3', fontSize: 14, width: 20, textAlign: 'center' },
  trackCover: { width: 46, height: 46, borderRadius: 6, backgroundColor: '#2A2A2A' },
  trackInfo: { flex: 1 },
  trackTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '500' },
  trackArtist: { color: '#B3B3B3', fontSize: 12, marginTop: 2 },
  marketplaceBanner: {
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: '#1E1E1E',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  marketplaceContent: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  marketplaceText: { flex: 1 },
  marketplaceTitle: { color: '#FFD700', fontSize: 15, fontWeight: '700' },
  marketplaceSubtitle: { color: '#B3B3B3', fontSize: 12, marginTop: 3 },
  miniPlayerContainer: { position: 'absolute', bottom: 0, left: 0, right: 0 },
});
