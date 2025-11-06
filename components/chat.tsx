import { cn } from '@/lib/utils'
import type { UseChatHelpers } from '@ai-sdk/react'
import type { UIMessage } from 'ai'
import { Conversation, ConversationContent, ConversationScrollButton } from './ai-elements/conversation'
import { Response } from './ai-elements/response'
import { PromptInput } from './prompt-input'

type ChatProps = {
  prompt: string
  setPrompt: (prompt: string) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  messages: UIMessage[]
  status: UseChatHelpers<UIMessage>['status']
}

export function Chat({ prompt, setPrompt, handleSubmit, messages, status }: ChatProps) {
  return (
    <div className="hidden h-full w-full flex-col md:flex">
      <Conversation className="flex-1">
        <ConversationContent className="space-y-4 text-sm">
          {messages.map((message) => {
            const isUser = message.role === 'user'
            return (
              <div key={message.id} className={cn('flex w-full', isUser ? 'justify-end' : 'justify-start')}>
                <div className={cn('w-fit rounded-lg py-2', isUser && 'bg-blue-400 px-4 text-white')}>
                  {message.parts.map((part, index) => {
                    switch (part.type) {
                      case 'text':
                        return <Response key={index}>{part.text}</Response>
                    }
                  })}
                </div>
              </div>
            )
          })}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <div className="px-3 pb-3">
        <PromptInput
          handleSubmit={handleSubmit}
          placeholder="Ask a follow up..."
          className="max-h-30 min-h-15"
          prompt={prompt}
          setPrompt={setPrompt}
          status={status}
        />
      </div>
    </div>
  )
}
