import '@/shared/styles/global.css'
import React, { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { HomePage } from '@/pages/index'
import sodium from 'libsodium-wrappers-sumo'

function SodiumLoader({ children }: React.PropsWithChildren) {
  const [sodiumLoaded, setSodiumLoaded] = React.useState(false)

  React.useEffect(() => {
    sodium.ready
      .then(() => setSodiumLoaded(true))
  }, [])

  return sodiumLoaded ? children : null
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={null}>
      <SodiumLoader>
        <HomePage />
      </SodiumLoader>
    </Suspense>
  </StrictMode>,
)