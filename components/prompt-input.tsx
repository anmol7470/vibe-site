'use client'

import { pathnameAtom, projectIdAtom } from '@/lib/atoms/project-id'
import { cn } from '@/lib/utils'
import type { User } from 'better-auth'
import { useAtom, useAtomValue } from 'jotai'
import { ImagesIcon, SendIcon } from 'lucide-react'
import { nanoid } from 'nanoid'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'

type PromptInputProps = {
  user: User | undefined
  placeholder: string
  className?: string
}

export function PromptInput({ user, placeholder, className }: PromptInputProps) {
  const [prompt, setPrompt] = useState('')
  const router = useRouter()
  const pathname = usePathname()
  const [, setPathname] = useAtom(pathnameAtom)
  const currentProjectId = useAtomValue(projectIdAtom)

  useEffect(() => {
    setPathname(pathname)
  }, [pathname, setPathname])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!prompt.trim()) return

    if (!user) {
      toast.error('Please sign in to submit a prompt')
      return
    }

    // Start a new project
    if (!currentProjectId) {
      const id = nanoid()
      router.push(`/project/${id}`)
    }

    // Submit a prompt to the current project
  }

  return (
    <form onSubmit={handleSubmit} className="bg-input/20 flex flex-col gap-1 rounded-lg border p-3">
      <Textarea
        autoFocus
        placeholder={placeholder}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className={cn(
          'resize-none rounded-none border-0 bg-transparent! p-0 text-sm! shadow-none focus-visible:ring-0',
          className
        )}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
          }
        }}
      />
      <div className="flex justify-between">
        <Button type="button" variant="outline" size="icon-sm">
          <ImagesIcon className="size-4" />
        </Button>
        <Button type="submit" size="icon-sm">
          <SendIcon className="size-4" />
        </Button>
      </div>
    </form>
  )
}
