import { Inter } from 'next/font/google'
import NavBar from '@comps/navbar'
import Footer from '@comps/footer'
import '../../../globals.css'
import '../../page.css'


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
