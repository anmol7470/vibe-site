import { HomePage } from '@/components/home-page'
import { getUser } from '@/lib/auth/get-user'

export default async function Home() {
  const user = await getUser()

  return <HomePage user={user} />
}
