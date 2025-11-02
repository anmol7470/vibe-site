'use client'

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { RouterOutputs } from '@/lib/trpc/react'
import type { User } from 'better-auth'
import { useRef, useState } from 'react'
import type { ImperativePanelHandle } from 'react-resizable-panels'
import { WebPreview, WebPreviewBody, WebPreviewNavigation, WebPreviewUrl } from './ai-elements/web-preview'
import { Chat } from './chat'
import { ProjectHeader } from './project-header'

type Project = RouterOutputs['project']['getProject']

export function ProjectContent({ user, project }: { user: User; project: Project }) {
  console.log('project', project)
  const panelRef = useRef<ImperativePanelHandle>(null)
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <main className="flex h-screen flex-col">
      <ProjectHeader user={user} isCollapsed={isCollapsed} panelRef={panelRef} />
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
          <Chat />
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
