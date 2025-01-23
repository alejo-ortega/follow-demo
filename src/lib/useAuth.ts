import { useContext } from 'react'
import { AuthContext } from './AuthContext'

export function useAuth() {
  const context = useContext(AuthContext)

  if (typeof context === 'undefined') {
    throw new Error('useAuth must be used within a AuthProvider')
  }

  return context
}
