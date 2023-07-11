import '@/styles/main.scss'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  const supabase = createClientComponentClient();
  
  return (
    <SessionContextProvider 
      supabaseClient={supabase}
      initialSession={pageProps.initialSession}
    >
      <Component {...pageProps} />
    </SessionContextProvider>
  )
}
