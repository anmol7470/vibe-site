import { AuthButton } from '@/components/auth-button'
import { PromptInput } from '@/components/prompt-input'
import { ThemeToggle } from '@/components/theme-toggle'
import { getUser } from '@/lib/auth/get-user'
import { SparklesIcon } from 'lucide-react'

export default async function Home() {
  const user = await getUser()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 w-full border-b px-4">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <SparklesIcon className="size-5" />
            <h1 className="text-xl font-semibold">VibeSite</h1>
          </div>
          <div className="flex items-center gap-2">
            <AuthButton user={user} />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4">
        <div className="w-full max-w-3xl space-y-10">
          <div className="space-y-2 text-center">
            <h2 className="text-4xl font-bold tracking-tight">What do you want to create?</h2>
            <p className="text-muted-foreground text-md">
              Connect a Convex project, and start building with a single prompt. No coding required.
            </p>
          </div>
          <PromptInput user={user} />
        </div>
      </main>
    </div>
  )
}
