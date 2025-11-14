'use client'

import { authClient } from '@/lib/auth/client'
import type { User } from 'better-auth'
import { KeyIcon, LogOutIcon, MonitorIcon, MoonIcon, SunIcon, SunMoonIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { ApiKeyDialog } from './api-key-dialog'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export function AuthButton({ user }: { user: User | undefined }) {
  const router = useRouter()
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { setTheme } = useTheme()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  if (user) {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Image
              src={user.image || ''}
              alt={user.name || 'User'}
              width={30}
              height={30}
              className="cursor-pointer rounded-full"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm leading-none font-medium">{user.name}</p>
                <p className="text-muted-foreground text-xs leading-none">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setIsApiKeyDialogOpen(true)}>
              <KeyIcon className="size-4" />
              Configure API Key
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <SunMoonIcon className="size-4" />
                Toggle theme
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  <SunIcon className="size-4" />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  <MoonIcon className="size-4" />
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                  <MonitorIcon className="size-4" />
                  System
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                await authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      router.push('/')
                    },
                    onError: ({ error }) => {
                      toast.error(error.message)
                    },
                  },
                })
              }}
            >
              <LogOutIcon className="size-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ApiKeyDialog open={isApiKeyDialogOpen} onOpenChange={setIsApiKeyDialogOpen} />
      </>
    )
  }

  return (
    <Button
      size="sm"
      onClick={async () => {
        await authClient.signIn.social({
          provider: 'google',
          fetchOptions: {
            onError: ({ error }) => {
              toast.error(error.message)
            },
          },
        })
      }}
    >
      Sign in
    </Button>
  )
}
