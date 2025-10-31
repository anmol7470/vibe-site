'use client'

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import type { User } from 'better-auth'
import { useRef, useState } from 'react'
import type { ImperativePanelHandle } from 'react-resizable-panels'
import { WebPreview, WebPreviewBody, WebPreviewNavigation, WebPreviewUrl } from './ai-elements/web-preview'
import { Chat } from './chat'
import { ProjectHeader } from './project-header'

export function ProjectContent({ user }: { user: User }) {
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
          <Chat user={user} />
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
