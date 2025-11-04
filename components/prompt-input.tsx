'use client'

import { cn } from '@/lib/utils'
import { UseChatHelpers } from '@ai-sdk/react'
import type { UIMessage } from 'ai'
import { BoxIcon, ImagesIcon, SendIcon } from 'lucide-react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

type PromptInputProps = {
  placeholder: string
  className?: string
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  prompt: string
  setPrompt: (prompt: string) => void
  status?: UseChatHelpers<UIMessage>['status']
}

export function PromptInput({ placeholder, className, handleSubmit, prompt, setPrompt, status }: PromptInputProps) {
  const isStreaming = status === 'streaming' || status === 'submitted'

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
        <Tooltip>
          <TooltipTrigger asChild>
            <Button type="button" variant="outline" size="icon-sm">
              <ImagesIcon className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add images to your prompt</TooltipContent>
        </Tooltip>
        <Button type="submit" size="icon-sm" disabled={isStreaming}>
          {isStreaming ? <BoxIcon className="size-4" /> : <SendIcon className="size-4" />}
        </Button>
      </div>
    </form>
  )
}
