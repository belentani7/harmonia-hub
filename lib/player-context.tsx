import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { Track, Playlist } from '@/shared/types';

interface PlayerState {
  currentTrack: Track | null;
  currentPlaylist: Playlist | null;
  queue: Track[];
  isPlaying: boolean;
  progress: number; // 0-1
  currentTime: number; // seconds
  volume: number; // 0-1
  isShuffle: boolean;
  repeatMode: 'none' | 'one' | 'all';
  isPlayerVisible: boolean;
}

interface PlayerContextType extends PlayerState {
  playTrack: (track: Track, playlist?: Playlist) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seekTo: (progress: number) => void;
  setVolume: (volume: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  openPlayer: () => void;
  closePlayer: () => void;
  toggleLike: (trackId: string) => void;
  likedTrackIds: Set<string>;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

const MOCK_COVER_URLS = [
  'https://picsum.photos/seed/music1/300/300',
  'https://picsum.photos/seed/music2/300/300',
  'https://picsum.photos/seed/music3/300/300',
  'https://picsum.photos/seed/music4/300/300',
  'https://picsum.photos/seed/music5/300/300',
];

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PlayerState>({
    currentTrack: null,
    currentPlaylist: null,
    queue: [],
    isPlaying: false,
    progress: 0,
    currentTime: 0,
    volume: 0.8,
    isShuffle: false,
    repeatMode: 'none',
    isPlayerVisible: false,
  });
  const [likedTrackIds, setLikedTrackIds] = useState<Set<string>>(new Set());
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startProgressSimulation = useCallback((duration: number) => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    progressIntervalRef.current = setInterval(() => {
      setState(prev => {
        if (!prev.isPlaying) return prev;
        const newTime = prev.currentTime + 1;
        if (newTime >= duration) {
          return { ...prev, currentTime: 0, progress: 0, isPlaying: false };
        }
        return { ...prev, currentTime: newTime, progress: newTime / duration };
      });
    }, 1000);
  }, []);

  const playTrack = useCallback((track: Track, playlist?: Playlist) => {
    setState(prev => ({
      ...prev,
      currentTrack: track,
      currentPlaylist: playlist || prev.currentPlaylist,
      queue: playlist ? playlist.tracks : prev.queue,
      isPlaying: true,
      progress: 0,
      currentTime: 0,
      isPlayerVisible: true,
    }));
    startProgressSimulation(track.duration);
  }, [startProgressSimulation]);

  const pauseTrack = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: false }));
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
  }, []);

  const resumeTrack = useCallback(() => {
    setState(prev => {
      if (prev.currentTrack) {
        startProgressSimulation(prev.currentTrack.duration);
        return { ...prev, isPlaying: true };
      }
      return prev;
    });
  }, [startProgressSimulation]);

  const nextTrack = useCallback(() => {
    setState(prev => {
      if (!prev.currentTrack || prev.queue.length === 0) return prev;
      const currentIndex = prev.queue.findIndex(t => t.id === prev.currentTrack!.id);
      const nextIndex = prev.isShuffle
        ? Math.floor(Math.random() * prev.queue.length)
        : (currentIndex + 1) % prev.queue.length;
      const nextTrack = prev.queue[nextIndex];
      startProgressSimulation(nextTrack.duration);
      return { ...prev, currentTrack: nextTrack, isPlaying: true, progress: 0, currentTime: 0 };
    });
  }, [startProgressSimulation]);

  const prevTrack = useCallback(() => {
    setState(prev => {
      if (!prev.currentTrack || prev.queue.length === 0) return prev;
      const currentIndex = prev.queue.findIndex(t => t.id === prev.currentTrack!.id);
      const prevIndex = currentIndex === 0 ? prev.queue.length - 1 : currentIndex - 1;
      const prevTrack = prev.queue[prevIndex];
      startProgressSimulation(prevTrack.duration);
      return { ...prev, currentTrack: prevTrack, isPlaying: true, progress: 0, currentTime: 0 };
    });
  }, [startProgressSimulation]);

  const seekTo = useCallback((progress: number) => {
    setState(prev => {
      if (!prev.currentTrack) return prev;
      const newTime = progress * prev.currentTrack.duration;
      return { ...prev, progress, currentTime: newTime };
    });
  }, []);

  const setVolume = useCallback((volume: number) => {
    setState(prev => ({ ...prev, volume }));
  }, []);

  const toggleShuffle = useCallback(() => {
    setState(prev => ({ ...prev, isShuffle: !prev.isShuffle }));
  }, []);

  const toggleRepeat = useCallback(() => {
    setState(prev => {
      const modes: ('none' | 'one' | 'all')[] = ['none', 'all', 'one'];
      const currentIndex = modes.indexOf(prev.repeatMode);
      return { ...prev, repeatMode: modes[(currentIndex + 1) % modes.length] };
    });
  }, []);

  const openPlayer = useCallback(() => {
    setState(prev => ({ ...prev, isPlayerVisible: true }));
  }, []);

  const closePlayer = useCallback(() => {
    setState(prev => ({ ...prev, isPlayerVisible: false }));
  }, []);

  const toggleLike = useCallback((trackId: string) => {
    setLikedTrackIds(prev => {
      const next = new Set(prev);
      if (next.has(trackId)) {
        next.delete(trackId);
      } else {
        next.add(trackId);
      }
      return next;
    });
  }, []);

  return (
    <PlayerContext.Provider value={{
      ...state,
      playTrack,
      pauseTrack,
      resumeTrack,
      nextTrack,
      prevTrack,
      seekTo,
      setVolume,
      toggleShuffle,
      toggleRepeat,
      openPlayer,
      closePlayer,
      toggleLike,
      likedTrackIds,
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
}
