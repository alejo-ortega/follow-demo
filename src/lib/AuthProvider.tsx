import { useCallback, useEffect, useState } from 'react'

import { AuthContext, type AuthStore } from './AuthContext'
import { CircularProgress } from '@mui/material'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthStore['user']>(null)
  const [status, setStatus] = useState<AuthStore['status']>('LOADING')

  const signIn = useCallback(async (token: string) => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/usuario/ver`,
      { headers: { Authorization: `Bearer ${token}` } },
    )

    if (res.ok) {
      localStorage.setItem('token', token)
      const user = await res.json()
      setUser({ id: user.id, name: `${user.nombre} ${user.apellido}` })
      setStatus('AUTHENTICATED')
    } else {
      setUser(null)
      setStatus('UNAUTHENTICATED')
    }
  }, [])

  const signOut = useCallback(() => {
    localStorage.removeItem('token')
    setUser(null)
    setStatus('UNAUTHENTICATED')
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (token) {
      signIn(token)
    } else {
      setStatus('UNAUTHENTICATED')
    }
  }, [signIn])

  if (status === 'LOADING') {
    return (
      <div className="flex h-screen items-center justify-center">
        <CircularProgress />
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, status, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
