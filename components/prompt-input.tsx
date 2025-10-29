'use client'
import { ChevronDownIcon, SendIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Textarea } from './ui/textarea'

export function PromptInput() {
  const [prompt, setPrompt] = useState('')
  return (
    <form className="bg-input/30 flex flex-col gap-3 rounded-lg border p-3">
      <Textarea
        placeholder="Describe the website you want to build..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="max-h-40 min-h-20 resize-none rounded-none border-0 bg-transparent! p-0 text-sm! shadow-none focus-visible:ring-0"
      />
      <div className="flex justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Connect Convex Project
              <ChevronDownIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
        </DropdownMenu>
        <Button type="submit" size="icon-sm">
          <SendIcon className="size-4" />
        </Button>
      </div>
    </form>
  )
}
