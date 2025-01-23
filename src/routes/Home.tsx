import { Button } from '@mui/material'

import { useAuth } from '../lib/useAuth'
import { App } from './App'
import { Link } from 'react-router-dom'

export function Home() {
  const { status } = useAuth()

  if (status === 'UNAUTHENTICATED') {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 p-4">
        <p className="font-mono text-xl text-neutral-400">
          No has iniciado sesión :(
        </p>

        <Button component={Link} to="/sign-in" variant="contained">
          Iniciar sesión
        </Button>
      </div>
    )
  }

  if (status === 'AUTHENTICATED') {
    return <App />
  }
}
