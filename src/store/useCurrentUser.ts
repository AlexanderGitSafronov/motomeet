import type { Rider } from '@/data/types'
import { useAppStore } from './useAppStore'

/** The signed-in user (from the API after login, or the seed user offline). */
export function useCurrentUser(): Rider {
  return useAppStore((s) => s.currentUser)
}
