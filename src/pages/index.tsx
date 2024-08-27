import { Converter } from '@/widgets/converter'
import { Footer } from '@/widgets/footer'

export function HomePage() {
  return (
    <main className='flex flex-col items-center justify-center gap-2 w-full h-full px-8 768px:px-16'>
      <h1 className='gap-3 text-4xl font-semibold text-center'>
        <span>Session ID</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" className='inline mx-2 mb-1.5'><path fill="currentColor" d="M5.825 13L7.7 14.875q.275.3.288.713T7.7 16.3t-.7.3t-.7-.3l-3.6-3.6q-.15-.15-.213-.325T2.426 12t.063-.375t.212-.325l3.6-3.6q.3-.3.7-.3t.7.3t.3.713t-.3.712L5.825 11h12.35L16.3 9.125q-.275-.3-.287-.712T16.3 7.7t.7-.3t.7.3l3.6 3.6q.15.15.213.325t.062.375t-.062.375t-.213.325l-3.6 3.6q-.3.3-.7.3t-.7-.3t-.3-.712t.3-.713L18.175 13z"></path></svg>
        <span>Blinded Session ID</span>
      </h1>
      <Converter />
      <Footer />
    </main>
  )
}