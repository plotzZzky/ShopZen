import { Inter } from 'next/font/google'
import NavBar from './comps/navbar'
import Footer from './comps/footer'
import './globals.css'


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ShopZen',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <header></header>

      <body className={inter.className}>

        {children}

        <Footer />
      </body>
    </html>
  )
}
