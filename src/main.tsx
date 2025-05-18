import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {UserProvider} from './context/UserContext.tsx'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './hooks/api.ts'
import { Home } from './components/home/Home.test.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <Home />
      </UserProvider>
    </QueryClientProvider>
  </StrictMode>,
)
