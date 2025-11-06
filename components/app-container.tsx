'use client'

import { useProjectId } from '@/hooks/use-project-id'
import { apiKeyAtom } from '@/lib/atoms/api-key'
import { api, type RouterOutputs } from '@/lib/trpc/react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import type { User } from 'better-auth'
import { useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { HomePage } from './home-page'
import { ProjectContent } from './project-content'

type Project = NonNullable<RouterOutputs['project']['getProject']>

type AppContainerProps = {
  user: User | undefined
  project?: Project
}

export function AppContainer({ user, project }: AppContainerProps) {
  const apiKey = useAtomValue(apiKeyAtom)
  const projectId = useProjectId()

  // Local state to track whether to show ProjectContent (preserves state during transitions)
  const [isProjectMode, setIsProjectMode] = useState(() => {
    // Initialize based on whether we have a project from server OR pathname indicates project route
    return !!(project || projectId)
  })

  const [currentProject, setCurrentProject] = useState<Project | null>(project || null)

  useEffect(() => {
    if (project) {
      setCurrentProject(project)
    }
  }, [project])

  const [prompt, setPrompt] = useState('')

  const { messages, sendMessage, status } = useChat({
    id: projectId,
    messages: project?.messages || [],
    transport: new DefaultChatTransport({
      api: '/api/generate',
    }),
    onError: (error) => {
      const errorData = JSON.parse(error.message)
      toast.error(errorData.error || error.message)
    },
    onData: (dataPart) => {
      // Update project name in the UI once generated and it comes through in the stream.
      if (dataPart.type === 'data-project-name') {
        setCurrentProject((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            name: dataPart.data as string,
            isNameGenerated: true,
          }
        })
      }
    },
  })

  const createProject = api.project.createProject.useMutation()

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

    toast
      .promise(createProject.mutateAsync({ newProjectId: projectId, prompt }), {
        loading: 'Creating project...',
        success: 'Project created successfully',
        error: 'Failed to create project',
      })
      .then(() => {
        const newProject: Project = {
          id: projectId,
          name: 'New Project',
          isNameGenerated: false,
          userId: user?.id || '',
          createdAt: new Date(),
          updatedAt: new Date(),
          messages,
        }

        setCurrentProject(newProject)
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
      })
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

  // Show ProjectContent if we're in project mode and have a user
  if (isProjectMode && user) {
    if (!currentProject) {
      // Fallback: if somehow we're in project mode but have no project, return to HomePage
      return <HomePage user={user} prompt={prompt} setPrompt={setPrompt} handleSubmit={handleCreateNewProject} />
    }
    return (
      <ProjectContent
        user={user}
        project={currentProject}
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
