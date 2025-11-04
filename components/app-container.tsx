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
  const setProjectIdAtom = useSetAtom(projectIdAtom)
  const [prompt, setPrompt] = useState('')

  // Derive projectId from pathname (e.g., /project/abc123 -> abc123)
  const urlProjectId = pathname.split('/project/')[1] ?? ''

  const [projectId, setProjectId] = useState(() => urlProjectId || nanoid())

  // Local state to track whether to show ProjectContent (preserves state during transitions)
  const [isProjectMode, setIsProjectMode] = useState(() => {
    // Initialize based on whether we have a project from server OR pathname indicates project route
    return !!(project || urlProjectId)
  })

  // Temporary project object for when we create a new project (before server refetch)
  const [tempProject, setTempProject] = useState<Project | null>(null)

  // Update projectId when URL changes
  useEffect(() => {
    if (urlProjectId) {
      // Navigating to an existing project
      setProjectId(urlProjectId)
    } else {
      // Navigating to home
      const newId = nanoid()
      setProjectId(newId)
    }
  }, [urlProjectId])

  // Set the projectId atom based on projectId
  useEffect(() => {
    setProjectIdAtom(projectId)
  }, [projectId, setProjectIdAtom])

  const { messages, sendMessage, status } = useChat({
    id: projectId,
    messages: project?.messages || [],
    transport: new DefaultChatTransport({
      api: '/api/generate',
      headers: () => ({
        'x-api-key': apiKey,
      }),
    }),
  })

  const switchToProjectMode = (newProjectId: string) => {
    const newTempProject: Project = {
      id: newProjectId,
      name: 'New Project',
      isNameGenerated: false,
      userId: user?.id || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [],
    }

    setTempProject(newTempProject)
    window.history.pushState(null, '', `/project/${newProjectId}`)
    setIsProjectMode(true)

    sendMessage({
      text: prompt,
    })
    setPrompt('')
  }

  // Show ProjectContent if we're in project mode and have a user
  if (isProjectMode && user) {
    // Use the actual project from server if available, otherwise use temp project
    const currentProject = project || tempProject
    if (!currentProject) {
      // Fallback: if somehow we're in project mode but have no project, return to HomePage
      return <HomePage user={user} prompt={prompt} setPrompt={setPrompt} onProjectCreated={switchToProjectMode} />
    }
    return <ProjectContent user={user} project={currentProject} prompt={prompt} setPrompt={setPrompt} />
  }

  return <HomePage user={user} prompt={prompt} setPrompt={setPrompt} onProjectCreated={switchToProjectMode} />
}
