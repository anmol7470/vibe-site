import { project as projectTable } from '@/lib/db/schema'
import { createAnthropic } from '@ai-sdk/anthropic'
import type { UIMessage } from 'ai'
import { convertToModelMessages, generateText } from 'ai'
import { and, eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../init'

export const projectRouter = createTRPCRouter({
  createProject: protectedProcedure.mutation(async ({ ctx }) => {
    const id = nanoid()

    await ctx.db.insert(projectTable).values({
      id,
      name: 'New Project',
      userId: ctx.user.id,
    })

    return id
  }),

  generateProjectName: protectedProcedure
    .input(
      z.object({
        projectId: z.string().min(1),
        apiKey: z.string().min(1),
        userMessage: z.custom<UIMessage>(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const anthropic = createAnthropic({
        apiKey: input.apiKey,
      })

      const result = await generateText({
        model: anthropic('claude-haiku-4-5'),
        messages: convertToModelMessages([input.userMessage]),
      })

      if (result.text.length === 0) {
        return 'New Project' // just return default name if no name generated
      }

      await ctx.db
        .update(projectTable)
        .set({
          name: result.text,
          isNameGenerated: true,
        })
        .where(eq(projectTable.id, input.projectId))

      return result.text
    }),

  getProject: protectedProcedure
    .input(
      z.object({
        projectId: z.string().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const [project] = await ctx.db
        .select()
        .from(projectTable)
        .where(and(eq(projectTable.id, input.projectId), eq(projectTable.userId, ctx.user.id)))
        .limit(1)

      return project
    }),
})
