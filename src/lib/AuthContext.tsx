import { createContext } from 'react'

interface User {
  id: string
  name: string
}

export interface AuthStore {
  user: User | null
  status: 'LOADING' | 'AUTHENTICATED' | 'UNAUTHENTICATED'
  signIn: (token: string) => Promise<void>
  signOut: () => void
}

export const AuthContext = createContext({} as AuthStore)
