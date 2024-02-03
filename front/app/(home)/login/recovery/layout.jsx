import { Inter } from 'next/font/google'
import '../page.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Recuperar senha - ShopZen',
}

export default function RootLayout({ children }) {
  return (
    <section>
      {children}
    </section>
  )
}
