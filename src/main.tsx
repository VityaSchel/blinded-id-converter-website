import '@/shared/styles/global.css'
import React, { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { HomePage } from '@/pages/index'

const SodiumLoader = React.lazy(async () => {
  const sodium = await import('libsodium-wrappers-sumo')
  await sodium.ready

  return {
    default: ({ children }: React.PropsWithChildren) => children
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={null}>
      <SodiumLoader>
        <HomePage />
      </SodiumLoader>
    </Suspense>
  </StrictMode>,
)