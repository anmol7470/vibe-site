import { generateProjectNamePrompt } from '@/lib/ai/prompts'
import { projectMessages as projectMessagesTable, project as projectTable } from '@/lib/db/schema'
import { createAnthropic } from '@ai-sdk/anthropic'
import type { UIMessage } from 'ai'
import { convertToModelMessages, generateText } from 'ai'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../init'

export const projectRouter = createTRPCRouter({
  createProject: protectedProcedure
    .input(
      z.object({
        newProjectId: z.string().min(1),
        userMessage: z.custom<UIMessage>(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(projectTable).values({
        id: input.newProjectId,
        name: 'New Project',
        userId: ctx.user.id,
      })

      await ctx.db.insert(projectMessagesTable).values({
        projectId: input.newProjectId,
        id: input.userMessage.id,
        role: input.userMessage.role,
        parts: input.userMessage.parts,
      })
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
        system: generateProjectNamePrompt,
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
          },
        },
      })
    }),

  saveMessages: protectedProcedure
    .input(
      z.object({
        projectId: z.string().min(1),
        messages: z.custom<UIMessage[]>(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .insert(projectMessagesTable)
        .values(
          input.messages.map((message) => ({
            projectId: input.projectId,
            id: message.id,
            role: message.role,
            parts: message.parts,
          }))
        )
        .onConflictDoNothing()
    }),
})
