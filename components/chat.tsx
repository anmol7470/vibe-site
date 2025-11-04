import { UseChatHelpers } from '@ai-sdk/react'
import type { UIMessage } from 'ai'
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
    <div className="hidden h-full w-full flex-col p-3 md:flex">
      <div className="flex-1">
        {messages.map((message) => {
          return (
            <div key={message.id}>
              {message.parts.map((part, index) => {
                switch (part.type) {
                  case 'text':
                    return <div key={index}>{part.text}</div>
                }
              })}
            </div>
          )
        })}
      </div>
      <PromptInput
        handleSubmit={handleSubmit}
        placeholder="Ask a follow up..."
        className="max-h-30 min-h-15"
        prompt={prompt}
        setPrompt={setPrompt}
        status={status}
      />
    </div>
  )
}
