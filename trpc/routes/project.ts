import { projectMessages as projectMessagesTable, project as projectTable } from '@/lib/db/schema'
import { createAnthropic } from '@ai-sdk/anthropic'
import type { UIMessage } from 'ai'
import { convertToModelMessages, generateText } from 'ai'
import { and, desc, eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../init'

export const projectRouter = createTRPCRouter({
  createProject: protectedProcedure
    .input(
      z.object({
        prompt: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const id = nanoid()

      await ctx.db.insert(projectTable).values({
        id,
        name: 'New Project',
        userId: ctx.user.id,
      })

      await ctx.db.insert(projectMessagesTable).values({
        id: nanoid(),
        projectId: id,
        role: 'user',
        parts: [{ type: 'text', text: input.prompt }],
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

      // If no title generated or generation fails then keep default name
      const title = result.text.trim().length > 0 ? result.text : 'New Project'

      await ctx.db
        .update(projectTable)
        .set({
          name: title,
          isNameGenerated: true,
        })
        .where(eq(projectTable.id, input.projectId))

      return title
    }),

  getProject: protectedProcedure
    .input(
      z.object({
        projectId: z.string().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.project.findFirst({
        where: and(eq(projectTable.id, input.projectId), eq(projectTable.userId, ctx.user.id)),
        with: {
          messages: {
            columns: {
              id: true,
              role: true,
              parts: true,
            },
            orderBy: desc(projectMessagesTable.createdAt),
          },
        },
      })
    }),
})
