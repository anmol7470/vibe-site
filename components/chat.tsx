import { PromptInput } from './prompt-input'

type ChatProps = {
  prompt: string
  setPrompt: (prompt: string) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export function Chat({ prompt, setPrompt, handleSubmit }: ChatProps) {
  return (
    <div className="hidden h-full w-full flex-col p-3 md:flex">
      <div className="flex-1"></div>
      <PromptInput
        handleSubmit={handleSubmit}
        placeholder="Ask a follow up..."
        className="max-h-30 min-h-15"
        prompt={prompt}
        setPrompt={setPrompt}
      />
    </div>
  )
}
