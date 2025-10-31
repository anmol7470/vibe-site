import type { User } from 'better-auth'
import { PromptInput } from './prompt-input'

export function Chat({ user }: { user: User }) {
  return (
    <div className="hidden h-full w-full flex-col p-3 md:flex">
      <div className="flex-1"></div>
      <PromptInput user={user} placeholder="Ask a follow up..." className="max-h-30 min-h-15" />
    </div>
  )
}
