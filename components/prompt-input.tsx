'use client'
import type { User } from 'better-auth'
import { SendIcon } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { ConnectConvexPopover } from './connect-convex-popover'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'

export function PromptInput({ user }: { user: User | undefined }) {
  const [prompt, setPrompt] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!user) {
      toast.error('Please sign in to submit a prompt')
      return
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-input/30 flex flex-col gap-3 rounded-lg border p-3">
      <Textarea
        autoFocus
        placeholder="Describe the website you want to build..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="max-h-40 min-h-20 resize-none rounded-none border-0 bg-transparent! p-0 text-sm! shadow-none focus-visible:ring-0"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
          }
        }}
      />
      <div className="flex justify-between">
        <ConnectConvexPopover />
        <Button type="submit" size="icon-sm">
          <SendIcon className="size-4" />
        </Button>
      </div>
    </form>
  )
}
