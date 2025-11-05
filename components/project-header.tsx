import type { User } from 'better-auth'
import { CopyIcon, PanelLeftIcon, PencilIcon, SettingsIcon, ShareIcon, TrashIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { ImperativePanelHandle } from 'react-resizable-panels'
import { AuthButton } from './auth-button'
import type { Project } from './project-content'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Skeleton } from './ui/skeleton'

type ProjectHeaderProps = {
  user: User
  isCollapsed: boolean
  panelRef: React.RefObject<ImperativePanelHandle | null>
  project: Project
}

export function ProjectHeader({ user, isCollapsed, panelRef, project }: ProjectHeaderProps) {
  return (
    <header className="flex h-12 w-full items-center justify-between px-2">
      <div className="flex items-center gap-2">
        {isCollapsed && (
          <Button variant="outline" size="icon-sm" onClick={() => panelRef.current?.expand(30)}>
            <PanelLeftIcon className="size-4" />
          </Button>
        )}
        <Link href="/" className="transition-opacity hover:opacity-80">
          <Image src="/logo.svg" alt="VibeSite" width={30} height={30} className="rounded-full" />
        </Link>
        {project.isNameGenerated ? (
          <span className="text-[14.5px] font-medium">{project.name}</span>
        ) : (
          <Skeleton className="h-6 w-50" />
        )}
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon-sm">
              <SettingsIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <PencilIcon className="size-4" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CopyIcon className="size-4" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ShareIcon className="size-4" />
              Share
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Image src="/GitHub.svg" alt="GitHub" width={18} height={18} className="dark:invert" />
              Connect GitHub
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Image src="/Convex.svg" alt="Convex" width={18} height={18} />
              Connect Convex
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <TrashIcon className="size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <AuthButton user={user} />
      </div>
    </header>
  )
}
