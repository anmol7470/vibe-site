'use client'

import { AuthButton } from '@/components/auth-button'
import { PromptInput } from '@/components/prompt-input'
import { ThemeToggle } from '@/components/theme-toggle'
import { api } from '@/lib/trpc/react'
import type { User } from 'better-auth'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

export function HomePage({ user }: { user: User | undefined }) {
  const router = useRouter()
  const createProject = api.project.createProject.useMutation()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!user) {
      toast.error('Please sign in to submit a prompt')
      return
    }

    toast
      .promise(createProject.mutateAsync(), {
        loading: 'Creating project...',
        success: 'Project created successfully',
        error: 'Failed to create project',
      })
      .then((id) => {
        router.push(`/project/${id}`)
      })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 w-full border-b px-4">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="VibeSite" width={30} height={30} className="rounded-full" />
            <h1 className="text-xl font-semibold">VibeSite</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <AuthButton user={user} />
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4">
        <div className="w-full max-w-3xl space-y-10">
          <div className="space-y-2 text-center">
            <h2 className="text-4xl font-bold tracking-tight">What do you want to create?</h2>
            <p className="text-muted-foreground text-md">Start building with a single prompt. No coding required.</p>
          </div>
          <PromptInput
            placeholder="Describe the website you want to build..."
            className="max-h-40 min-h-20"
            handleSubmit={handleSubmit}
          />
        </div>
      </main>
    </div>
  )
}
