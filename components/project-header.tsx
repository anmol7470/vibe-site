import type { User } from 'better-auth'
import { PanelLeftIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { ImperativePanelHandle } from 'react-resizable-panels'
import { AuthButton } from './auth-button'
import { ThemeToggle } from './theme-toggle'
import { Button } from './ui/button'

type ProjectHeaderProps = {
  user: User
  isCollapsed: boolean
  panelRef: React.RefObject<ImperativePanelHandle | null>
}

export function ProjectHeader({ user, isCollapsed, panelRef }: ProjectHeaderProps) {
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
        <span className="text-[14.5px] font-medium">My New Project</span>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <AuthButton user={user} />
      </div>
    </header>
  )
}
