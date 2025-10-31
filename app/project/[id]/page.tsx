import { ProjectContent } from '@/components/project-content'
import { getUser } from '@/lib/auth/get-user'
import { redirect } from 'next/navigation'

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getUser()

  if (!user) {
    redirect('/')
  }

  return <ProjectContent user={user} />
}
