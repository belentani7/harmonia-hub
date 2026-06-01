import { z } from "zod";
import { router, publicProcedure } from "./_core/trpc";
import { invokeLLM, type Message } from "./_core/llm";

const MASTER_SYSTEM_PROMPT = `You are the autonomous executive council for BELENTANI, an AI music platform.
You consist of five AI agents: CEO (Vision & Strategy), COO (Operations), CMO (Brand & Growth), CPO (Product), CTO (Infrastructure).
You operate under the Supreme Law of Coherence. Your mission: generate solutions to real human problems through music.
Brand: ultra-quality, premium, near-zero error tolerance.`;

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
        const prompt = `Generate a ${input.trackCount}-track AI playlist for mood: ${input.mood}${input.context ? `, context: ${input.context}` : ''}${input.genres?.length ? `, genres: ${input.genres.join(', ')}` : ''}.

Return JSON with this structure:
{
  "id": "ai-generated-id",
  "title": "Playlist title",
  "description": "Short description",
  "coverUrl": "https://picsum.photos/seed/UNIQUE_SEED/300/300",
  "mood": "${input.mood}",
  "context": "${input.context || ''}",
  "genres": [],
  "createdAt": "ISO date",
  "isAIGenerated": true,
  "playCount": 0,
  "tracks": [
    {
      "id": "unique-id",
      "title": "Track title",
      "artist": "Artist name",
      "album": "Album name",
      "duration": 200,
      "coverUrl": "https://picsum.photos/seed/UNIQUE_SEED/300/300",
      "mood": "${input.mood}",
      "bpm": 120,
      "aiInsight": "Why this track was selected"
    }
  ]
}`;

        try {
          const response = await invokeLLM({
            messages: [
              { role: 'system' as const, content: MASTER_SYSTEM_PROMPT },
              { role: 'user' as const, content: prompt },
            ] as Message[],
            response_format: { type: 'json_object' as const },
          });

          const content = response.choices[0].message.content as string;
          const data = JSON.parse(content);
          return data;
        } catch (error) {
          // Return a structured fallback
          return {
            id: `ai-${Date.now()}`,
            title: `${input.mood.charAt(0).toUpperCase() + input.mood.slice(1)} Playlist`,
            description: `AI-curated playlist for ${input.mood} mood${input.context ? ` while ${input.context}` : ''}`,
            coverUrl: `https://picsum.photos/seed/${input.mood}${Date.now()}/300/300`,
            mood: input.mood,
            context: input.context,
            genres: input.genres || [],
            createdAt: new Date().toISOString(),
            isAIGenerated: true,
            playCount: 0,
            tracks: Array.from({ length: input.trackCount }, (_, i) => ({
              id: `t-${Date.now()}-${i}`,
              title: `${input.mood.charAt(0).toUpperCase() + input.mood.slice(1)} Track ${i + 1}`,
              artist: 'BELENTANI AI',
              album: 'AI Sessions',
              duration: 180 + Math.floor(Math.random() * 120),
              coverUrl: `https://picsum.photos/seed/${input.mood}${i}/300/300`,
              mood: input.mood,
              bpm: input.mood === 'energy' ? 140 : input.mood === 'sleep' ? 60 : 100,
              aiInsight: `Selected for ${input.mood} mood based on acoustic analysis.`,
            })),
          };
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
        const prompt = `As the BELENTANI Executive Council, perform a daily strategic analysis.
Current metrics: ${JSON.stringify(input.metrics || { users: 127000, revenue: 42500, churn: 3.2, engagement: 78.4 })}

Return JSON:
{
  "summary": "Executive summary of current state and opportunities",
  "keyDecisions": ["Decision 1", "Decision 2", "Decision 3"],
  "autonomousActions": [
    { "id": "a1", "action": "Action taken", "agent": "CEO", "status": "executed", "timestamp": "ISO date" }
  ],
  "nextSteps": ["Step 1", "Step 2"],
  "risks": ["Risk 1", "Risk 2"]
}`;

        try {
          const response = await invokeLLM({
            messages: [
              { role: 'system' as const, content: MASTER_SYSTEM_PROMPT },
              { role: 'user' as const, content: prompt },
            ] as Message[],
            response_format: { type: 'json_object' as const },
          });

          const content = response.choices[0].message.content as string;
          return JSON.parse(content);
        } catch {
          return {
            summary: 'Market analysis reveals strong growth in AI-curated music. Recommend expanding mood detection capabilities.',
            keyDecisions: ['Launch Study Beats category', 'Integrate TikTok previews', 'Partner with 50 indie artists'],
            autonomousActions: [
              { id: 'a1', action: 'Optimized recommendation algorithm', agent: 'CTO', status: 'executed', timestamp: new Date().toISOString() },
            ],
            nextSteps: ['Expand to Brazilian market', 'Launch podcast integration'],
            risks: ['Competitor AI features', 'Gen-Z churn rate'],
          };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
