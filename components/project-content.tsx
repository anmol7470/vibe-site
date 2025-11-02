'use client'

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { apiKeyAtom } from '@/lib/atoms/api-key'
import { RouterOutputs } from '@/lib/trpc/react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import type { User } from 'better-auth'
import { useAtomValue } from 'jotai'
import { useRef, useState } from 'react'
import type { ImperativePanelHandle } from 'react-resizable-panels'
import { WebPreview, WebPreviewBody, WebPreviewNavigation, WebPreviewUrl } from './ai-elements/web-preview'
import { Chat } from './chat'
import { ProjectHeader } from './project-header'

export type Project = NonNullable<RouterOutputs['project']['getProject']>

export function ProjectContent({ user, project }: { user: User; project: Project }) {
  const apiKey = useAtomValue(apiKeyAtom)
  const panelRef = useRef<ImperativePanelHandle>(null)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [prompt, setPrompt] = useState('')

  const { messages, sendMessage, status } = useChat({
    id: project.id,
    messages: project.messages,
    transport: new DefaultChatTransport({
      api: '/api/generate',
      headers: () => ({
        'x-api-key': apiKey,
      }),
    }),
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  return (
    <main className="flex h-screen flex-col">
      <ProjectHeader user={user} isCollapsed={isCollapsed} panelRef={panelRef} project={project} />
      <ResizablePanelGroup direction="horizontal" className="w-full flex-1">
        <ResizablePanel
          ref={panelRef}
          defaultSize={30}
          minSize={15}
          maxSize={50}
          collapsible
          onCollapse={() => setIsCollapsed(true)}
          onExpand={() => setIsCollapsed(false)}
          className="hidden md:flex"
        >
          <Chat prompt={prompt} setPrompt={setPrompt} handleSubmit={handleSubmit} />
        </ResizablePanel>
        <ResizableHandle className="hidden md:flex" />
        <ResizablePanel defaultSize={70}>
          <WebPreview className="h-full w-full" defaultUrl="https://ai-sdk.dev">
            <WebPreviewNavigation>
              <WebPreviewUrl src="https://ai-sdk.dev" />
            </WebPreviewNavigation>
            <WebPreviewBody src="https://ai-sdk.dev" />
          </WebPreview>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  )
}
