'use client'

import { authClient } from '@/lib/auth/client'
import type { User } from 'better-auth'
import { KeyIcon, LogOutIcon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { ApiKeyDialog } from './api-key-dialog'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'

export function AuthButton({ user }: { user: User | undefined }) {
  const router = useRouter()
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false)

  if (user) {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Image src={user.image || ''} alt={user.name || 'User'} width={30} height={30} className="rounded-full" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsApiKeyDialogOpen(true)}>
              <KeyIcon className="size-4" />
              Configure API Key
            </DropdownMenuItem>
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
