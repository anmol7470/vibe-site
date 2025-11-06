import { nanoid } from 'nanoid'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export function useProjectId() {
  const pathname = usePathname()
  const urlProjectId = pathname.split('/project/')[1] ?? ''
  const [projectId, setProjectId] = useState(() => urlProjectId || nanoid())

  // Update projectId when URL changes
  useEffect(() => {
    if (urlProjectId) {
      // Navigating to an existing project
      setProjectId(urlProjectId)
    } else {
      // Navigating to home
      const newId = nanoid()
      setProjectId(newId)
    }
  }, [urlProjectId])

  return projectId
}
