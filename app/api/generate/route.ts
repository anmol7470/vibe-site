import { api } from '@/lib/trpc/server'
import { createAnthropic } from '@ai-sdk/anthropic'
import { Experimental_Agent as Agent, convertToModelMessages, stepCountIs, UIMessage } from 'ai'

export async function POST(req: Request) {
  const { messages, projectId, isNewProject }: { messages: UIMessage[]; projectId: string; isNewProject: boolean } =
    await req.json()
  const apiKey = req.headers.get('x-api-key')

  if (!apiKey) {
    return new Response('Unauthorized', { status: 401 })
  }

  // Generate project name in the background and send back to client if new project.
  if (isNewProject) {
    api.project.generateProjectName({
      projectId,
      apiKey,
      userMessage: messages[0],
    })
  }

  const anthropic = createAnthropic({
    apiKey,
  })

  const codingAgent = new Agent({
    model: anthropic('claude-sonnet-4-5'),
    // Add tools here.
    stopWhen: stepCountIs(30),
  })

  const result = await codingAgent.stream({
    messages: convertToModelMessages(messages),
  })

  return result.toUIMessageStreamResponse()
}
