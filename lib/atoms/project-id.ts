import { atom } from 'jotai'

export const pathnameAtom = atom<string>('')

export const projectIdAtom = atom((get) => {
  const pathname = get(pathnameAtom)
  const match = pathname.match(/^\/project\/([^/]+)/)
  return match?.[1]
})
