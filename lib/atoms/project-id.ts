import { atom } from 'jotai'
import { nanoid } from 'nanoid'

export const projectIdAtom = atom<string>(nanoid())
