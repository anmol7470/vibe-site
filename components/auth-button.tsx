'use client'
import { authClient } from '@/lib/auth/client'
import type { User } from 'better-auth'
import { LogOutIcon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'

export function AuthButton({ user }: { user: User | undefined }) {
  const router = useRouter()

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Image
            src={user.image || '/placeholder-avatar.png'}
            alt={user.name || 'User'}
            width={32}
            height={32}
            className="rounded-full"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
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
    )
  }

  return (
    <Button
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
