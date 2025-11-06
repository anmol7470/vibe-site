'use client'

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import type { RouterOutputs } from '@/lib/trpc/react'
import type { UseChatHelpers } from '@ai-sdk/react'
import type { UIMessage } from 'ai'
import type { User } from 'better-auth'
import { useRef, useState } from 'react'
import type { ImperativePanelHandle } from 'react-resizable-panels'
import { WebPreview, WebPreviewBody, WebPreviewNavigation, WebPreviewUrl } from './ai-elements/web-preview'
import { Chat } from './chat'
import { ProjectHeader } from './project-header'

export type Project = NonNullable<RouterOutputs['project']['getProject']>

type ProjectContentProps = {
  user: User
  project: Project | undefined
  isLoadingProject: boolean
  prompt: string
  setPrompt: (prompt: string) => void
  messages: UIMessage[]
  status: UseChatHelpers<UIMessage>['status']
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export function ProjectContent({
  user,
  project,
  isLoadingProject,
  prompt,
  setPrompt,
  messages,
  status,
  handleSubmit,
}: ProjectContentProps) {
  const panelRef = useRef<ImperativePanelHandle>(null)
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <main className="flex h-screen flex-col">
      <ProjectHeader
        user={user}
        isCollapsed={isCollapsed}
        panelRef={panelRef}
        project={project}
        isLoadingProject={isLoadingProject}
      />
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
          <Chat
            prompt={prompt}
            setPrompt={setPrompt}
            handleSubmit={handleSubmit}
            messages={messages}
            status={status}
            isLoadingProject={isLoadingProject}
          />
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
