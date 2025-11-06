import { AppContainer } from '@/components/app-container'
import { getUser } from '@/lib/auth/get-user'

export default async function Home() {
  const user = await getUser()

  return <AppContainer user={user} serverProjectId="" />
}
