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

export async function POST(req: Request) {
  const { messages, projectId, isNewProject }: { messages: UIMessage[]; projectId: string; isNewProject: boolean } =
    await req.json()
  const apiKey = req.headers.get('x-api-key')

  if (!apiKey) {
    return new Response('Unauthorized', { status: 401 })
  }

  const anthropic = createAnthropic({
    apiKey,
  })

  const stream = createUIMessageStream<UIMessage>({
    execute: async ({ writer }) => {
      // Generate project name in the background and send back to client if new project.
      let name = 'New Project'
      if (isNewProject) {
        api.project
          .generateProjectName({
            projectId,
            apiKey,
            userMessage: messages[0],
          })
          .then((n) => {
            name = n
          })
          .catch((error) => {
            console.error('Error generating project name', error)
          })
      }

      const result = streamText({
        model: anthropic('claude-sonnet-4-5'),
        stopWhen: stepCountIs(30),
        messages: convertToModelMessages(messages),
      })

      if (isNewProject && name !== 'New Project') {
        writer.write({
          type: 'data-project-name',
          data: name,
          transient: true,
        })
      }

      writer.merge(result.toUIMessageStream())
    },
  })

  return createUIMessageStreamResponse({ stream })
}
