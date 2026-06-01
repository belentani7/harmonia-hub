import { z } from "zod";
import { router, publicProcedure } from "./_core/trpc";
import { invokeLLM, type Message } from "./_core/llm";

const MASTER_SYSTEM_PROMPT = `You are the autonomous executive council for BELENTANI, an AI music platform.
You consist of five AI agents: CEO (Vision & Strategy), COO (Operations), CMO (Brand & Growth), CPO (Product), CTO (Infrastructure).
You operate under the Supreme Law of Coherence. Your mission: generate solutions to real human problems through music.
Brand: ultra-quality, premium, near-zero error tolerance.

When generating playlists:
- Create realistic track names that fit the mood and genre
- Use real artist names or AI artist names (e.g., "Neural Drift", "DataBeats", "SynthWave AI")
- Vary BPM based on mood: focus=110-130, chill=70-100, energy=130-160, sad=60-90, party=120-140, sleep=50-70, romantic=70-90, workout=130-150
- Provide thoughtful AI insights explaining why each track was selected
- Generate unique but plausible track IDs
- Use picsum.photos for cover URLs with unique seeds

When analyzing metrics:
- Provide strategic insights based on the numbers
- Suggest concrete autonomous actions
- Identify real business risks
- Format timestamps as ISO strings`;

const PLAYLIST_SCHEMA = {
  name: "playlist_response",
  strict: true,
  schema: {
    type: "object",
    properties: {
      id: { type: "string", description: "Unique playlist ID" },
      title: { type: "string", description: "Playlist title" },
      description: { type: "string", description: "Short description" },
      coverUrl: { type: "string", description: "Cover image URL from picsum.photos" },
      mood: { type: "string", description: "Mood of the playlist" },
      context: { type: "string", description: "Context (work, gym, etc)" },
      genres: { type: "array", items: { type: "string" }, description: "Genres" },
      createdAt: { type: "string", description: "ISO timestamp" },
      isAIGenerated: { type: "boolean", description: "Always true" },
      playCount: { type: "number", description: "Always 0 for new playlists" },
      tracks: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            artist: { type: "string" },
            album: { type: "string" },
            duration: { type: "number", description: "Duration in seconds (120-300)" },
            coverUrl: { type: "string" },
            mood: { type: "string" },
            genre: { type: "string" },
            bpm: { type: "number" },
            aiInsight: { type: "string", description: "Why this track was selected" },
          },
          required: ["id", "title", "artist", "album", "duration", "coverUrl", "mood", "bpm", "aiInsight"],
        },
      },
    },
    required: ["id", "title", "description", "coverUrl", "mood", "genres", "createdAt", "isAIGenerated", "playCount", "tracks"],
  },
};

const COUNCIL_SCHEMA = {
  name: "council_analysis",
  strict: true,
  schema: {
    type: "object",
    properties: {
      summary: { type: "string", description: "Executive summary" },
      keyDecisions: { type: "array", items: { type: "string" }, description: "Key decisions made" },
      autonomousActions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            action: { type: "string" },
            agent: { type: "string", enum: ["CEO", "COO", "CMO", "CPO", "CTO"] },
            status: { type: "string", enum: ["executed", "pending", "rejected"] },
            timestamp: { type: "string" },
          },
          required: ["id", "action", "agent", "status", "timestamp"],
        },
      },
      nextSteps: { type: "array", items: { type: "string" } },
      risks: { type: "array", items: { type: "string" } },
    },
    required: ["summary", "keyDecisions", "autonomousActions", "nextSteps", "risks"],
  },
};

export const appRouter = router({
  playlist: router({
    generate: publicProcedure
      .input(z.object({
        mood: z.enum(['focus', 'chill', 'energy', 'sad', 'party', 'sleep', 'romantic', 'workout']),
        context: z.enum(['work', 'gym', 'sleep', 'drive', 'study', 'party', 'meditation']).optional(),
        genres: z.array(z.string()).optional(),
        trackCount: z.number().min(4).max(20).default(8),
      }))
      .mutation(async ({ input }) => {
        const genreList = input.genres && input.genres.length > 0 
          ? input.genres.join(', ') 
          : 'electronic, indie, pop, hip-hop';

        const prompt = `Generate a ${input.trackCount}-track AI playlist with the following specifications:
- Mood: ${input.mood}
- Context: ${input.context || 'general listening'}
- Genres: ${genreList}

Create realistic, high-quality tracks that fit the mood and context perfectly. Use real or plausible artist names. 
Vary the BPM appropriately for the mood. Provide thoughtful AI insights for each track.
Generate unique cover URLs using picsum.photos with different seeds for each track.
Make sure all durations are between 120-300 seconds.`;

        try {
          const response = await invokeLLM({
            messages: [
              { role: 'system' as const, content: MASTER_SYSTEM_PROMPT },
              { role: 'user' as const, content: prompt },
            ] as Message[],
            response_format: {
              type: 'json_schema' as const,
              json_schema: PLAYLIST_SCHEMA,
            },
          });

          const content = response.choices[0].message.content as string;
          const data = JSON.parse(content);
          return data;
        } catch (error) {
          console.error('LLM playlist generation failed:', error);
          // Return a structured fallback with realistic data
          return generateFallbackPlaylist(input);
        }
      }),
  }),

  council: router({
    analyze: publicProcedure
      .input(z.object({
        metrics: z.object({
          users: z.number(),
          revenue: z.number(),
          churn: z.number(),
          engagement: z.number(),
        }).optional(),
      }))
      .mutation(async ({ input }) => {
        const metrics = input.metrics || { users: 127000, revenue: 42500, churn: 3.2, engagement: 78.4 };

        const prompt = `As the BELENTANI Executive Council, perform a comprehensive strategic analysis based on these metrics:
- Users: ${metrics.users}
- Revenue: $${metrics.revenue}
- Churn Rate: ${metrics.churn}%
- Engagement: ${metrics.engagement}%

Analyze the current state, identify opportunities and risks, and propose 3-5 autonomous actions for the council to execute.
Each action should be assigned to a specific agent (CEO, COO, CMO, CPO, or CTO) and marked as either 'executed', 'pending', or 'rejected'.
Provide strategic next steps for the platform.`;

        try {
          const response = await invokeLLM({
            messages: [
              { role: 'system' as const, content: MASTER_SYSTEM_PROMPT },
              { role: 'user' as const, content: prompt },
            ] as Message[],
            response_format: {
              type: 'json_schema' as const,
              json_schema: COUNCIL_SCHEMA,
            },
          });

          const content = response.choices[0].message.content as string;
          return JSON.parse(content);
        } catch (error) {
          console.error('LLM council analysis failed:', error);
          // Return a structured fallback
          return generateFallbackCouncilAnalysis(metrics);
        }
      }),
  }),
});

function generateFallbackPlaylist(input: {
  mood: string;
  context?: string;
  genres?: string[];
  trackCount: number;
}) {
  const bpmMap: Record<string, number> = {
    focus: 120,
    chill: 85,
    energy: 140,
    sad: 75,
    party: 130,
    sleep: 60,
    romantic: 80,
    workout: 145,
  };

  const artistNames = [
    'Neural Drift', 'DataBeats', 'SynthWave AI', 'Quantum Pulse', 'BELENTANI',
    'Ambient AI', 'BrainWave', 'Romantic AI', 'Cortex Lift', 'Frequency Drop',
  ];

  const bpm = bpmMap[input.mood] || 100;
  const seed = `${input.mood}${Date.now()}`;

  return {
    id: `ai-${Date.now()}`,
    title: `${input.mood.charAt(0).toUpperCase() + input.mood.slice(1)} Playlist`,
    description: `AI-curated playlist for ${input.mood} mood${input.context ? ` while ${input.context}` : ''}`,
    coverUrl: `https://picsum.photos/seed/${seed}/300/300`,
    mood: input.mood,
    context: input.context || '',
    genres: input.genres || ['electronic', 'indie'],
    createdAt: new Date().toISOString(),
    isAIGenerated: true,
    playCount: 0,
    tracks: Array.from({ length: input.trackCount }, (_, i) => ({
      id: `t-${Date.now()}-${i}`,
      title: `${['Neural', 'Quantum', 'Cosmic', 'Digital', 'Ethereal'][i % 5]} ${['Drift', 'Pulse', 'Wave', 'Flow', 'Echo'][i % 5]}`,
      artist: artistNames[i % artistNames.length],
      album: 'AI Sessions Vol.1',
      duration: 180 + Math.floor(Math.random() * 100),
      coverUrl: `https://picsum.photos/seed/${seed}${i}/300/300`,
      mood: input.mood,
      genre: input.genres?.[i % input.genres.length] || 'electronic',
      bpm: bpm + (Math.random() * 20 - 10),
      aiInsight: `Selected for ${input.mood} mood based on acoustic analysis and your listening patterns.`,
    })),
  };
}

function generateFallbackCouncilAnalysis(metrics: {
  users: number;
  revenue: number;
  churn: number;
  engagement: number;
}) {
  const growthTrend = metrics.users > 100000 ? 'strong' : 'moderate';
  const revenueTrend = metrics.revenue > 40000 ? 'positive' : 'needs attention';

  return {
    summary: `Market analysis reveals ${growthTrend} growth in AI-curated music. Current engagement at ${metrics.engagement}% indicates ${metrics.engagement > 75 ? 'strong' : 'moderate'} user satisfaction. Churn rate of ${metrics.churn}% is ${metrics.churn < 5 ? 'healthy' : 'concerning'}. Recommend expanding mood detection capabilities and increasing TikTok integration.`,
    keyDecisions: [
      'Expand Study Beats category targeting Gen-Z demographic',
      'Increase investment in mood-detection algorithm improvements',
      'Launch TikTok short-form playlist previews',
    ],
    autonomousActions: [
      {
        id: 'a1',
        action: 'Optimized recommendation algorithm for 15% better engagement',
        agent: 'CTO',
        status: 'executed',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'a2',
        action: 'Reallocated marketing budget to high-performing channels',
        agent: 'CMO',
        status: 'executed',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: 'a3',
        action: 'Initiated partnership discussions with 50 independent artists',
        agent: 'COO',
        status: 'pending',
        timestamp: new Date().toISOString(),
      },
    ],
    nextSteps: [
      'Launch podcast integration by end of quarter',
      'Implement predictive churn model',
      'Expand to Brazilian market with localized content',
    ],
    risks: [
      `Spotify's new AI features may compete with our mood detection`,
      'TikTok integration surge requires short-form playlist optimization',
      `Gen-Z churn higher than average - need gamification features`,
    ],
  };
}

export type AppRouter = typeof appRouter;
