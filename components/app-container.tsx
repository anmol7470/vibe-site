'use client'

import { useProjectId } from '@/hooks/use-project-id'
import { apiKeyAtom } from '@/lib/atoms/api-key'
import { api, type RouterOutputs } from '@/lib/trpc/react'
import { useChat } from '@ai-sdk/react'
import { useQueryClient } from '@tanstack/react-query'
import { getQueryKey } from '@trpc/react-query'
import { DefaultChatTransport } from 'ai'
import type { User } from 'better-auth'
import { useAtomValue } from 'jotai'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { HomePage } from './home-page'
import { ProjectContent } from './project-content'

type Project = NonNullable<RouterOutputs['project']['getProject']>

type AppContainerProps = {
  user: User | undefined
  serverProjectId: string
}

export function AppContainer({ user, serverProjectId }: AppContainerProps) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const apiKey = useAtomValue(apiKeyAtom)
  const projectId = useProjectId()

  // Use serverProjectId if it exists (viewing existing project), otherwise use projectId (creating new project)
  const activeProjectId = serverProjectId || projectId
  const projectKey = getQueryKey(api.project.getProject, { projectId: activeProjectId }, 'query')

  // Local state to track whether to show ProjectContent (preserves state during transitions)
  const [isProjectMode, setIsProjectMode] = useState(() => {
    return !!serverProjectId
  })

  const {
    data: project,
    isLoading: isLoadingProject,
    isError: isErrorProject,
  } = api.project.getProject.useQuery(
    { projectId: serverProjectId },
    {
      enabled: !!serverProjectId,
    }
  )

  useEffect(() => {
    if (isErrorProject) {
      toast.error(`Failed to load project ${serverProjectId}`)
      router.push('/')
    }
  }, [isErrorProject, router, serverProjectId])

  const [prompt, setPrompt] = useState('')

  const { messages, sendMessage, status, setMessages } = useChat({
    id: projectId,
    transport: new DefaultChatTransport({
      api: '/api/generate',
    }),
    onError: (error) => {
      const errorData = JSON.parse(error.message)
      toast.error(errorData.error || error.message)
    },
    onData: (dataPart) => {
      console.log('dataPart', dataPart)
      console.log('projectKey', projectKey)
      console.log('projectId', projectId)
      console.log('serverProjectId', serverProjectId)
      console.log('activeProjectId', activeProjectId)

      // Update project name in the UI once generated and it comes through in the stream.
      if (dataPart.type === 'data-project-name') {
        queryClient.setQueryData<Project>(projectKey, (old) => {
          if (!old) return old
          return {
            ...old,
            name: dataPart.data as string,
            isNameGenerated: true,
          }
        })
      }
    },
  })

  useEffect(() => {
    if (project) {
      setMessages(project.messages)
    }
  }, [project, setMessages])

  const handleCreateNewProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!user) {
      toast.error('Please sign in to submit a prompt')
      return
    }

    if (!apiKey) {
      toast.error('No API key set')
      return
    }

    // Set query cache
    queryClient.setQueryData<Project>(projectKey, {
      id: projectId,
      name: 'New Project',
      isNameGenerated: false,
      userId: user?.id || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      messages,
    })
    window.history.pushState(null, '', `/project/${projectId}`)
    setIsProjectMode(true)

    sendMessage(
      {
        text: prompt,
      },
      {
        body: {
          projectId,
          isNewProject: true,
        },
        headers: {
          'x-api-key': apiKey,
        },
      }
    )
    setPrompt('')
  }

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    sendMessage(
      { text: prompt },
      {
        body: {
          projectId,
          isNewProject: false,
        },
        headers: {
          'x-api-key': apiKey,
        },
      }
    )
    setPrompt('')
  }

  if (isProjectMode && user && !isErrorProject) {
    return (
      <ProjectContent
        user={user}
        project={project}
        isLoadingProject={isLoadingProject}
        prompt={prompt}
        setPrompt={setPrompt}
        messages={messages}
        status={status}
        handleSubmit={handleSendMessage}
      />
    )
  }

  return <HomePage user={user} prompt={prompt} setPrompt={setPrompt} handleSubmit={handleCreateNewProject} />
}
