import { Track, Playlist, CEOStrategy, Agent } from '@/shared/types';

export const MOCK_TRACKS: Track[] = [
  {
    id: 't1', title: 'Neural Drift', artist: 'BELENTANI', album: 'AI Sessions Vol.1',
    duration: 214, coverUrl: 'https://picsum.photos/seed/btrack1/300/300',
    mood: 'focus', genre: 'electronic', bpm: 120,
    aiInsight: 'Selected for deep focus — 120 BPM matches your peak productivity window.',
  },
  {
    id: 't2', title: 'Midnight Algorithm', artist: 'Synthwave AI', album: 'Digital Dreams',
    duration: 187, coverUrl: 'https://picsum.photos/seed/btrack2/300/300',
    mood: 'chill', genre: 'electronic', bpm: 90,
    aiInsight: 'Chill vibes with ambient pads — perfect for late-night sessions.',
  },
  {
    id: 't3', title: 'Quantum Pulse', artist: 'DataBeats', album: 'Binary Rhythms',
    duration: 198, coverUrl: 'https://picsum.photos/seed/btrack3/300/300',
    mood: 'energy', genre: 'electronic', bpm: 140,
    aiInsight: 'High-energy track trending +34% this week among your demographic.',
  },
  {
    id: 't4', title: 'Emotional Vector', artist: 'NeuralMood', album: 'Feelings.exe',
    duration: 241, coverUrl: 'https://picsum.photos/seed/btrack4/300/300',
    mood: 'sad', genre: 'indie', bpm: 72,
    aiInsight: 'Introspective melody — matches your current emotional pattern.',
  },
  {
    id: 't5', title: 'Frequency Drop', artist: 'JUDAS x BELENTANI', album: 'Collab Series',
    duration: 203, coverUrl: 'https://picsum.photos/seed/btrack5/300/300',
    mood: 'party', genre: 'hiphop', bpm: 128,
    aiInsight: 'Your JUDAS track — amplified by Viral Agent for maximum reach.',
  },
  {
    id: 't6', title: 'Sleep Protocol', artist: 'Ambient AI', album: 'Rest Mode',
    duration: 320, coverUrl: 'https://picsum.photos/seed/btrack6/300/300',
    mood: 'sleep', genre: 'classical', bpm: 55,
    aiInsight: 'Binaural beats embedded — clinically proven to reduce sleep latency.',
  },
  {
    id: 't7', title: 'Cortex Lift', artist: 'BrainWave', album: 'Nootropic Sounds',
    duration: 176, coverUrl: 'https://picsum.photos/seed/btrack7/300/300',
    mood: 'workout', genre: 'electronic', bpm: 150,
    aiInsight: 'Peak performance track — matched to your gym session patterns.',
  },
  {
    id: 't8', title: 'Velvet Signal', artist: 'Romantic AI', album: 'Love.json',
    duration: 228, coverUrl: 'https://picsum.photos/seed/btrack8/300/300',
    mood: 'romantic', genre: 'rnb', bpm: 80,
    aiInsight: 'Warm harmonics — trending in your region for evening listening.',
  },
];

export const MOCK_PLAYLISTS: Playlist[] = [
  {
    id: 'p1',
    title: 'Deep Focus Mode',
    description: 'AI-curated for maximum concentration and flow state',
    coverUrl: 'https://picsum.photos/seed/bpl1/300/300',
    tracks: [MOCK_TRACKS[0], MOCK_TRACKS[2], MOCK_TRACKS[6]],
    mood: 'focus',
    context: 'work',
    genres: ['electronic'],
    createdAt: new Date().toISOString(),
    isAIGenerated: true,
    playCount: 1247,
  },
  {
    id: 'p2',
    title: 'Midnight Chill Sessions',
    description: 'Late-night ambient for unwinding and reflection',
    coverUrl: 'https://picsum.photos/seed/bpl2/300/300',
    tracks: [MOCK_TRACKS[1], MOCK_TRACKS[3], MOCK_TRACKS[5]],
    mood: 'chill',
    context: 'meditation',
    genres: ['electronic', 'indie'],
    createdAt: new Date().toISOString(),
    isAIGenerated: true,
    playCount: 892,
  },
  {
    id: 'p3',
    title: 'JUDAS Energy Mix',
    description: 'High-energy tracks featuring BELENTANI originals',
    coverUrl: 'https://picsum.photos/seed/bpl3/300/300',
    tracks: [MOCK_TRACKS[4], MOCK_TRACKS[2], MOCK_TRACKS[6]],
    mood: 'energy',
    context: 'gym',
    genres: ['hiphop', 'electronic'],
    createdAt: new Date().toISOString(),
    isAIGenerated: false,
    playCount: 2341,
  },
  {
    id: 'p4',
    title: 'Sleep Protocol',
    description: 'Binaural beats and ambient sounds for deep sleep',
    coverUrl: 'https://picsum.photos/seed/bpl4/300/300',
    tracks: [MOCK_TRACKS[5], MOCK_TRACKS[1], MOCK_TRACKS[7]],
    mood: 'sleep',
    context: 'sleep',
    genres: ['classical', 'electronic'],
    createdAt: new Date().toISOString(),
    isAIGenerated: true,
    playCount: 567,
  },
  {
    id: 'p5',
    title: 'Party Algorithm',
    description: 'AI-selected bangers for your next event',
    coverUrl: 'https://picsum.photos/seed/bpl5/300/300',
    tracks: [MOCK_TRACKS[4], MOCK_TRACKS[2], MOCK_TRACKS[6], MOCK_TRACKS[0]],
    mood: 'party',
    context: 'party',
    genres: ['hiphop', 'electronic', 'pop'],
    createdAt: new Date().toISOString(),
    isAIGenerated: true,
    playCount: 3102,
  },
  {
    id: 'p6',
    title: 'Romantic Frequencies',
    description: 'Warm harmonics for intimate moments',
    coverUrl: 'https://picsum.photos/seed/bpl6/300/300',
    tracks: [MOCK_TRACKS[7], MOCK_TRACKS[3], MOCK_TRACKS[1]],
    mood: 'romantic',
    context: 'meditation',
    genres: ['rnb', 'indie'],
    createdAt: new Date().toISOString(),
    isAIGenerated: true,
    playCount: 445,
  },
];

export const MOCK_CEO_STRATEGY: CEOStrategy = {
  id: 'strategy-001',
  generatedAt: new Date().toISOString(),
  summary: 'Market analysis reveals 23% growth opportunity in Gen-Z focus music segment. Recommend immediate expansion of study playlist category with AI-generated lo-fi content. TikTok integration showing 340% higher conversion rate.',
  keyDecisions: [
    'Launch "Study Beats" category — targeting 18-24 demographic',
    'Integrate TikTok short-form playlist previews (15 seconds)',
    'Partner with 50 independent artists this quarter',
    'Expand to Brazilian market — 2.3M potential users identified',
  ],
  metrics: {
    users: 127000,
    revenue: 42500,
    churn: 3.2,
    engagement: 78.4,
  },
  autonomousActions: [
    {
      id: 'a1',
      action: 'Launched "Study Beats" playlist category',
      agent: 'CPO',
      status: 'executed',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'a2',
      action: 'Optimized ad spend — reallocated $2K to TikTok',
      agent: 'CMO',
      status: 'executed',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: 'a3',
      action: 'Deprecated "Emotional Remixes" — low engagement',
      agent: 'CPO',
      status: 'executed',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'a4',
      action: 'Brazilian market entry — content localization',
      agent: 'COO',
      status: 'pending',
      timestamp: new Date().toISOString(),
    },
  ],
  nextSteps: [
    'Launch podcast integration by end of quarter',
    'Implement predictive churn model',
    'File provisional patent for mood-detection algorithm',
  ],
  risks: [
    "Spotify's new AI feature copying our mood detection",
    'TikTok integration surge — need short-form playlists',
    'Gen-Z churn higher than average — need gamification',
  ],
};

export const MOCK_AGENTS: Agent[] = [
  {
    role: 'CEO',
    name: 'APEX-1',
    description: 'Vision & Strategy — Defines direction based on market trends and monetization goals.',
    status: 'active',
    lastAction: 'Generated daily market analysis report',
    lastActionTime: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    role: 'COO',
    name: 'EXEC-2',
    description: 'Operations & Execution — Translates strategy into concrete tasks.',
    status: 'analyzing',
    lastAction: 'Coordinating Brazilian market expansion',
    lastActionTime: new Date(Date.now() - 900000).toISOString(),
  },
  {
    role: 'CMO',
    name: 'BRAND-3',
    description: 'Brand & Growth — Ensures visual consistency and psychological advertising.',
    status: 'active',
    lastAction: 'Optimized TikTok ad campaigns',
    lastActionTime: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    role: 'CPO',
    name: 'PROD-4',
    description: 'Product & Experience — Defines feature evolution based on usage data.',
    status: 'active',
    lastAction: 'Launched Study Beats category',
    lastActionTime: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    role: 'CTO',
    name: 'TECH-5',
    description: 'Infrastructure & Integration — Guarantees technical feasibility and scalability.',
    status: 'idle',
    lastAction: 'Deployed mood-detection algorithm v2.3',
    lastActionTime: new Date(Date.now() - 86400000).toISOString(),
  },
];

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
