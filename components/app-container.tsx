'use client'

import { apiKeyAtom } from '@/lib/atoms/api-key'
import { projectIdAtom } from '@/lib/atoms/project-id'
import { RouterOutputs } from '@/lib/trpc/react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import type { User } from 'better-auth'
import { useAtomValue, useSetAtom } from 'jotai'
import { nanoid } from 'nanoid'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { HomePage } from './home-page'
import { ProjectContent } from './project-content'

type Project = NonNullable<RouterOutputs['project']['getProject']>

type AppContainerProps = {
  user: User | undefined
  project?: Project
}

export function AppContainer({ user, project }: AppContainerProps) {
  const pathname = usePathname()
  const apiKey = useAtomValue(apiKeyAtom)
  const setProjectId = useSetAtom(projectIdAtom)
  const [prompt, setPrompt] = useState('')

  // Derive projectId from pathname (e.g., /project/abc123 -> abc123)
  const projectIdFromPathname = pathname.startsWith('/project/') ? pathname.split('/project/')[1]?.split('/')[0] : null

  const [chatId] = useState(() => projectIdFromPathname || nanoid())

  // Set the projectId atom based on pathname-derived projectId or generate a new one
  useEffect(() => {
    setProjectId(chatId)
  }, [chatId, setProjectId])

  const { messages, sendMessage, status } = useChat({
    id: chatId,
    messages: project?.messages || [],
    transport: new DefaultChatTransport({
      api: '/api/generate',
      headers: () => ({
        'x-api-key': apiKey,
      }),
    }),
  })

  // If we have a project, show ProjectContent, otherwise show HomePage
  if (project && user) {
    return <ProjectContent user={user} project={project} prompt={prompt} setPrompt={setPrompt} />
  }

  return <HomePage user={user} prompt={prompt} setPrompt={setPrompt} sendMessage={sendMessage} />
}
