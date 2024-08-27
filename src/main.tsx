import '@/shared/styles/global.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HomePage } from '@/pages/index'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HomePage />
  </StrictMode>,
)
