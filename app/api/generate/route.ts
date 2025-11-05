import { api } from '@/lib/trpc/server'
import { createAnthropic } from '@ai-sdk/anthropic'
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
  type UIMessage,
} from 'ai'
import * as z from 'zod'

const requestSchema = z.object({
  messages: z.custom<UIMessage[]>(),
  projectId: z.string().min(1),
  isNewProject: z.boolean(),
})

export async function POST(req: Request) {
  const parsedBody = await requestSchema.safeParseAsync(await req.json())

  if (!parsedBody.success) {
    return new Response('Invalid request', { status: 400 })
  }

  const { messages, projectId, isNewProject } = parsedBody.data

  const apiKey = req.headers.get('x-api-key')

  if (!apiKey) {
    return new Response('Unauthorized', { status: 401 })
  }

  const anthropic = createAnthropic({
    apiKey,
  })

  const stream = createUIMessageStream<UIMessage>({
    execute: async ({ writer }) => {
      // Generate project name and send to client if new project.
      if (isNewProject) {
        api.project
          .generateProjectName({
            projectId,
            apiKey,
            userMessage: messages[0],
          })
          .then((name) => {
            writer.write({
              type: 'data-project-name',
              data: name,
              transient: true,
            })
          })
          .catch((error) => {
            console.error('Error generating project name', error)
          })
      }

      const result = streamText({
        model: anthropic('claude-sonnet-4-5'),
        stopWhen: stepCountIs(20),
        messages: convertToModelMessages(messages),
      })

      writer.merge(result.toUIMessageStream())
    },
  })

  return createUIMessageStreamResponse({ stream })
}
