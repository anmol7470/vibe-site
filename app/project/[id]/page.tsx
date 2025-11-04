import { AppContainer } from '@/components/app-container'
import { getUser } from '@/lib/auth/get-user'
import { api, HydrateClient } from '@/lib/trpc/server'
import { redirect } from 'next/navigation'

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getUser()

  if (!user) {
    redirect('/')
  }

  const project = await api.project.getProject({ projectId: id })

  if (!project) {
    redirect('/')
  }

  return (
    <HydrateClient>
      <AppContainer user={user} project={project} />
    </HydrateClient>
  )
}
