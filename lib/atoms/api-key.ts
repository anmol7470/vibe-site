import { atomWithStorage } from 'jotai/utils'

export const apiKeyAtom = atomWithStorage<string>('ANTHROPIC_API_KEY', '')
