import '@fontsource/roboto/400.css'
import '@fontsource/roboto/700.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './lib/AuthProvider'
import { Home } from './routes/Home'
import { SignIn } from './routes/SignIn'
import './tailwind.css'

const rootElement = document.getElementById('root') as HTMLElement

const browserRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/sign-in',
    element: <SignIn />,
  },
])

const queryClient = new QueryClient()

createRoot(rootElement).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={browserRouter} />
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>,
)
