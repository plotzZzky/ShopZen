import { Inter } from 'next/font/google'
import '@/app/globals.css'
import '@app/app.css'


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Compras - ShopZen',
}

export default function RootLayout({ children }) {
  return (
    <section>
      {children}
    </section>
  )
}
