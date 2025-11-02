import { PromptInput } from './prompt-input'

export function Chat() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  return (
    <div className="hidden h-full w-full flex-col p-3 md:flex">
      <div className="flex-1"></div>
      <PromptInput handleSubmit={handleSubmit} placeholder="Ask a follow up..." className="max-h-30 min-h-15" />
    </div>
  )
}
